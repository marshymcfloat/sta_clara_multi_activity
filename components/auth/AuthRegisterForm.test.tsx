import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthRegisterForm from "./AuthRegisterForm";
import { authRegisterAction } from "@/lib/actions/authActions";
import { toast } from "sonner";

jest.mock("@/lib/actions/authActions", () => ({
  authRegisterAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("AuthRegisterForm", () => {
  const mockSetContent = jest.fn();
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = createWrapper();
  });

  describe("Rendering", () => {
    it("renders all form input fields", () => {
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^fullname$/i)).toBeInTheDocument();
      const passwordFields = screen.getAllByLabelText(/password/i);
      expect(passwordFields.length).toBe(2);
      expect(screen.getByLabelText(/confirmPassword/i)).toBeInTheDocument();
    });

    it("email field has type='email' attribute", () => {
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("password fields have type='password' attribute", () => {
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const passwordInputs = screen.getAllByLabelText(/password/i);
      passwordInputs.forEach((input) => {
        expect(input).toHaveAttribute("type", "password");
      });
    });

    it("fullname field has type='text' attribute", () => {
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const fullnameInput = screen.getByLabelText(/fullname/i);
      expect(fullnameInput).toHaveAttribute("type", "text");
    });

    it("displays correct form labels", () => {
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      expect(screen.getByText(/^email$/i)).toBeInTheDocument();
      expect(screen.getByText(/^fullname$/i)).toBeInTheDocument();
      expect(screen.getByText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByText(/^confirmPassword$/i)).toBeInTheDocument();
    });

    it("displays correct placeholders", () => {
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      expect(
        screen.getByPlaceholderText("example@example.com")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("etc. Juan Dela Cruz")
      ).toBeInTheDocument();
      expect(
        screen.getAllByPlaceholderText("********").length
      ).toBeGreaterThanOrEqual(2);
    });

    it("renders Back button", () => {
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    });

    it("renders Register button", () => {
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      expect(
        screen.getByRole("button", { name: /register/i })
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("shows error message for empty email field", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          const emailInput = screen.getByLabelText(/^email$/i);
          expect(emailInput).toHaveAttribute("aria-invalid", "true");
        },
        { timeout: 5000 }
      );
    });

    it("shows error message for invalid email format", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "invalid-email");
      await user.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/email/i)).toBeInTheDocument();
      });
    });

    it("shows error message for empty fullname field", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      });
    });

    it("shows error message for password less than 8 characters", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const passwordInput = screen.getAllByLabelText(/password/i)[0];
      await user.type(passwordInput, "Short1!");
      await user.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 8 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("shows error message for password without uppercase", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const passwordInput = screen.getAllByLabelText(/password/i)[0];
      await user.type(passwordInput, "password1!");
      await user.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/uppercase letter/i)).toBeInTheDocument();
      });
    });

    it("shows error message for password without lowercase", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const passwordInput = screen.getAllByLabelText(/password/i)[0];
      await user.type(passwordInput, "PASSWORD1!");
      await user.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/lowercase letter/i)).toBeInTheDocument();
      });
    });

    it("shows error message for password without number", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const passwordInput = screen.getAllByLabelText(/password/i)[0];
      await user.type(passwordInput, "Password!");
      await user.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/number/i)).toBeInTheDocument();
      });
    });

    it("shows error message for password without special character", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const passwordInput = screen.getAllByLabelText(/password/i)[0];
      await user.type(passwordInput, "Password1");
      await user.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/special character/i)).toBeInTheDocument();
      });
    });

    it("shows error message when passwords don't match", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const passwordInputs = screen.getAllByLabelText(/password/i);
      await user.type(passwordInputs[0], "Password1!");
      await user.type(passwordInputs[1], "Different1!");
      await user.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it("shows error message for empty password field", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });
  });

  describe("User Interaction", () => {
    it("calls setContent with 'LOGIN' when Back button is clicked", async () => {
      const user = userEvent.setup();
      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      const backButton = screen.getByRole("button", { name: /back/i });
      await user.click(backButton);

      expect(mockSetContent).toHaveBeenCalledWith("LOGIN");
    });

    it("disables submit button during form submission", async () => {
      const user = userEvent.setup();
      const mockRegisterAction = authRegisterAction as jest.MockedFunction<
        typeof authRegisterAction
      >;

      mockRegisterAction.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () => resolve({ success: true, message: "Success" }),
              10000
            );
          })
      );

      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/fullname/i), "Juan Dela Cruz");
      const passwordInputs = screen.getAllByLabelText(/password/i);
      await user.type(passwordInputs[0], "Password1!");
      await user.type(passwordInputs[1], "Password1!");

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      const backButton = screen.getByRole("button", { name: /back/i });
      expect(backButton).toBeDisabled();
    });

    it("submits form with valid data without validation errors", async () => {
      const user = userEvent.setup();
      const mockRegisterAction = authRegisterAction as jest.MockedFunction<
        typeof authRegisterAction
      >;

      mockRegisterAction.mockResolvedValue({
        success: true,
        message: "Account created successfully",
      });

      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      await user.type(screen.getByLabelText(/^email$/i), "test@example.com");
      await user.type(screen.getByLabelText(/^fullname$/i), "Juan Dela Cruz");
      const passwordInputs = screen.getAllByLabelText(/password/i);
      await user.type(passwordInputs[0], "Password1!");
      await user.type(passwordInputs[1], "Password1!");

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          const errorMessages = screen.queryAllByRole("alert");
          const formErrors = screen.queryAllByText(/required|invalid|must/i);
          expect(mockRegisterAction).toHaveBeenCalled();
        },
        { timeout: 5000 }
      );
    });

    it("shows success toast and switches to login on successful registration", async () => {
      const user = userEvent.setup();
      const mockRegisterAction = authRegisterAction as jest.MockedFunction<
        typeof authRegisterAction
      >;
      mockRegisterAction.mockResolvedValue({
        success: true,
        message: "Account created successfully",
      });

      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/fullname/i), "Juan Dela Cruz");
      const passwordInputs = screen.getAllByLabelText(/password/i);
      await user.type(passwordInputs[0], "Password1!");
      await user.type(passwordInputs[1], "Password1!");

      await user.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Account created successfully"
        );
        expect(mockSetContent).toHaveBeenCalledWith("LOGIN");
      });
    });

    it("shows error toast on registration failure", async () => {
      const user = userEvent.setup();
      const mockRegisterAction = authRegisterAction as jest.MockedFunction<
        typeof authRegisterAction
      >;
      mockRegisterAction.mockResolvedValue({
        success: false,
        error: "Email already exists",
      });

      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/fullname/i), "Juan Dela Cruz");
      const passwordInputs = screen.getAllByLabelText(/password/i);
      await user.type(passwordInputs[0], "Password1!");
      await user.type(passwordInputs[1], "Password1!");

      await user.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Email already exists");
      });

      expect(mockSetContent).not.toHaveBeenCalled();
    });

    it("resets form after successful registration", async () => {
      const user = userEvent.setup();
      const mockRegisterAction = authRegisterAction as jest.MockedFunction<
        typeof authRegisterAction
      >;
      mockRegisterAction.mockResolvedValue({
        success: true,
        message: "Account created successfully",
      });

      render(<AuthRegisterForm setContent={mockSetContent} />, {
        wrapper,
      });

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/fullname/i), "Juan Dela Cruz");
      const passwordInputs = screen.getAllByLabelText(/password/i);
      await user.type(passwordInputs[0], "Password1!");
      await user.type(passwordInputs[1], "Password1!");

      await user.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(mockSetContent).toHaveBeenCalledWith("LOGIN");
        expect(screen.getByLabelText(/email/i)).toHaveValue("");
        expect(screen.getByLabelText(/fullname/i)).toHaveValue("");
      });
    });
  });
});
