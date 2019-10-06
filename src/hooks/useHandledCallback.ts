import { useCallback } from 'react';
import { useReporter } from './useReporter';

export const useHandledCallback: typeof useCallback = (fn, deps): any => {
  const reporter = useReporter();

  return useCallback<(...args: any[]) => any>((...args) => {
    try {
      return fn(...args);
    } catch (ex) {
      reporter.reportError(ex);
    }
  }, deps);
};
