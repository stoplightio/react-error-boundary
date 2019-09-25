import * as React from 'react';
import { FallbackProps } from './types';

export const FallbackComponent: React.FunctionComponent<FallbackProps> = ({ error, tryRecovering }) => {
  return (
    <div className="bg-gray-1 dark:bg-gray-8 flex items-center flex-col justify-center h-full dark:text-lighten-6 text-darken-6">
      <p className="text-bold text-xl">We encountered an error. You can try reloading component or refresh the page.</p>
      <button className="m-4" onClick={tryRecovering}>
        Reload Component
      </button>

      <details className="w-1/2 text-center mt-8">
        <summary>Error Details</summary>

        <pre className="w-full mt-6">{error ? error.message : 'unknown'}</pre>
      </details>
    </div>
  );
};
