# form-for-component-helpers

Helpers for creating clean and accessible form-for components.

## Installing

Install `form-for-compnent-helpers`

```bash
npm install form-for-component-helpers --save
```

## Helpers

### uniqueId

Returns `this.props.id` or a uniqueId for the component. This id remains the same after re-rendering.

Signatures:
- `uniqueId(Component: any)`

```javascript
import React from "react";
import { uniqueId } from "form-for-component-helpers";

export default class UniqueId extends React.Component {
  render() {
    const id = uniqueId(this);

    return (
      <div>Unique Id: {id}</div>
    );
  }
}

```

### humanized

Returns `this.prop.name` in a way that's pleasant to the eyes. 

Signatures:
- `humanized(Component)`

```javascript
import React from "react";
import { humanized } from "form-for-component-helpers";

type Props = {
  name: string
};

export default class Humanized extends React.Component<Props> {
  render() {
    const label = humanized(this);

    return (
      <div>
        <div>Humanized label: {label}</div>
      </div>
    );
  }
}

```

### help

Returns a helpId and helpText if a given help string is given. The helpId is very important for improving acessibility
with `aria-describedby`.

Signatures:
- `help(Component)`
- `help(Component, helpText)`

```javascript
import React from "react";
import help from "";

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

- `replaceSnakeUnderscore(str: string, glue: string = " "): string`
- `replaceCamels(str: string, glue: string = " "): string`
- `capitalize(str: string): string`
- `simplifyFieldName(str: string): string`
- `humanize(str: string): string`

```javascript
import { stringHelpers } from "form-for-component-helpers";
```

## Motivation

[FormFor] can do great things, but on its own still requires a lot of work. These components empower the core HTML inputs
  to be used with [FormFor](https://github.com/form-for/form-for).
