import { ICoreReportingAPI } from '@stoplight/reporter';
import * as React from 'react';
import { FallbackComponent } from './FallbackComponent';
import { FallbackProps } from './types';

export type ErrorBoundaryContext = {
  reporter: ICoreReportingAPI;
  FallbackComponent?: React.ElementType<FallbackProps>;
};

export const ErrorBoundaryContext = React.createContext<ErrorBoundaryContext>({
  reporter: console,
  FallbackComponent,
});

export const ErrorBoundaryProvider: React.FunctionComponent<ErrorBoundaryContext> = ({ children, ...props }) => (
  <ErrorBoundaryContext.Provider value={props}>{children}</ErrorBoundaryContext.Provider>
);
