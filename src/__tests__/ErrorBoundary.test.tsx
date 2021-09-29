/* tslint:disable:jsx-wrap-multiline */
import * as Sentry from '@sentry/react';
import { mount } from 'enzyme';
import * as React from 'react';

import { ErrorBoundary } from '../ErrorBoundary';
import { ErrorBoundaryProvider } from '../ErrorBoundaryProvider';
import { FallbackComponent } from '../FallbackComponent';

describe('ErrorBoundary component', () => {
  const ex = new TypeError('String expected');

  const TestComponent: React.FunctionComponent<{ value: unknown } | { getValue: () => unknown }> = props => {
    const value = 'value' in props ? props.value : props.getValue();

    if (typeof value !== 'string') {
      throw ex;
    }

    return <span>{String(value)}</span>;
  };

  describe('when exception is not thrown', () => {
    it('renders children', () => {
      const wrapper = mount(
        <ErrorBoundary>
          <TestComponent value="test" />
        </ErrorBoundary>,
      );

      expect(wrapper.find(TestComponent)).toHaveHTML('<span>test</span>');

      wrapper.unmount();
    });
  });

  describe('when exception is thrown', () => {
    it('renders fallback component and passes error-related props', () => {
      const wrapper = mount(
        <ErrorBoundary>
          <TestComponent value={0} />
        </ErrorBoundary>,
      );

      expect(wrapper.find(FallbackComponent)).toExist();
      expect(wrapper.find(FallbackComponent)).toHaveProp({
        error: ex,
        componentStack: expect.stringContaining('in TestComponent'),
        tryRecovering: (wrapper.find(Sentry.ErrorBoundary).instance() as any).resetErrorBoundary,
      });

      wrapper.unmount();
    });

    it('calls onError prop', () => {
      const onError = jest.fn();
      const wrapper = mount(
        <ErrorBoundary onError={onError}>
          <TestComponent value={0} />
        </ErrorBoundary>,
      );

      expect(onError).toBeCalledWith(ex, expect.stringContaining('in TestComponent'), expect.any(String));

      wrapper.unmount();
    });

    describe('and a custom fallback component is provided', () => {
      describe('at the props level', () => {
        it('renders it pass error-related props', () => {
          const CustomFallbackComponent = () => <div>foo</div>;

          const wrapper = mount(
            <ErrorBoundary FallbackComponent={CustomFallbackComponent}>
              <TestComponent value={0} />
            </ErrorBoundary>,
          );

          expect(wrapper.find(FallbackComponent)).not.toExist(); // makes sure we don't render the original one
          expect(wrapper.find(CustomFallbackComponent)).toExist();
          expect(wrapper.find(CustomFallbackComponent)).toHaveProp({
            error: ex,
            componentStack: expect.stringContaining('in TestComponent'),
            tryRecovering: (wrapper.find(Sentry.ErrorBoundary).instance() as any).resetErrorBoundary,
          });

          wrapper.unmount();
        });
      });

      describe('at the provider level', () => {
        it('renders it pass error-related props', () => {
          const CustomFallbackComponent = () => <div>foo</div>;

          const wrapper = mount(
            <ErrorBoundaryProvider FallbackComponent={CustomFallbackComponent}>
              >
              <ErrorBoundary>
                <TestComponent value={0} />
              </ErrorBoundary>
            </ErrorBoundaryProvider>,
          );

          expect(wrapper.find(FallbackComponent)).not.toExist(); // makes sure we don't render the original one
          expect(wrapper.find(CustomFallbackComponent)).toExist();
          expect(wrapper.find(CustomFallbackComponent)).toHaveProp({
            error: ex,
            componentStack: expect.stringContaining('in TestComponent'),
            tryRecovering: (wrapper.find(Sentry.ErrorBoundary).instance() as any).resetErrorBoundary,
          });

          wrapper.unmount();
        });
      });

      describe('at both the provider and props level', () => {
        it('prefers the props one', () => {
          const CustomFallbackContextComponent = () => <div>context!</div>;
          const CustomFallbackPropsComponent = () => <div>level!</div>;

          const wrapper = mount(
            <ErrorBoundaryProvider FallbackComponent={CustomFallbackContextComponent}>
              <ErrorBoundary FallbackComponent={CustomFallbackPropsComponent}>
                <TestComponent value={0} />
              </ErrorBoundary>
            </ErrorBoundaryProvider>,
          );

          expect(wrapper.find(FallbackComponent)).not.toExist(); // makes sure we don't render the original one
          expect(wrapper.find(CustomFallbackContextComponent)).not.toExist();
          expect(wrapper.find(CustomFallbackPropsComponent)).toExist();
          wrapper.unmount();
        });
      });

      it('fallback component can try to recover', () => {
        const CustomFallbackComponent = () => <div>foo</div>;

        const getValue = jest.fn().mockReturnValue(0);

        const wrapper = mount(
          <ErrorBoundary FallbackComponent={CustomFallbackComponent}>
            <TestComponent getValue={getValue} />
          </ErrorBoundary>,
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
