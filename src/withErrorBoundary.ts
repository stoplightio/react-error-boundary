import * as React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorBoundaryProps } from './types';

// inspired by https://github.com/bvaughn/react-error-boundary/blob/master/src/ErrorBoundary.js#L66
export const withErrorBoundary = <P extends object = {}>(
  Component: React.ComponentType<P>,
  boundaryProps?: ErrorBoundaryProps<P>,
): React.FunctionComponent<P> => {
  const Wrapped: React.FunctionComponent<P> = props =>
    React.createElement(
      ErrorBoundary,
      {
        ...props,
        ...boundaryProps,
      },
      React.createElement(Component, props),
    );

  // Format for display in DevTools
  const name = Component.displayName || Component.name;
  Wrapped.displayName = name ? `WithErrorBoundary(${name})` : 'WithErrorBoundary';

  return Wrapped;
};
