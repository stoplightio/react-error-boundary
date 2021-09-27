import * as React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorBoundaryForwardedProps, ErrorBoundaryProps } from './types';

// inspired by https://github.com/bvaughn/react-error-boundary/blob/master/src/ErrorBoundary.js#L66
export const withErrorBoundary = <P extends object = {}>(
  Component: React.ComponentType<P & ErrorBoundaryForwardedProps>,
  boundaryProps?: ErrorBoundaryProps<P>,
): React.FunctionComponent<P & ErrorBoundaryProps> => {
  const Wrapped: React.FunctionComponent<P> = props => {
    const ref = React.createRef<typeof ErrorBoundary>();
    return React.createElement(
      ErrorBoundary,
      {
        ...boundaryProps,
        ...props,
        ref,
      },
      React.createElement(Component, { ...props, boundaryRef: ref }),
    );
  };

  // Format for display in DevTools
  const name = Component.displayName || Component.name;
  Wrapped.displayName = name ? `WithErrorBoundary(${name})` : 'WithErrorBoundary';

  return Wrapped;
};
