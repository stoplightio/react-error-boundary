import * as React from 'react';
import { Reporter } from './types';

const stubbedReporter: Reporter = {
  error() {
    // noop
  },
};

export const ErrorBoundaryContext = React.createContext<Reporter>(stubbedReporter);

export const ErrorBoundaryProvider: React.FunctionComponent<{ reporter: Reporter }> = ({ reporter, children }) => (
  <ErrorBoundaryContext.Provider value={reporter}>{children}</ErrorBoundaryContext.Provider>
);
