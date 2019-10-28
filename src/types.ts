import * as React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export type ErrorBoundaryState = {
  error: Error | null;
  componentStack: string | null;
};

// follows react-error-boundary https://github.com/bvaughn/react-error-boundary
export type FallbackProps = ErrorBoundaryState & {
  // this is our own addition
  tryRecovering(): void;
};

export type ErrorBoundaryProps<P extends object = {}> = {
  onError?: ErrorEventHandler;
  FallbackComponent?: React.ComponentType<FallbackProps>;

  // these are our own additions
  recoverableProps?: Array<keyof P>;
  reportErrors?: boolean; // true by default
};

export type ErrorBoundaryForwardedProps = {
  boundaryRef: React.RefObject<ErrorBoundary>;
};

export type ErrorEventHandler = (error: Error, componentStack: string | null) => void;
