<img src="assets/logo.png" alt="logo" align="right" />

# form-for

> Type less, do more. React forms made easy.

[![npm version](https://img.shields.io/npm/v/form-for.svg)](https://www.npmjs.org/package/form-for)
[![Build Status](https://travis-ci.org/form-for/form-for.svg?branch=master)](https://travis-ci.org/form-for/form-for)
[![Maintainability](https://api.codeclimate.com/v1/badges/9efdfe69fbe453cef6b4/maintainability)](https://codeclimate.com/github/form-for/form-for/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9efdfe69fbe453cef6b4/test_coverage)](https://codeclimate.com/github/form-for/form-for/test_coverage)
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

## Key Features

* Convention over configuration - it _just works_ for most cases
* Seemless integration between custom and HTML 5 Validation
  * Custom validations are set using `setCustomValidity` for better browser integration
  * HTML 5 validation errors are provided to the component to be displayed and have better **accessibility** and UX
* Built-in support for nested fields
  * Often used for array fields
* Validation among fields
  * Often used for validations like `password confirmation`
* Optimized rerenders with [MobX](https://github.com/mobxjs/mobx)

## Install

📦 [2.7k gzipped](https://bundlephobia.com/result?p=form-for)

```sh
npm install --save form-for
```

or https://unpkg.com/form-for/umd

### Plug 'n play state management

* React setState **(the default one)**
* [MobX Binding](https://github.com/form-for/form-for/tree/master/packages/mobx-form-for) - [Demo](https://github.com/form-for/demo)

**Why there is no Redux binding?**

[Form states in general should not be managed by Redux](https://github.com/reactjs/redux/issues/1287#issuecomment-175351978). You'll most likely be just fine with the default state management. You can get the form data through `onChange(data)` and `onSubmit(event, data)`.

### Plug 'n play components

* [Base components](https://github.com/form-for/form-for/tree/master/packages/form-for-bootstrap-components)
* [Bootstrap 4 components](https://github.com/form-for/form-for/tree/master/packages/form-for-bootstrap-components)

## Schema

Forms are created based on a given schema. There are three ways to provide the form schema:

### Decorator

The `@field` decorator may or may not have parameters.

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

### Property in the object

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

### Schema on the `<Form>`

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

### Properties on the `<Field>`

Properties directly to the `<Field>` tag override the schema properties.

```js
<Form for={user} ...>
  <Field name="..." type="special_type_for_this_form_only" placeholder="Special" />
</Form>
```

_Note: Try avoiding this one, as it makes your forms longer and may lead to code duplication._

## Connect components

```js
import { Field } from "form-for";
import React from "react";

class Component extends React.Component {
  ...
}

Field.connect('type', Component);
```

## Data management

You can get the form data through `onChange(data)` and `onSubmit(event, data)`

```js
handleChange = data => {
  // console.log(data);
};

handleSubmit = (event, data) => {
  // console.log(data);
};

<Form onChange={handleChange} onSubmit={handleSubmit}>
  ...
</Form>;
```

## Validation

Validation takes into consideration both custom validations and HTML 5 validations respectively.

### HTML 5 Validation

You can make use of the HTML 5 validation attributes, such as `required, min, max and minLength`. The HTML 5 validation messages are provided to the connected component, [so it can display the error in a nice way](https://github.com/form-for/form-for/blob/master/packages/form-for-bootstrap-components/src/Input.js#L41).

```js
const schema = { age: { type: 'number', max: 10, min: 2, required: true } };

<Form for={object} schema={schema}>
  <Field name="age" required={true} />
</Form>;
```

### Named validation function

```js
import { field } from 'form-for';

export default class User {
  @field({ error: 'validateName' })
  name;

  validateName(object, name) {
    if (this.name === 'Nobody') return 'Nobody is not a name'; // 💎 Recommended
    if (object[name] === 'Nobody') return 'Nobody is not a name'; // Same thing, but using the argument

    // Returning undefined, false or null means there's no custom error, so form-for will check for HTML 5 errors
  }
}
```

### Standalone validation function

```js
function validateAge(object, name) {
  if (this.age === 999) return 'Are you this old???'; // 💎 Recommended
  if (object[name] === 999) return 'Are you this old???'; // Same thing, but using the arguments

  // Returning undefined, false or null means there's no custom error, so form-for will check for HTML 5 errors
}

<Field name="age" error={validateAge}>
```

### Error string

```js
this.state = { nameError: 'invalid name' };
<Field name="name" error={this.state.nameError}>
```

## Touched

The `touched` property provided to a field component means that a field has been focused at least once. This is used to display error messages only after the user has gotten to an input.

### Show errors

There may be cases when you want to display the errors from the beginning, even before the user touches a field. For that, you can use `showErrors` on `<Form>`;

```js
<Form showErrors>...</Form>
```

## Creating components

If you're using `flow` for typing, you can import the component props: `import type { ComponentProps } from "form-for";`.
PR's for Typescript typings are welcome.

These are the fields provided to a component: **(the ? means it may or may not be provided)**

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

Any other attributes provided through the `<Field>` tag, `@field` or the `schema` will also be available through the `props`.

Here's an example:

```js
// @flow

import * as React from 'react';
import type { ComponentProps } from 'form-for';

export default class Input extends React.PureComponent<ComponentProps> {
  input: ?HTMLInputElement;

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const { error, ...props } = { ...this.props };

    // onMount and touched are not used in this case, but they need to be deleted so they don't get passed down to the DOM
    delete props.onMount;
    delete props.touched;

    return <input ref={el => (this.input = el)} aria-invalid={!!error} {...props} />;
  }
}
```

* Check out [form-for-components](form-for-components) for handy base components.
* Check out [form-for-bootstrap-components](https://github.com/form-for/form-for/tree/master/packages/form-for-bootstrap-components) for ready to go Bootstrap 4 components.

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

It's recommend to look at the [form-for-component-helpers](https://github.com/form-for/form-for/tree/master/packages/form-for-component-helpers)
package. It provides functions to facilitate creating components, specially when it comes to guessing labels.

### Nested fields

form-for makes it a breeze to nest fields. You may have a `User` class that has `todoItems`, as list of `TodoItem` instances.

Here's an example: https://github.com/form-for/demo/blob/master/src/fields/TodoItems/TodoItemsField.js

If you're using the MobX binding, please check https://github.com/form-for/form-for/tree/master/packages/mobx-form-for#nested-fields

## Flow support

All form-for packages are built with flow and provides support from the get go. Flow will automatically include typings when you import form-for modules. Although you do not need to import the types explicitly, you can still do it like this: `import type { ... } from 'form-for'`.

To use the flow typings shipped with form-for packages:

* In `.flowconfig`, you cannot ignore `node_modules`.
* In `.flowconfig`, you cannot import it explicitly in the `[libs]` section.
* You **do not** need to install library definition using flow-typed.

## Roadmap

* Typescript typings
* [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree) binding

* In depth blog post about form-for
* More examples
  * Pure react
  * Redux
  * Async validation
  * Calculation
* Egghead.io course

## Resources

* [Contributing Guide](./CONTRIBUTING.md)
* [Code of Conduct](./CODE_OF_CONDUCT.md)

* The logo was created by Xicons.co and can be found [here](https://www.iconfinder.com/icons/2024631/document_documents_file_files_text_texts_icon).
