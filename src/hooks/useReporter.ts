import { ICoreReportingAPI } from '@stoplight/reporter';
import { useContext } from 'react';
import { ErrorBoundaryContext } from '../ErrorBoundaryProvider';

export const useReporter = (): ICoreReportingAPI => {
  return useContext(ErrorBoundaryContext).reporter;
};
