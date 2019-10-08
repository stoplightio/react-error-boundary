import { useContext } from 'react';
import { ErrorBoundaryContext } from '../ErrorBoundaryProvider';
import { Reporter } from '../types';

export const useReporter: Reporter = () => {
  return useContext<Reporter>(ErrorBoundaryContext);
};
