import { authRegisterSchema, authLoginSchema } from "./authSchemas";

describe("authRegisterSchema", () => {
  describe("Valid Inputs", () => {
    it("passes validation with valid registration data", () => {
      const validData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = authRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("passes validation with email at max length (255 chars)", () => {
      const longEmail = "a".repeat(243) + "@example.com";
      const validData = {
        email: longEmail,
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = authRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("passes validation with fullname at max length (255 chars)", () => {
      const longName = "A".repeat(255);
      const validData = {
        email: "test@example.com",
        fullname: longName,
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = authRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("passes validation with password at min length (8 chars)", () => {
      const validData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Pass1!@a",
        confirmPassword: "Pass1!@a",
      };

      const result = authRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("passes validation with password at max length (50 chars)", () => {
      const longPassword = "Password1!" + "a".repeat(40);
      const validData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: longPassword,
        confirmPassword: longPassword,
      };

      const result = authRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("Email Validation", () => {
    it("fails validation for empty email", () => {
      const invalidData = {
        email: "",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages.some((msg) => msg.includes("Email"))).toBe(true);
      }
    });

    it("fails validation for invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues
          .map((e) => e.message)
          .join(", ");
        expect(errorMessages.toLowerCase()).toContain("email");
      }
    });

    it("fails validation for email without @ symbol", () => {
      const invalidData = {
        email: "testexample.com",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("fails validation for email exceeding 255 characters", () => {
      const longEmail = "a".repeat(244) + "@example.com";
      const invalidData = {
        email: longEmail,
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain(
          "Email must be less than 255 characters"
        );
      }
    });
  });

  describe("Fullname Validation", () => {
    it("fails validation for empty fullname", () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain("Full name is required");
      }
    });

    it("fails validation for fullname exceeding 255 characters", () => {
      const longName = "A".repeat(256);
      const invalidData = {
        email: "test@example.com",
        fullname: longName,
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain(
          "Full name must be less than 255 characters"
        );
      }
    });
  });

  describe("Password Validation", () => {
    it("fails validation for empty password", () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "",
        confirmPassword: "",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(
          errorMessages.some((msg) =>
            msg.includes("Password must be at least 8 characters")
          )
        ).toBe(true);
      }
    });

    it("fails validation for password less than 8 characters", () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Pass1!",
        confirmPassword: "Pass1!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain(
          "Password must be at least 8 characters"
        );
      }
    });

    it("fails validation for password without uppercase letter", () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "password1!",
        confirmPassword: "password1!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        const regexError = errorMessages.find((msg) =>
          msg.includes("uppercase letter")
        );
        expect(regexError).toBeDefined();
      }
    });

    it("fails validation for password without lowercase letter", () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "PASSWORD1!",
        confirmPassword: "PASSWORD1!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        const regexError = errorMessages.find((msg) =>
          msg.includes("lowercase letter")
        );
        expect(regexError).toBeDefined();
      }
    });

    it("fails validation for password without number", () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password!",
        confirmPassword: "Password!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        const regexError = errorMessages.find((msg) =>
          msg.includes("uppercase letter")
        );
        expect(regexError).toBeDefined();
        expect(regexError).toContain("number");
      }
    });

    it("fails validation for password without special character", () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password1",
        confirmPassword: "Password1",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        const regexError = errorMessages.find((msg) =>
          msg.includes("special character")
        );
        expect(regexError).toBeDefined();
      }
    });

    it("fails validation for password exceeding 50 characters", () => {
      const longPassword = "Pass1!" + "a".repeat(45);
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: longPassword,
        confirmPassword: longPassword,
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain(
          "Password must be less than 50 characters"
        );
      }
    });
  });

  describe("Confirm Password Validation", () => {
    it("fails validation for empty confirmPassword", () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain("Confirm password is required");
      }
    });

    it("fails validation when passwords do not match", () => {
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Different1!",
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain("Passwords do not match");
      }
    });

    it("fails validation when confirmPassword exceeds 50 characters", () => {
      const longPassword = "Pass1!" + "a".repeat(45);
      const invalidData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: longPassword,
      };

      const result = authRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain(
          "Confirm password must be less than 50 characters"
        );
      }
    });

    it("passes validation when passwords match", () => {
      const validData = {
        email: "test@example.com",
        fullname: "Juan Dela Cruz",
        password: "Password1!",
        confirmPassword: "Password1!",
      };

      const result = authRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});

describe("authLoginSchema", () => {
  describe("Valid Inputs", () => {
    it("passes validation with valid login data", () => {
      const validData = {
        email: "test@example.com",
        password: "Password123",
      };

      const result = authLoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("passes validation with email at max length (255 chars)", () => {
      const longEmail = "a".repeat(243) + "@example.com";
      const validData = {
        email: longEmail,
        password: "Password123",
      };

      const result = authLoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("passes validation with password at min length (8 chars)", () => {
      const validData = {
        email: "test@example.com",
        password: "Password",
      };

      const result = authLoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("passes validation with password at max length (50 chars)", () => {
      const longPassword = "Password" + "1".repeat(42);
      const validData = {
        email: "test@example.com",
        password: longPassword,
      };

      const result = authLoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("Email Validation", () => {
    it("fails validation for empty email", () => {
      const invalidData = {
        email: "",
        password: "Password123",
      };

      const result = authLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages.some((msg) => msg.includes("Email"))).toBe(true);
      }
    });

    it("fails validation for invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
        password: "Password123",
      };

      const result = authLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues
          .map((e) => e.message)
          .join(", ");
        expect(errorMessages.toLowerCase()).toContain("email");
      }
    });

    it("fails validation for email exceeding 255 characters", () => {
      const longEmail = "a".repeat(244) + "@example.com";
      const invalidData = {
        email: longEmail,
        password: "Password123",
      };

      const result = authLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain(
          "Email must be less than 255 characters"
        );
      }
    });
  });

  describe("Password Validation", () => {
    it("fails validation for empty password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = authLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain(
          "Password must be at least 8 characters"
        );
      }
    });

    it("fails validation for password less than 8 characters", () => {
      const invalidData = {
        email: "test@example.com",
        password: "Pass123",
      };

      const result = authLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain(
          "Password must be at least 8 characters"
        );
      }
    });

    it("fails validation for password exceeding 50 characters", () => {
      const longPassword = "Password" + "1".repeat(43);
      const invalidData = {
        email: "test@example.com",
        password: longPassword,
      };

      const result = authLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((e) => e.message);
        expect(errorMessages).toContain(
          "Password must be less than 50 characters"
        );
      }
    });
  });
});
