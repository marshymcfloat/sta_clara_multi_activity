import {
  authRegisterAction,
  authLoginAction,
  deleteAccountAction,
  logoutAction,
} from "./authActions";
import { createClient } from "../supabase/server";
import { createClient as createServiceRoleClient } from "@supabase/supabase-js";
import { stringCapitalizer } from "../utils";

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => []),
    set: jest.fn(),
  })),
}));

jest.mock("../supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}));

jest.mock("../utils", () => ({
  stringCapitalizer: jest.fn((str: string) => str),
}));

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

describe("authRegisterAction", () => {
  let mockSupabase: any;
  let mockSignUp: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSignUp = jest.fn();
    mockSupabase = {
      auth: {
        signUp: mockSignUp,
      },
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe("Success Cases", () => {
    it("successfully registers a new user with valid data", async () => {
      const validData = {
        email: "test@example.com",
        fullname: "juan dela cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      (stringCapitalizer as jest.Mock).mockReturnValue("Juan Dela Cruz");
      mockSignUp.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      const result = await authRegisterAction(validData);

      expect(result).toEqual({
        success: true,
        message: "Account created successfully",
      });
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password1!",
        options: {
          data: {
            fullname: "Juan Dela Cruz",
          },
        },
      });
      expect(stringCapitalizer).toHaveBeenCalledWith("juan dela cruz");
    });

    it("capitalizes fullname correctly", async () => {
      const validData = {
        email: "test@example.com",
        fullname: "maria santos",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      (stringCapitalizer as jest.Mock).mockReturnValue("Maria Santos");
      mockSignUp.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      await authRegisterAction(validData);

      expect(stringCapitalizer).toHaveBeenCalledWith("maria santos");
      expect(mockSignUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: {
            data: {
              fullname: "Maria Santos",
            },
          },
        })
      );
    });
  });

  describe("Validation Errors", () => {
    it("returns validation error for invalid email", async () => {
      const invalidData = {
        email: "invalid-email",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = await authRegisterAction(invalidData);

      expect(result).toEqual({
        success: false,
        error: "Validation error",
      });
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    it("returns validation error for password less than 8 characters", async () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Pass1!",
        confirmPassword: "Pass1!",
      };

      const result = await authRegisterAction(invalidData);

      expect(result).toEqual({
        success: false,
        error: "Validation error",
      });
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    it("returns validation error for passwords that do not match", async () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Different1!",
      };

      const result = await authRegisterAction(invalidData);

      expect(result).toEqual({
        success: false,
        error: "Validation error",
      });
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    it("returns validation error for empty fullname", async () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = await authRegisterAction(invalidData);

      expect(result).toEqual({
        success: false,
        error: "Validation error",
      });
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  describe("Supabase Errors", () => {
    it("returns error message when user already exists", async () => {
      const validData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      mockSignUp.mockResolvedValue({
        data: { user: null },
        error: { message: "User already registered" },
      });

      const result = await authRegisterAction(validData);

      expect(result).toEqual({
        success: false,
        error: "User already registered",
      });
    });

    it("returns error message for invalid email format from Supabase", async () => {
      const validData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      mockSignUp.mockResolvedValue({
        data: { user: null },
        error: { message: "Invalid email" },
      });

      const result = await authRegisterAction(validData);

      expect(result).toEqual({
        success: false,
        error: "Invalid email",
      });
    });
  });

  describe("Unexpected Errors", () => {
    it("handles unexpected errors gracefully", async () => {
      const validData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      (createClient as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await authRegisterAction(validData);

      expect(result).toEqual({
        success: false,
        error: "An unexpected error occurred",
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});

describe("authLoginAction", () => {
  let mockSupabase: any;
  let mockSignInWithPassword: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSignInWithPassword = jest.fn();
    mockSupabase = {
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe("Success Cases", () => {
    it("successfully logs in with valid credentials", async () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
      };

      const mockUser = { id: "user-123", email: "test@example.com" };

      mockSignInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authLoginAction(validData);

      expect(result).toEqual({
        success: true,
        message: "Login successful",
        data: "user-123",
      });
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password123",
      });
    });

    it("returns user id in response data", async () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
      };

      const mockUser = { id: "user-456", email: "test@example.com" };

      mockSignInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authLoginAction(validData);

      expect(result.success).toBe(true);
      expect((result as any).data).toBe("user-456");
    });
  });

  describe("Validation Errors", () => {
    it("returns validation error for invalid email format", async () => {
      const invalidData = {
        email: "invalid-email",
        password: "Password123",
      };

      const result = await authLoginAction(invalidData);

      expect(result).toEqual({
        success: false,
        error: "Validation error",
      });
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });

    it("returns validation error for password less than 8 characters", async () => {
      const invalidData = {
        email: "test@example.com",
        password: "Pass123",
      };

      const result = await authLoginAction(invalidData);

      expect(result).toEqual({
        success: false,
        error: "Validation error",
      });
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });

    it("returns validation error for empty email", async () => {
      const invalidData = {
        email: "",
        password: "Password123",
      };

      const result = await authLoginAction(invalidData);

      expect(result).toEqual({
        success: false,
        error: "Validation error",
      });
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });
  });

  describe("Authentication Errors", () => {
    it("returns error for invalid credentials", async () => {
      const validData = {
        email: "test@example.com",
        password: "WrongPassword123",
      };

      mockSignInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: "Invalid login credentials" },
      });

      const result = await authLoginAction(validData);

      expect(result).toEqual({
        success: false,
        error: "Invalid login credentials",
      });
    });

    it("returns 'Invalid credentials' when user is null and no error message", async () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
      };

      mockSignInWithPassword.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await authLoginAction(validData);

      expect(result).toEqual({
        success: false,
        error: "Invalid credentials",
      });
    });

    it("returns error message when error exists but no user", async () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
      };

      mockSignInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: "Email not confirmed" },
      });

      const result = await authLoginAction(validData);

      expect(result).toEqual({
        success: false,
        error: "Email not confirmed",
      });
    });
  });

  describe("Unexpected Errors", () => {
    it("handles unexpected errors gracefully", async () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
      };

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      (createClient as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await authLoginAction(validData);

      expect(result).toEqual({
        success: false,
        error: "An unexpected error occurred",
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});

describe("deleteAccountAction", () => {
  let mockSupabaseUser: any;
  let mockSupabaseAdmin: any;
  let mockGetUser: jest.Mock;
  let mockDeleteUser: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetUser = jest.fn();
    mockDeleteUser = jest.fn();

    mockSupabaseUser = {
      auth: {
        getUser: mockGetUser,
      },
    };

    mockSupabaseAdmin = {
      auth: {
        admin: {
          deleteUser: mockDeleteUser,
        },
      },
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabaseUser);
    (createServiceRoleClient as jest.Mock).mockReturnValue(mockSupabaseAdmin);
  });

  describe("Success Cases", () => {
    it("successfully deletes user account", async () => {
      const mockUser = { id: "user-123", email: "test@example.com" };

      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockDeleteUser.mockResolvedValue({
        error: null,
      });

      const result = await deleteAccountAction();

      expect(result).toEqual({
        success: true,
        message: "Account deleted successfully",
      });
      expect(mockDeleteUser).toHaveBeenCalledWith("user-123");
    });
  });

  describe("Authentication Errors", () => {
    it("returns error when user is not logged in", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await deleteAccountAction();

      expect(result).toEqual({
        success: false,
        error: "Login first",
      });
      expect(mockDeleteUser).not.toHaveBeenCalled();
    });

    it("returns error message when getUser fails", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Session expired" },
      });

      const result = await deleteAccountAction();

      expect(result).toEqual({
        success: false,
        error: "Session expired",
      });
      expect(mockDeleteUser).not.toHaveBeenCalled();
    });

    it("returns 'Login first' when userError exists but no message", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: {},
      });

      const result = await deleteAccountAction();

      expect(result).toEqual({
        success: false,
        error: "Login first",
      });
      expect(mockDeleteUser).not.toHaveBeenCalled();
    });
  });

  describe("Deletion Errors", () => {
    it("returns error message when deleteUser fails", async () => {
      const mockUser = { id: "user-123", email: "test@example.com" };

      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockDeleteUser.mockResolvedValue({
        error: { message: "Failed to delete user" },
      });

      const result = await deleteAccountAction();

      expect(result).toEqual({
        success: false,
        error: "Failed to delete user",
      });
    });

    it("returns default error message when deleteUser fails without message", async () => {
      const mockUser = { id: "user-123", email: "test@example.com" };

      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockDeleteUser.mockResolvedValue({
        error: {},
      });

      const result = await deleteAccountAction();

      expect(result).toEqual({
        success: false,
        error: "Failed to delete account",
      });
    });
  });

  describe("Unexpected Errors", () => {
    it("handles unexpected errors gracefully", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      (createClient as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await deleteAccountAction();

      expect(result).toEqual({
        success: false,
        error: "An unexpected error occurred",
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});

describe("logoutAction", () => {
  let mockSupabase: any;
  let mockSignOut: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSignOut = jest.fn();
    mockSupabase = {
      auth: {
        signOut: mockSignOut,
      },
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe("Success Cases", () => {
    it("successfully logs out user", async () => {
      mockSignOut.mockResolvedValue({
        error: null,
      });

      const result = await logoutAction();

      expect(result).toEqual({
        success: true,
        message: "Logout successful",
      });
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe("Logout Errors", () => {
    it("returns error message when signOut fails", async () => {
      mockSignOut.mockResolvedValue({
        error: { message: "Failed to logout" },
      });

      const result = await logoutAction();

      expect(result).toEqual({
        success: false,
        error: "Failed to logout",
      });
    });

    it("returns default error message when signOut fails without message", async () => {
      mockSignOut.mockResolvedValue({
        error: {},
      });

      const result = await logoutAction();

      expect(result).toEqual({
        success: false,
        error: "Failed to logout",
      });
    });
  });

  describe("Unexpected Errors", () => {
    it("handles unexpected errors gracefully", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      (createClient as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await logoutAction();

      expect(result).toEqual({
        success: false,
        error: "An unexpected error occurred",
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
