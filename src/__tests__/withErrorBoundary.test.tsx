import { mount } from 'enzyme';
import 'jest-enzyme';
import * as React from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { FallbackComponent } from '../FallbackComponent';
import { ErrorBoundaryForwardedProps, ErrorBoundaryProps } from '../types';
import { withErrorBoundary } from '../withErrorBoundary';

describe('withErrorBoundary HOC', () => {
  const SchemaViewer: React.FunctionComponent<{ name: string; schema: unknown }> = ({ schema, name }) => {
    if (typeof schema !== 'object' || schema === null) {
      throw new Error('Schema must be an object');
    }

    return <span>{name} This is fine.</span>;
  };

  SchemaViewer.displayName = 'SchemaViewer';

  it('passes all props to ErrorBoundary component', () => {
    const boundaryProps: ErrorBoundaryProps = {
      onError: jest.fn(),
      FallbackComponent: () => <div />,
    };

    const MyWrappedComponent = withErrorBoundary(SchemaViewer, { ...boundaryProps });
    const wrapper = mount(<MyWrappedComponent schema={{}} name="" />);

    expect(wrapper.find(ErrorBoundary)).toHaveProp(boundaryProps);

    wrapper.unmount();
  });

  it('passes boundaryRef to component', () => {
    const boundaryProps: ErrorBoundaryProps = {
      onError: jest.fn(),
      FallbackComponent: () => <div />,
    };

    const MyWrappedComponent = withErrorBoundary(SchemaViewer, { ...boundaryProps });
    const wrapper = mount(<MyWrappedComponent schema={{}} name="" />);

    expect(wrapper.find(SchemaViewer).prop<React.RefObject<typeof ErrorBoundary>>('boundaryRef').current).toBeInstanceOf(
      ErrorBoundary,
    );

    wrapper.unmount();
  });

  describe('recovering', () => {
    it('supports it', () => {
      const MyWrappedComponent = withErrorBoundary(SchemaViewer, {
        recoverableProps: ['schema'],
      });

      const wrapper = mount(<MyWrappedComponent schema={null} name="" />);

      expect(wrapper.find(FallbackComponent)).toExist();
      expect(wrapper.find(SchemaViewer)).not.toExist();

      wrapper.setProps({ schema: {} });
      wrapper.update();

      expect(wrapper.find(FallbackComponent)).not.toExist();
      expect(wrapper.find(SchemaViewer)).toExist();

      wrapper.unmount();
    });

    it('does not react to unlisted properties', () => {
      const MyWrappedComponent = withErrorBoundary(SchemaViewer, {
        recoverableProps: ['name'],
      });

      const wrapper = mount(<MyWrappedComponent schema={null} name="" />);

      expect(wrapper.find(FallbackComponent)).toExist();
      expect(wrapper.find(SchemaViewer)).not.toExist();

      wrapper.setProps({ schema: {} });
      wrapper.update();

      expect(wrapper.find(FallbackComponent)).toExist();
      expect(wrapper.find(SchemaViewer)).not.toExist();

      wrapper.unmount();
    });
  });

  describe('force throwing', () => {
    const LazySchemaViewer: React.FunctionComponent<ErrorBoundaryForwardedProps> = ({ boundaryRef }) => {
      React.useEffect(() => {
        setTimeout(() => {
          boundaryRef.current!.throwError(new Error('Oops'));
        }, 1000);
      }, [boundaryRef]);

      return <span>This is fine.</span>;
    };

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('exposes a way for component to throw', () => {
      const MyWrappedComponent = withErrorBoundary(LazySchemaViewer, {
        FallbackComponent: () => <div>Boundary!</div>,
      });
      const wrapper = mount(<MyWrappedComponent />);

      expect(wrapper).toHaveText('This is fine.');

      jest.advanceTimersByTime(1000);
      wrapper.update();

      expect(wrapper).toHaveText('Boundary!');

      wrapper.unmount();
    });

    it('calls onError handler', () => {
      const onError = jest.fn();
      const MyWrappedComponent = withErrorBoundary(LazySchemaViewer, {
        onError,
      });
      const wrapper = mount(<MyWrappedComponent />);
      jest.advanceTimersByTime(1000);
      wrapper.update();

      expect(onError).toBeCalledWith(new Error('Oops'), null);

      wrapper.unmount();
    });
  });

  it('sets correct displayName', () => {
    const MyWrappedComponent = withErrorBoundary(SchemaViewer);
    const wrapper = mount(<MyWrappedComponent schema={null} name="" />);

    expect(wrapper).toHaveDisplayName('WithErrorBoundary(SchemaViewer)');

    wrapper.unmount();
  });
});
