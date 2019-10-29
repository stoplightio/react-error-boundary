import { IReportingAPI } from '@stoplight/reporter';
import * as React from 'react';

export const ErrorBoundaryContext = React.createContext<IReportingAPI>(console);

export const ErrorBoundaryProvider: React.FunctionComponent<{ reporter: IReportingAPI }> = ({ reporter, children }) => (
  <ErrorBoundaryContext.Provider value={reporter}>{children}</ErrorBoundaryContext.Provider>
);
