import { useContext } from 'react';
import { ErrorBoundaryContext } from '../../ErrorBoundaryProvider';
import { useReporter } from '../useReporter';

jest.mock('react', () => ({
  useContext: jest.fn(),
}));

jest.mock('../../ErrorBoundaryProvider', () => ({
  ErrorBoundaryContext: {
    _context: true,
  },
}));

describe('useReporter hook', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('calls useContext with ErrorBoundaryContext and returns', () => {
    const context = {
      reporter: console,
    };
    (useContext as jest.Mock).mockReturnValueOnce(context);
    expect(useReporter()).toBe(console);
    expect(useContext).toBeCalledWith(ErrorBoundaryContext);
  });
});
