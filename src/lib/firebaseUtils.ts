// src/lib/firebaseUtils.ts

export type OperationType = 'add' | 'update' | 'delete';

/**
 * Handles Firestore errors and returns a user-friendly message.
 * @param error - The error object from Firestore
 * @param operation - The type of operation being performed
 * @returns A string message describing the error
 */
export function handleFirestoreError(error: any, operation: OperationType): string {
  if (error && error.message) {
    return `Failed to ${operation} data: ${error.message}`;
  }
  return `An unknown error occurred during ${operation} operation.`;
}
