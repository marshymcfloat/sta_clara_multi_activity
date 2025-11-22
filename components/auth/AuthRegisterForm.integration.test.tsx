import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthRegisterForm from "./AuthRegisterForm";
import { authRegisterAction } from "@/lib/actions/authActions";
import { authRegisterSchema } from "@/lib/zod schemas/authSchemas";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { stringCapitalizer } from "@/lib/utils";
import React from "react";

jest.mock("@/lib/actions/authActions");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));
jest.mock("@/lib/utils", () => ({
  stringCapitalizer: jest.fn((str: string) => str),
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Registration Flow Integration Tests", () => {
  const mockPush = jest.fn();
  const mockSetContent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
    (authRegisterAction as jest.Mock).mockClear();
    (stringCapitalizer as jest.Mock).mockImplementation((str: string) => str);
  });

  const renderForm = () => {
    const Wrapper = createWrapper();
    return render(
      <Wrapper>
        <AuthRegisterForm setContent={mockSetContent} />
      </Wrapper>
    );
  };

  const fillForm = async (overrides = {}) => {
    const defaultData = {
      email: "test@example.com",
      fullname: "juan dela cruz",
      password: "Password1!",
      confirmPassword: "Password1!",
      ...overrides,
    };

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^email$/i), defaultData.email);
    await user.type(screen.getByLabelText(/^fullname$/i), defaultData.fullname);

    const passwordInputs = screen.getAllByLabelText(/password/i);
    await user.type(passwordInputs[0], defaultData.password);
    await user.type(passwordInputs[1], defaultData.confirmPassword);

    return { user, defaultData };
  };

  describe("Complete Registration Flow", () => {
    it("successfully completes full registration flow from form to action", async () => {
      (authRegisterAction as jest.Mock).mockResolvedValue({
        success: true,
        message: "Account created successfully",
      });

      (stringCapitalizer as jest.Mock).mockReturnValue("Juan Dela Cruz");

      renderForm();
      const { user } = await fillForm();

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(authRegisterAction).toHaveBeenCalled();
        },
        { timeout: 5000 }
      );

      const callArgs = (authRegisterAction as jest.Mock).mock.calls[0][0];
      expect(callArgs).toEqual({
        email: "test@example.com",
        fullname: "juan dela cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Account created successfully"
        );
      });

      await waitFor(() => {
        const emailInput = screen.getByLabelText(
          /^email$/i
        ) as HTMLInputElement;
        expect(emailInput.value).toBe("");
      });

      await waitFor(() => {
        expect(mockSetContent).toHaveBeenCalledWith("LOGIN");
      });
    });

    it("validates data through schema before calling action", async () => {
      (authRegisterAction as jest.Mock).mockResolvedValue({
        success: true,
        message: "Account created successfully",
      });

      renderForm();
      const { user } = await fillForm({
        email: "invalid-email",
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          const errorMessages = screen.queryAllByRole("alert");
          const formErrors = screen.queryAllByText(/invalid|required/i);
          expect(authRegisterAction).not.toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      await waitFor(() => {
        expect(authRegisterAction).not.toHaveBeenCalled();
      });

      expect(toast.success).not.toHaveBeenCalled();
    });

    it("handles password mismatch validation correctly", async () => {
      renderForm();
      const { user } = await fillForm({
        password: "Password1!",
        confirmPassword: "Different1!",
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });

      expect(authRegisterAction).not.toHaveBeenCalled();
    });
  });

  describe("Schema Validation Integration", () => {
    it("rejects invalid email format through schema validation", async () => {
      renderForm();
      const { user } = await fillForm({
        email: "not-an-email",
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(authRegisterAction).not.toHaveBeenCalled();
      });
    });

    it("rejects weak password through schema validation", async () => {
      renderForm();
      const { user } = await fillForm({
        password: "weak",
        confirmPassword: "weak",
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(authRegisterAction).not.toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 8 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("rejects password without required character types", async () => {
      renderForm();
      const { user } = await fillForm({
        password: "password1",
        confirmPassword: "password1",
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(authRegisterAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("Server Action Integration", () => {
    it("propagates server action errors back to form", async () => {
      (authRegisterAction as jest.Mock).mockResolvedValue({
        success: false,
        error: "User already registered",
      });

      renderForm();
      const { user } = await fillForm();

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("User already registered");
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it("handles validation error from server action", async () => {
      (authRegisterAction as jest.Mock).mockResolvedValue({
        success: false,
        error: "Validation error",
      });

      renderForm();
      const { user } = await fillForm();

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Validation error");
      });
    });

    it("handles unexpected server errors gracefully", async () => {
      (authRegisterAction as jest.Mock).mockResolvedValue({
        success: false,
        error: "An unexpected error occurred",
      });

      renderForm();
      const { user } = await fillForm();

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "An unexpected error occurred"
        );
      });
    });
  });

  describe("Data Flow Integration", () => {
    it("correctly formats and passes data from form through schema to action", async () => {
      (authRegisterAction as jest.Mock).mockResolvedValue({
        success: true,
        message: "Account created successfully",
      });

      (stringCapitalizer as jest.Mock).mockReturnValue("Juan Dela Cruz");

      renderForm();
      const { user } = await fillForm({
        email: "  TEST@EXAMPLE.COM  ",
        fullname: "juan dela cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(authRegisterAction).toHaveBeenCalled();
        },
        { timeout: 5000 }
      );

      expect(authRegisterAction).toHaveBeenCalled();

      const callArgs = (authRegisterAction as jest.Mock).mock.calls[0][0];
      expect(callArgs).toHaveProperty("email");
      expect(callArgs).toHaveProperty("fullname", "juan dela cruz");
      expect(callArgs).toHaveProperty("password", "Password1!");
      expect(callArgs).toHaveProperty("confirmPassword", "Password1!");
    });

    it("validates all fields before allowing submission", async () => {
      renderForm();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/^email$/i), "test@example.com");

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(authRegisterAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("User Experience Integration", () => {
    it("shows loading state during submission", async () => {
      (authRegisterAction as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  success: true,
                  message: "Account created successfully",
                }),
              100
            );
          })
      );

      renderForm();
      const { user } = await fillForm();

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      await waitFor(
        () => {
          expect(submitButton).not.toBeDisabled();
        },
        { timeout: 200 }
      );
    });

    it("prevents multiple submissions", async () => {
      (authRegisterAction as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  success: true,
                  message: "Account created successfully",
                }),
              100
            );
          })
      );

      renderForm();
      const { user } = await fillForm();

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      await waitFor(
        () => {
          expect(authRegisterAction).toHaveBeenCalledTimes(1);
        },
        { timeout: 200 }
      );
    });

    it("allows back navigation without submitting", async () => {
      renderForm();
      const user = userEvent.setup();

      await fillForm();

      const backButton = screen.getByRole("button", { name: /back/i });
      await user.click(backButton);

      expect(authRegisterAction).not.toHaveBeenCalled();

      expect(mockSetContent).toHaveBeenCalledWith("LOGIN");
    });
  });

  describe("Edge Cases Integration", () => {
    it("handles maximum length fields correctly", async () => {
      const maxLengthEmail = "a".repeat(243) + "@example.com";
      const maxLengthFullname = "A".repeat(255);
      const maxLengthPassword = "Pass1!" + "a".repeat(44);

      const schemaResult = authRegisterSchema.safeParse({
        email: maxLengthEmail,
        fullname: maxLengthFullname,
        password: maxLengthPassword,
        confirmPassword: maxLengthPassword,
      });

      expect(schemaResult.success).toBe(true);

      (authRegisterAction as jest.Mock).mockResolvedValue({
        success: true,
        message: "Account created successfully",
      });

      expect(schemaResult.success).toBe(true);
    });

    it("handles minimum length password correctly", async () => {
      const minPassword = "Pass1!@a";

      const schemaResult = authRegisterSchema.safeParse({
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: minPassword,
        confirmPassword: minPassword,
      });

      expect(schemaResult.success).toBe(true);

      (authRegisterAction as jest.Mock).mockResolvedValue({
        success: true,
        message: "Account created successfully",
      });

      renderForm();
      const { user } = await fillForm({
        password: minPassword,
        confirmPassword: minPassword,
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(authRegisterAction).toHaveBeenCalled();
      });
    });
  });

  describe("Error Recovery Integration", () => {
    it("allows form resubmission after error", async () => {
      (authRegisterAction as jest.Mock)
        .mockResolvedValueOnce({
          success: false,
          error: "User already registered",
        })
        .mockResolvedValueOnce({
          success: true,
          message: "Account created successfully",
        });

      renderForm();
      const { user } = await fillForm();

      const submitButton = screen.getByRole("button", { name: /register/i });

      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("User already registered");
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Account created successfully"
        );
      });

      expect(authRegisterAction).toHaveBeenCalledTimes(2);
    });
  });
});
