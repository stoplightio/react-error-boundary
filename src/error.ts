import * as React from 'react';

export class GenericReactErrorBoundaryError extends Error {
  public readonly name = 'GenericReactErrorBoundaryError';
  public readonly message: string;
  public readonly componentStack: string | null;

  constructor(origError: Error, errorInfo: React.ErrorInfo | null) {
    super();

    this.message = origError.message;
    this.componentStack = errorInfo === null ? null : errorInfo.componentStack;
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      componentStack: this.componentStack,
    };
  }
}
