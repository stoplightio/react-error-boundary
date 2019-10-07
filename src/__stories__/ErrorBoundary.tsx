import { action } from '@storybook/addon-actions';
import { object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { ErrorBoundary, FallbackComponent, withErrorBoundary } from '../';

const SchemaViewer: React.FunctionComponent<{ name: string; schema: unknown }> = ({ schema, name }) => {
  if (typeof schema !== 'object' || schema === null) {
    throw new Error('Schema must be an object');
  }

  if (Object.keys(schema).length === 0) {
    throw new Error('Schema cannot be empty');
  }

  return <span>This is fine.</span>;
};

const MyWrappedComponent = withErrorBoundary(SchemaViewer, {
  FallbackComponent: props => <FallbackComponent className="FallbackComponent" {...props} />,
  recoverableProps: ['schema'],
  onError: action('onError'),
});

const CustomFallbackComponent = () => <div>Errored.</div>;

storiesOf('ErrorBoundary', module)
  .addDecorator(withKnobs)
  .add('default', () => <MyWrappedComponent schema={null} name={text('name', '')} />)
  .add('recovering', () => <MyWrappedComponent schema={object('schema', {})} name={text('name', '')} />)
  .add('with custom fallback', () => (
    <ErrorBoundary FallbackComponent={CustomFallbackComponent}>
      <SchemaViewer name="" schema={null} />
    </ErrorBoundary>
  ));
