# mobx-form-for

> `MobX` binding for `form-for`

[![npm version](https://img.shields.io/npm/v/mobx-form-for.svg)](https://www.npmjs.org/package/mobx-form-for)

This package leverages the power of MobX to update only the fields changed.

## Install

```sh
npm install --save form-for mobx mobx-react mobx-form-for
```

## Usage

You can use all the things you already know and love about MobX, such as `computed` properties and `autorun`

```js
import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { field, Field, Form } from 'mobx-form-for';

// Import some fields (you can create your own as well)
import { connectFields } from 'form-for-components';
connectFields();

class User {
  @field((error: 'validName'))
  @observable
  name;

  @computed
  validName() {
    if (this.name === 'aaah') return `${this.name} is not a real name`;
  }
}
const object = observable({ name: 'John' });
const schema = { name: { type: 'text' } };

@observer
export default class App extends React.Component {
  render() {
    return (
      <Form for={object}>
        <Field name="name" />
      </Form>
    );
  }
}
```

## Nested fields

When dealing with arrays and objects there are three alternatives.

Aside from the first option, which depends on `onChange` to update the object state, it's recommended to call `onChange` so the function assigned to `<Form onChange={fn}/>` gets called. Don't worry, mobx-form-for is smart enough not to call `action()` again.

_If you're handling arrays or maps, you'll need to decorate the React Component with `observer` for it to update properly_

### Create a new object and provide it to onChange

```js
handleAddItem = () => {
  this.props.onChange(null, this.props.value.concat('new value'));
};
```

### Create actions inside the field

```js
import { action } from 'mobx';

handleAddItem = () => {
  // If strict mode enabled (enforceActions on MobX 4) you need to wrap the change by `action`
  action(() => this.props.value[name].push('new value'));

  // Example without strict mode
  this.props.value[name].push('new value');

  // Send the new value to form-for
  this.props.onChange(null, this.props.value);

  // If you don't want to mutate the array you can do:
  // const newValue = this.props.value.concat(new TodoItem());
  // this.props.onChange(null, newValue);
};
```

### Call the context object

Sometimes you may want to call an `action` in your store. This is how you do it:

```js
@observer
export default class TodoItemsField extends React.Component<ComponentProps> {
  static contextTypes = {
    object: PropTypes.object.isRequired
  };

  handleAddItem = () => {
    this.context.object.addTodoItem();
  };

  handleRemoveItem = item => {
    // You may provide the function names for the actions as a prop to make the component reusable
    // @field({ type: 'TodoItem[]', onRemove: 'removeTodoItem' })
    this.context.object[this.props.onRemove]();
    this.props.onChange(null, this.props.value);
  };

  render() {
    // ...
  }
}
```

For more in depth documentation see: https://github.com/form-for/form-for
