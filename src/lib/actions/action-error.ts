/**
 * Centralized error handler for Server Actions.
 * 
 * Safely processes unknown errors thrown by the service or repository layers.
 * - Passes expected domain validation/conflict messages directly to the client.
 * - Logs unexpected server errors (e.g. database disconnects) to the console.
 * - Obfuscates unexpected errors from the client to prevent security leaks.
 * 
 * @param error The raw unknown error caught in the Server Action.
 * @returns A standardized { success: false, error: string } object.
 */
export function handleActionError(error: unknown): { success: false; error: string } {
  const message = error instanceof Error ? error.message : String(error);

  // Expected Domain Errors that are safe to show the user
  if (
    message.startsWith("Validation Error") ||
    message.startsWith("Conflict Error") ||
    message.startsWith("Not Found")
  ) {
    return { success: false, error: message };
  }

  // Unexpected Server Errors (Log securely, don't leak details)
  console.error("🚨 [Server Action Error]:", error);
  
  return { 
    success: false, 
    error: "An unexpected error occurred. Please try again later." 
  };
}
