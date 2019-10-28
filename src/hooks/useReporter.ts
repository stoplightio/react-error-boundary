import { IReportingAPI } from '@stoplight/reporter';
import { useContext } from 'react';
import { ErrorBoundaryContext } from '../ErrorBoundaryProvider';

export const useReporter = (): IReportingAPI => {
  return useContext<IReportingAPI>(ErrorBoundaryContext);
};
