// Helper function to extract human-readable error message from RTK Query error union
export const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  // Check if it's a plain string error
  if (typeof error === 'string') {
    return error;
  }
  
  // Check if it's an error object with an error property
  if (error && typeof error === 'object' && 'error' in error) {
    const errorObj = error as Record<string, unknown>;
    if (typeof errorObj.error === 'string') {
      return errorObj.error;
    }
  }
  
  // Check if it's an error object with a data property
  if (error && typeof error === 'object' && 'data' in error) {
    const errorObj = error as Record<string, unknown>;
    if (typeof errorObj.data === 'string') {
      return errorObj.data;
    }
    // Check if data has a message property
    if (errorObj.data && typeof errorObj.data === 'object' && 'message' in errorObj.data) {
      const dataObj = errorObj.data as Record<string, unknown>;
      if (typeof dataObj.message === 'string') {
        return dataObj.message;
      }
    }
  }
  
  // Check if error has a message property directly
  if (error && typeof error === 'object' && 'message' in error) {
    const errorObj = error as Record<string, unknown>;
    if (typeof errorObj.message === 'string') {
      return errorObj.message;
    }
  }
  
  // Check for status-based errors (e.g., { status: 404, error: "Not Found" })
  if (error && typeof error === 'object' && 'status' in error) {
    const errorObj = error as Record<string, unknown>;
    if (typeof errorObj.status === 'number' && errorObj.status >= 400) {
      // Try to get a descriptive error message
      if (typeof errorObj.error === 'string') {
        return `${errorObj.error} (${errorObj.status})`;
      }
      // Fall back to generic HTTP status message
      return `HTTP ${errorObj.status}`;
    }
  }
  
  // Fall back to the provided fallback message
  return fallbackMessage;
};