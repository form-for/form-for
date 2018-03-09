<img src="assets/logo.png" alt="logo" align="right" />

# form-for

> Type less, do more. React forms made easy.

[![npm version](https://img.shields.io/npm/v/form-for.svg)](https://www.npmjs.org/package/form-for)
[![Build Status](https://travis-ci.org/form-for/form-for.svg?branch=master)](https://travis-ci.org/form-for/form-for)
[![Maintainability](https://api.codeclimate.com/v1/badges/eea356eb9597322d9ef5/maintainability)](https://codeclimate.com/github/form-for/form-for/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/eea356eb9597322d9ef5/test_coverage)](https://codeclimate.com/github/form-for/form-for/test_coverage)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

```js
import { Form, Field } from "form-for";

const user = new User();

<Form for={user} onSubmit={...}>
  <Field name="firstName" />
  <Field name="lastName" />

  <Field name="email" />
  <Field name="password" />

  <button>Submit</button>
</Form>
```

Just wanna play with it? Check out the demo

* [Live](https://form-for.pedrosm.com)
* [Codesandbox Demo](https://codesandbox.io/s/github/form-for/demo)
* [Repository](https://github.com/form-for/demo)

## Install

```sh
npm install --save form-for
```

or https://unpkg.com/form-for/umd

### Plug 'n play components

* [Core components](https://github.com/form-for/form-for/tree/master/packages/form-for-bootstrap-components)
* [Bootstrap 4 components](https://github.com/form-for/form-for/tree/master/packages/form-for-bootstrap-components)

### Plug 'n play state management

* React setState **(the default one)**
* [MobX Binding](https://github.com/form-for/form-for/tree/master/packages/mobx-form-for) - [Demo](https://github.com/form-for/demo)

**Why there is no Redux binding?**

[Form states in general should not be managed by Redux](https://github.com/reactjs/redux/issues/1287#issuecomment-175351978). You'll be fine with the default state management. Just get the data from `onChange` or `onSubmit`.

## Schema

Forms are created based on a given schema. There are three ways to provide the form schema:

### Annotations

The `@field` annotation may or may not have parameters.

```js
import { field } from 'form-for';

export default class User {
  @field name; // type defaults to 'text'

  @field({ type: 'email', required: true })
  email;

  @field({ type: 'todoItem[]' })
  todoItems;
}
```

```js
const user = new User();

<Form for={user}>
  <Field name="..."/>
</Form/>
```

### Schema property

```js
export default class User {
  schema = {
    name: {}, // type defaults to 'text'
    email: { type: 'email', required: true }
    todoItems: { type: 'todoItem[]' }
  };
}
```

```js
const user = new User();

<Form for={user}>
  <Field name="..."/>
</Form/>
```

### Passing directly to the form

```js
const schema = {
  name: {}, // type defaults to 'text'
  email: { type: 'email', required: true }
  todoItems: { type: 'todoItem[]' }
}

const user = {};

<Form for={user} schema={schema}>
  <Field name="..."/>
</Form/>
```

### Extra (avoid doing this, stay DRY)

You can also set special properties directly to the `<Field>` tag.

```js
<Form for={user} ...>
  <Field name="..." type="special_type_for_this_form_only" placeholder="Special" />
</Form>
```

## Connect components

```js
import { Field } from "form-for";
import React from "react";

class Component extends React.Component {
  ...
}

Field.connect('type', Component);
```

## Validation

Validation takes into consideration both custom validations and HTML 5 validations respectively.

### Error string

```js
// this.state.nameError == 'invalid name'
<Field name="name" error={this.state.nameError}>
```

### Error function

The function will be bound to the object, so `this.name` will have the actual value. The object and the propety change are also provided, in case you do not want to use `this.*`.

### Provide function directly to the field

```js
function validateAge(object, name) {
  if (this.age === 999) return 'Are you this old???';
  if (object[name] === 999) return 'Are you this old???';
}
```

```js
<Field name="age" error={validateAge}>
```

### Named function

You can provide a function name to an `error` definition on the `schema` or `@field` and it will be resolved to the object function

```js
import { field } from 'form-for';

export default class User {
  @field({ error: 'validateName' })
  name;

  validateName(name) {
    // you can use this.something to check other things before returning an error
    if (name === 'Nobody') return 'Nobody is not a name';
  }
}
```

### Skip validation

If you want to skip validation events set `noValidate={true}` to your `<Form>`.

## Creating components

If you're using `flow` for typing, you can import the component props: `import type { ComponentProps } from "form-for";`.
PR's for Typescripts typings are welcome.

These are the fields passed to a component: **(the ? means it may or may not be passed)**

```js
type ComponentProps = {
  name: string,
  type?: string,
  error?: string,
  touched: boolean,
  value: any,
  onMount: Function,
  onFocus: Function,
  onChange: Function
};
```

Any other attributes provided through the `<Field>` tag will also be available through the `props`.

Here's a simple example:

```js
// @flow

import React from 'react';
import { render } from 'react-dom';
import type { ComponentProps } from 'form-for';

export default class Input extends React.Component<ComponentProps> {
  render() {
    const { error, touched, onMount, ...props } = this.props;

    if (error) {
      // $FlowFixMe
      props['aria-invalid'] = true;
    }

    return <input {...props} />;
  }
}
```

* Note: Check out [form-for-components](form-for-components): Core HTML components. It'll probably help you getting setup.
* Note: And for ready-to-go component examples, check out [form-for-bootstrap-components](https://github.com/form-for/form-for/tree/master/packages/form-for-bootstrap-components).

### Validation Events

These events must be psased down to the field, so form-for can properly handle the validations.

For all the events, if value and error are not provided they are guessed from the `event.target`

* `onMount(target: ?HTMLElement)`

This event is used to `setCustomValidity`, prevent the form from being submitted with pending custom validations and
allowing to focus on the field with error.

* `onFocus(event: Event)`

* `onChange(event: Event, value?: any, error?: any)`

If you're building a fancy component, such as a image cropper, you may need to provide the actual `value` and `error`,
unless these can be guessed from `event.target`.

Here's an example: https://github.com/form-for/demo/blob/master/src/fields/Image/ImageField.js

### Helpers

It's recommend to look at the [form-for-component-helpers](https://github.com/form-for/form-for-component-helpers)
package. It provides functions to facilitate creating components, specially when it comes to guessing labels.

### Nested components

form-for makes it a breeze to nest components. You may have a `User` class that has `todoItems`, as list of `TodoItem` instances.

Here's an example: https://github.com/form-for/demo/blob/master/src/fields/TodoItems/TodoItemsField.js

## Flow support

All form-for packages are built with flow and provides support from the get go. Flow will automatically include typings when you import form-for modules. Although you do not need to import the types explicitly, you can still do it like this: import type { ... } from 'form-for'.

To use the flow typings shipped with form-for packages:

* In `.flowconfig`, you cannot ignore `node_modules`.
* In `.flowconfig`, you cannot import it explicitly in the `[libs]` section.
* You **do not** need to install library definition using flow-typed.

## Browser support

All form-for packages provide browser support through unpkg, such as: `https://unpkg.com/form-for/umd/index.js`

## Resources

* [Contributing Guide](./CONTRIBUTING.md)
* [Code of Conduct](./CODE_OF_CONDUCT.md)
