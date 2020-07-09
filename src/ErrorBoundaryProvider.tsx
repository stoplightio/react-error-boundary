import { ICoreReportingAPI } from '@stoplight/reporter';
import * as React from 'react';

export const ErrorBoundaryContext = React.createContext<ICoreReportingAPI>(console);

export const ErrorBoundaryProvider: React.FunctionComponent<{ reporter: ICoreReportingAPI }> = ({
  reporter,
  children,
}) => <ErrorBoundaryContext.Provider value={reporter}>{children}</ErrorBoundaryContext.Provider>;
