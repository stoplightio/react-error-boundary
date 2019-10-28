import { useCallback } from 'react';
import { useHandledCallback } from '../useHandledCallback';
import { useReporter } from '../useReporter';

jest.mock('../useReporter', () => ({
  useReporter: jest.fn().mockReturnValue({
    error: jest.fn(),
  }),
}));

jest.mock('react', () => ({
  useCallback: jest.fn((fn, deps) => {
    return (...args: any[]) => {
      fn(...args);
    };
  }),
}));

describe('useHandledCallback hook', () => {
  it('passes callback and deps to useCallback hook', () => {
    const fn = jest.fn();
    const deps = ['foo', 'bar', 1];
    useHandledCallback(fn, deps);
    expect(useCallback).toBeCalledWith(expect.any(Function), deps);
  });

  it('calls callback and forwards all args', () => {
    const fn = jest.fn();
    useHandledCallback(fn, [])('abc', 'foo', [1]);
    expect(fn).toBeCalledWith('abc', 'foo', [1]);
  });

  it('reports any uncaught exceptions originating from callback', () => {
    const fn = jest.fn(() => {
      throw new Error('Test');
    });

    const callback = useHandledCallback(fn, []);

    expect(callback).not.toThrow();
    expect(useReporter().error).toBeCalledWith(new Error('Test'));
  });
});
