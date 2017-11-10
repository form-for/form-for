# ![Form For](./assets/logo.png)

[![npm version](https://img.shields.io/npm/v/form-for.svg)](https://www.npmjs.org/package/form-for)
[![Build Status](https://travis-ci.org/form-for/form-for.svg?branch=master)](https://travis-ci.org/form-for/form-for)
[![Maintainability](https://api.codeclimate.com/v1/badges/eea356eb9597322d9ef5/maintainability)](https://codeclimate.com/github/form-for/form-for/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/eea356eb9597322d9ef5/test_coverage)](https://codeclimate.com/github/form-for/form-for/test_coverage)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

ReactJS forms made easy.

```javascript
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

## Installation

Install the core package:

```bash
npm install form-for --save
```

Choose a components package:

- [form-for-components](https://github.com/form-for/form-for-components): Core HTML components
- [form-for-bootstrap-components](https://github.com/form-for/form-for-bootstrap-bootstrap): Pretty bootstrap components

**Note**: If you're using [MobX](https://github.com/mobxjs/mobx), 
check out [mobx-form-for](https://github.com/form-for/mobx-form-for) 

## Schema

Forms are created based on a given schema. If your schema defines the type `date` for the field `last_seen`
for instance, then `<Field name="date" />` will use the component bound to `last_seen`.

There are three ways to provide the schema to a form.
 
### Annotation

The `@field` annotation may or may not have parameters.

```javsacript
import { field } from "form-for";

export default class User {
    @field name; // type defaults to 'text'
    
    @field({ type: 'email', required: true }) 
    email;
    
    @field({ type: 'todoItem[]' })
    todoItems;
}
```

```javascript
const user = new User();

<Form for={user}>
    <Field name="..."/>
</Form/>
```

### Schema attribute

```javsacript
export default class User {
    schema = {
        name: {}, // type defaults to 'text'
        email: { type: 'email', required: true }    
        todoItems: { type: 'todoItem[]' }
    };
}
```

```javascript
const user = new User();

<Form for={user}>
    <Field name="..."/>
</Form/>
```

### Passing directly to the form

```javascript
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

```javascript
<Form for={user} ...>
    <Field name="..." type="special_type_for_this_form_only" placeholder="Special" />
</Form/>
```

## Binding components

```javascript
import { Field } from "form-for";
import React from "react";

class Copmonent extends React.Component {
  ...
}

Field.bindComponent('type', Component);
```

## Uncontrolled form

If you do not provide a `onChange` prop to your form, this means it's uncontrolled. This implies `defaultValue`
will be provided to the field components.

```javascript
<Form for={...} />
  ...
</Form/>
```

For more about uncontrolled components, check out [React's documentation](https://reactjs.org/docs/uncontrolled-components.html)

## Controlled form

Proving `onChange` the the form makes it controlled. Therefore you must use some kind of state management to update the
content passed through `for`.

The `onChange` method receives three parameters:

- Mutator: a function that mutates the field updated by a change
- Name: the name of the field updated. Keep in mind that this may be a nested field, such as `user[todoItem][title]`
- Value: the value updated.

```javascript
handleFormChange = (mutator, name, value) => {
  this.setState({ user: mutator() })
};

<Form for={this.state.user} onChange={this.handleFormChange} />
  ...
</Form/>
```

**Note**: If you're using [MobX](https://github.com/mobxjs/mobx), 
[mobx-form-for](https://github.com/form-for/mobx-form-for) handles `onChange` for you, even on `strict` mode.

## Validation

There are four validation trigger states: `mount, focus, change, blur` 

The default validation is `validate="focus,change,blur"`. To disable validation use `validate={false}`.

Validation takes into consideration both custom validators and HTML 5 validations, in this order. 

### Function custom validator

Provide a function to validate a given value. If the new value is invalid, return an error message.

```javascript
function validateName(name) {
  if(name === 'Invalid') return 'This is not an acceptable name.';
}

<Form ...>
  <Field name="name" validator={validateName}>
</Form>
```

### Named custom validator

Provide the name of the method responsible for validating.

```javascript
import { field } from "form-for";

export default class User {
  @field({ validator: 'validateName' })
  name;
  
  validateName(name) {
    // you can use this.something to check other things before returning an error
    if(name === 'Nobody') return 'Nobody is not a name';
  }
}
```

## Creating components

If you're using `flow` for typing, you can import the component props: `import type { ComponentProps } from "form-for";`.
PR's for Typescripts typings are welcome.

These are the fields passed to a component: **(the ? means it may or may not be passed)**

```javascript
{
  type: string,
  name: string,
  error: ?string,
  onMount?: Function,
  onFocus?: Function,
  onChange?: Function,
  onBlur?: Function,
  value?: any,
  defaultValue?: any
}
```

Any other attributes provided through the `<Field>` tag will also be available through the `props`.

Here's a simple example:

```javascript
// @flow

import React from "react";
import { render } from "react-dom";
import type { ComponentProps } from "form-for";

export default class Input extends React.Component<ComponentProps> {
  render() {
    const { error, onMount, ...props } = this.props;

    if (error) {
      // $FlowFixMe
      props["aria-invalid"] = true;
    }

    return <input {...props} />;
  }
}
```

**Note:** Check out [form-for-components](https://github.com/form-for/form-for-components): Core HTML components. It'll probably help you.
**Note:** And for ready-to-go component examples, check out [form-for-components-bootstrap](https://github.com/form-for/form-for-components).

### Value & Default value

Controlled forms provide `value`, while uncontrolled forms `defaultValue`. It's recommended that your code support
both entries.

### Validation Events

For all the events, if value and error are not provided they are guessed from the `targed` or `event.target`

- `onMount(target: ?HTMLElement, { value?, error? })`

This event is used to `setCustomValidity`, prevent the form from being submitted with pending custom validations and
allowing to focus on the field with error.

This event is always called, unless `validation={false}`

- `onFocus(event: Event, { value?, error? })`

Triggers validation if `validation` contains `focus`.  

- `onChange`

Triggers validation if `validation` contains `change`. It also calls `onChange` assigned to `<Form>` and `<Field>`, if any.

- `onBlur`

Triggers validation if `validation` contains `blur`.

**Note:** For an implementation example of all these methods, checkout the
[core checkbox component](https://github.com/form-for/form-for-components/blob/master/src/Checkbox.js)

### Helpers

It's recommend to look at the [form-for-component-helpers](https://github.com/form-for/form-for-component-helpers)
package. It provides functions to facilitate creating components.

### Nested components

Nothing stops you from nesting components. You may have a `User` class that has `todoItem`, as list of `TodoItem` instances.

You can do something like this:

On the user class

```javascript
import { field } from "form-for";

export default class User {
    @field({ type: 'todoItems[]' })
    todoItems;
}
```

On the component use `<FieldGroup>`, so the `<Field>` inside it knows what object it's related to. Just like `<Form>`,
`<FieldGroup>` can receive `schema`.

`<FieldGroup>` has an optional `index` prop, that makes the property names enumarated, such as:

- `user[todoItem][0][name]`
- `user[todoItem][1][name]`

```javascript
import React from "react";
import { Field, FieldGroup } from "form-for";

import TodoItem from "../TodoItem";

export default class TodoItems extends React.Component {
  state = {
    items: this.props.value || this.props.defaultValue || []
  };

  addTodoItem = () => {
    const items = this.state.items.concat(new TodoItem("New todo item"));
    this.setState({ items });

    if (this.props.onChange) {
      this.props.onChange(null, { value: items });
    }
  };

  removeTodoItem(item: TodoItem) {
    const items = this.state.items.filter(i => item !== i);
    this.setState({ items });

    if (this.props.onChange) {
      this.props.onChange(null, { value: items });
    }
  }
  
  render() {
    return (
      <fieldset className="form-group">
        <legend>Todo Items</legend>

        {this.state.items.map((item, index) => this.renderTodoItem(item, index))}

        <button type="button" className="btn btn-default" onClick={this.addTodoItem}>
          + Add todo
        </button>
      </fieldset>
    );
  }

  renderTodoItem(item: TodoItem, index: number) {
    return (
      <div key={item.uid} className="form-inline form-group clearfix">
        <FieldGroup for={item} index={index}>
          <Field name="checked" label={false} />
          <Field name="title" label={false} style={{ width: "400px" }} />
        </FieldGroup>

        <button type="button" className="btn btn-danger btn-sm ml-2" onClick={() => this.removeTodoItem(item)}>
          X
        </button>
      </div>
    );
  }
}
```

On the form

```javascript
import TodoItems from "PATH/TO/todoItems";

Field.bindComponent('todoItems[]', TodoItems);

<Form for={user}/>
  <Field for="todoItems"/>
</Form/>
```

## Resources

- [Contributing Guide](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

- The logo was created by Xicons.co and can be found [here](https://www.iconfinder.com/icons/2024631/document_documents_file_files_text_texts_icon).

## Motivation

FormFor is inspired by [Simple Form](https://github.com/plataformatec/simple_form),
a gem that greatly facilitates creating forms in Rails.
