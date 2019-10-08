import * as React from 'react';
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

  protected handleError(error: Error, errorInfo: React.ErrorInfo | null) {
    if (this.props.reportErrors !== false) {
      try {
        this.context.reportError(error);
      } catch (ex) {
        console.error('Error could not be reported', ex);
      }
    }

    if (this.props.onError !== void 0) {
      try {
        this.props.onError(error, errorInfo && errorInfo.componentStack);
      } catch {
        // happens
      }
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
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn('Component has not crashed. Recovering is a no-op in such case');
    }
  };

  public render() {
    const {
      props: { FallbackComponent: Fallback = FallbackComponent, children },
      state: { error, componentStack },
    } = this;

    if (error !== null) {
      return <Fallback error={error} componentStack={componentStack} tryRecovering={this.recover} />;
    }

    return children;
  }
}
