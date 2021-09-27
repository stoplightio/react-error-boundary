import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { FallbackRender } from '@sentry/react/dist/errorboundary';
import * as React from 'react';
import { FallbackComponent } from './FallbackComponent';
import { ErrorBoundaryProps, FallbackProps } from './types';

const wrapFallback = (Component: React.ElementType<FallbackProps>): FallbackRender => {
  return props => (
    <Component error={props.error} componentStack={props.componentStack} tryRecovering={props.resetError} />
  );
};

type GenericProps = Record<string, unknown>;

function usePrev(value: GenericProps) {
  const ref = React.useRef<GenericProps>();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps<GenericProps> & GenericProps> = props => {
  const fallback = props.FallbackComponent || FallbackComponent;
  const ActualFallback = React.useMemo<FallbackRender>(() => wrapFallback(fallback), [fallback]);

  const boundaryRef = React.useRef<SentryErrorBoundary | null>(null);
  const prevProps = usePrev(props);

  React.useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary || !prevProps || !boundary.state.error || !props.recoverableProps) return;

    for (const recoverableProp of props.recoverableProps) {
      if (prevProps[recoverableProp] !== props[recoverableProp]) {
        boundary.resetErrorBoundary();
      }
    }
  }, [props]);

  return (
    <SentryErrorBoundary ref={boundaryRef} showDialog={false} fallback={ActualFallback} onError={props.onError}>
      {props.children}
    </SentryErrorBoundary>
  );
};
