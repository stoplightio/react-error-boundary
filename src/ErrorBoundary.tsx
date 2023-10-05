import * as React from 'react';
import { GenericReactErrorBoundaryError } from './error';
import { ErrorBoundaryContext } from './ErrorBoundaryProvider';
import { FallbackComponent } from './FallbackComponent';
import { ErrorBoundaryProps, ErrorBoundaryState } from './types';

export class ErrorBoundary<P extends object = {}> extends React.PureComponent<
  P & ErrorBoundaryProps<P>,
  ErrorBoundaryState
> {
  public static contextType = ErrorBoundaryContext;
  public context!: React.ContextType<typeof ErrorBoundaryContext>;

  public state = {
    error: null,
    componentStack: null,
  };

  public componentDidUpdate(prevProps: Readonly<P & ErrorBoundaryProps<P>>) {
    if (
      this.state.error !== null &&
      this.props.recoverableProps !== void 0 &&
      Array.isArray(this.props.recoverableProps)
    ) {
      for (const recoverableProp of this.props.recoverableProps) {
        if (prevProps[recoverableProp] !== this.props[recoverableProp]) {
          this.setError(null);
          break;
        }
      }
    }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setError(error, errorInfo.componentStack);
    this.handleError(error, errorInfo);
  }

  protected handleError(origError: Error, errorInfo: React.ErrorInfo | null) {
    const error = new GenericReactErrorBoundaryError(origError, errorInfo);

    if (this.props.reportErrors !== false) {
      this.context.reporter.error(error);
    }

    if (typeof this.props.onError === 'function') {
      this.props.onError(error);
    }
  }

  public throwError = (error: Error) => {
    this.setError(error);
    this.handleError(error, null);
  };

  protected setError(error: Error | null, componentStack: string | null = null) {
    this.setState({ error, componentStack });
  }

  protected recover = () => {
    if (this.state.error !== null) {
      this.setError(null);
    }
  };

  public render() {
    const {
      props: { FallbackComponent: Fallback = this.context.FallbackComponent || FallbackComponent, children },
      state: { error, componentStack },
    } = this;

    if (error !== null) {
      return <Fallback error={error} componentStack={componentStack} tryRecovering={this.recover} />;
    }

    return children;
  }
}
