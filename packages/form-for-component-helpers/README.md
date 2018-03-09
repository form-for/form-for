# form-for-component-helpers

> Helpers for creating clean and accessible form-for components.

## Install

```sh
npm install --save form-for-component-helpers
```

or https://unpkg.com/form-for-component-helpers/umd

## Helpers

### uniqueId

Returns `this.props.id` or a uniqueId for the component. This id remains the same after re-rendering.

Signatures:

* `uniqueId(Component: any)`

```javascript
import React from 'react';
import { uniqueId } from 'form-for-component-helpers';

export default class UniqueId extends React.Component {
  render() {
    const id = uniqueId(this);

    return <div>Unique Id: {id}</div>;
  }
}
```

### humanized

Returns `this.prop.name` in a way that's pleasant to the eyes.

Signatures:

* `humanized(Component)`

```javascript
import React from 'react';
import { humanized } from 'form-for-component-helpers';

type Props = {
  name: string
};

export default class Humanized extends React.Component<Props> {
  render() {
    const label = humanized(this);

    return <div>Humanized label: {label}</div>;
  }
}
```

### help

Returns a `id` and `text` for the `this.props.help` property or the `helpText` argument. This function shines facilitating the implementation of accesibility properties, such as `aria-describedby`.

Signatures:

* `help(Component)`
* `help(Component, helpText)`

```javascript
import React from 'react';
import help from '';

type Props = {
  help?: string
};

export default class Helped extends React.Component<Props> {
  render() {
    const helpProps = help(this);

    return (
      <div>
        <div>Help text: {helpProps.text}</div>
        <div>Help id: {helpProps.id}</div>
      </div>
    );
  }
}
```

### stringHelpers

These are helper method used by the `humanized` helper.

* `replaceSnakeUnderscore(str: string, glue: string = " "): string`
* `replaceCamels(str: string, glue: string = " "): string`
* `capitalize(str: string): string`
* `simplifyFieldName(str: string): string`
* `humanize(str: string): string`

```javascript
import { stringHelpers } from 'form-for-component-helpers';
```

## Resources

* Check out [form-for-bootstrap-components](https://github.com/form-for/packages/form-for-bootstrap-components) for more usage examples

For more in depth documentation see: https://github.com/form-for/form-for
