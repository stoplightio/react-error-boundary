/* tslint:disable:jsx-wrap-multiline */
import { mount } from 'enzyme';
import * as React from 'react';

import { ErrorBoundary } from '../ErrorBoundary';
import { ErrorBoundaryProvider } from '../ErrorBoundaryProvider';
import { FallbackComponent } from '../FallbackComponent';
import { Reporter } from '../types';

describe('ErrorBoundary component', () => {
  const ex = new TypeError('String expected');

  const TestComponent: React.FunctionComponent<{ value: unknown } | { getValue: () => unknown }> = props => {
    const value = 'value' in props ? props.value : props.getValue();

    if (typeof value !== 'string') {
      throw ex;
    }

    return <span>{String(value)}</span>;
  };

  let reporter: Reporter;

  beforeEach(() => {
    reporter = {
      reportError: jest.fn(),
    };
  });

  describe('when exception is not thrown', () => {
    it('renders children', () => {
      const wrapper = mount(
        <ErrorBoundaryProvider reporter={reporter}>
          <ErrorBoundary>
            <TestComponent value="test" />
          </ErrorBoundary>
        </ErrorBoundaryProvider>,
      );

      expect(wrapper.find(TestComponent)).toHaveHTML('<span>test</span>');

      wrapper.unmount();
    });
  });

  describe('when exception is thrown', () => {
    it('renders fallback component and passes error-related props', () => {
      const wrapper = mount(
        <ErrorBoundaryProvider reporter={reporter}>
          <ErrorBoundary>
            <TestComponent value={0} />
          </ErrorBoundary>
        </ErrorBoundaryProvider>,
      );

      expect(wrapper.find(FallbackComponent)).toExist();
      expect(wrapper.find(FallbackComponent)).toHaveProp({
        error: ex,
        componentStack: expect.stringContaining('in TestComponent'),
        tryRecovering: (wrapper.find(ErrorBoundary).instance() as any).recover,
      });

      wrapper.unmount();
    });

    describe('error reporting', () => {
      it('calls onError prop', () => {
        const onError = jest.fn();
        const wrapper = mount(
          <ErrorBoundaryProvider reporter={reporter}>
            <ErrorBoundary onError={onError}>
              <TestComponent value={0} />
            </ErrorBoundary>
          </ErrorBoundaryProvider>,
        );

        expect(onError).toBeCalledWith(ex, expect.stringContaining('in TestComponent'));

        wrapper.unmount();
      });

      it('reports errors by default', () => {
        const wrapper = mount(
          <ErrorBoundaryProvider reporter={reporter}>
            <ErrorBoundary>
              <TestComponent value={0} />
            </ErrorBoundary>
          </ErrorBoundaryProvider>,
        );

        expect(reporter.reportError).toBeCalledWith(ex);

        wrapper.unmount();
      });

      it('does reports error if reporting is disabled', () => {
        const wrapper = mount(
          <ErrorBoundaryProvider reporter={reporter}>
            <ErrorBoundary reportErrors={false}>
              <TestComponent value={0} />
            </ErrorBoundary>
          </ErrorBoundaryProvider>,
        );

        expect(reporter.reportError).not.toBeCalled();

        wrapper.unmount();
      });
    });

    describe('and a custom fallback component is provided', () => {
      it('renders it pass error-related props', () => {
        const CustomFallbackComponent = () => <div>foo</div>;

        const wrapper = mount(
          <ErrorBoundaryProvider reporter={reporter}>
            <ErrorBoundary FallbackComponent={CustomFallbackComponent}>
              <TestComponent value={0} />
            </ErrorBoundary>
          </ErrorBoundaryProvider>,
        );

        expect(wrapper.find(FallbackComponent)).not.toExist(); // makes sure we don't render the original one
        expect(wrapper.find(CustomFallbackComponent)).toExist();
        expect(wrapper.find(CustomFallbackComponent)).toHaveProp({
          error: ex,
          componentStack: expect.stringContaining('in TestComponent'),
          tryRecovering: (wrapper.find(ErrorBoundary).instance() as any).recover,
        });

        wrapper.unmount();
      });

      it('fallback component can try to recover', () => {
        const CustomFallbackComponent = () => <div>foo</div>;

        const getValue = jest.fn().mockReturnValue(0);

        const wrapper = mount(
          <ErrorBoundaryProvider reporter={reporter}>
            <ErrorBoundary FallbackComponent={CustomFallbackComponent}>
              <TestComponent getValue={getValue} />
            </ErrorBoundary>
          </ErrorBoundaryProvider>,
        );

        expect(wrapper.find(CustomFallbackComponent)).toExist();

        getValue.mockReturnValue('Woo-hoo!');

        wrapper.find(CustomFallbackComponent).prop<() => void>('tryRecovering')();
        wrapper.update(); // need to do it, cause getValue is obviously still the same reference, hence component does not re-render correctly

        expect(wrapper.find(CustomFallbackComponent)).not.toExist();
        expect(wrapper.find(TestComponent)).toHaveHTML('<span>Woo-hoo!</span>');

        wrapper.unmount();
      });
    });
  });
});
