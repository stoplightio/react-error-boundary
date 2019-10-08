import * as React from 'react';
import { FallbackProps } from './types';

const refreshPage = () => {
  window.location.reload();
};

export const FallbackComponent: React.FunctionComponent<FallbackProps & { className?: string }> = ({
  className,
  tryRecovering,
}) => (
  <div className={className}>
    <h2>Gah. The component just crashed</h2>
    <p>You can try reloading component or refresh the page.</p>
    <button onClick={tryRecovering} type="button">
      Reload component
    </button>
    <button onClick={refreshPage} type="button">
      Refresh page
    </button>
  </div>
);
