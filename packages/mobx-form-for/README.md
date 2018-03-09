# mobx-form-for

> `MobX` binding for `form-for`

## Install

```sh
npm install --save form-for mobx-form-for
```

## Usage

```js
import * as React from 'react';
import observable from 'mobx';
import observer from 'mobx-react';
import { Field, Form } from 'mobx-form-for';

// Import some fields (you can create your own as well)
import { connectFields } from 'form-for-components';
connectFields();

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
