import { ZodError } from "zod";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export function createSuccessResult<T>(data?: T): ActionResult<T> {
  return data !== undefined ? { success: true, data } : { success: true };
}

export function createErrorResult(error: unknown): ActionResult<never> {
  if (error instanceof ZodError) {
    const firstError = error.issues[0];
    return { success: false, error: firstError?.message || "Validation error" };
  }
  if (error instanceof Error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: "An unexpected error occurred" };
}
