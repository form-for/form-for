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

For more in depth documentation see: https://github.com/form-for/form-for
