# form-for-components

> Core components for form-for

[![npm version](https://img.shields.io/npm/v/form-for-components.svg)](https://www.npmjs.org/package/form-for-components)

```javascript
import { Field, Form } from 'form-for';
import { connectFields } from 'form-for-components';

connectFields();
```

**If you're looking for styled components, check out [form-for-bootstrap-components](https://github.com/form-for/packages/form-for-bootstrap-components)**

## Install

```sh
npm install --save form-for form-for-components
```

or https://unpkg.com/form-for-components/umd

## List of components

* Checkbox
* Radio **(provide `options: { male: 'M', female: 'F' }` to the field schema)**
* Select **(provide `options: { los_angeles: 'Los Angeles', taubate: 'Taubaté' }` to the field schema)**
* Input types
  * color
  * date
  * datetime-local
  * email
  * file
  * hidden
  * image
  * month
  * number
  * password
  * range
  * search
  * tel
  * text
  * time
  * url
  * week

### Accessing all inputs (useful when you want to create your own comopnents)

```js
import { inputTypes } from 'form-for-components';
```

For more in depth documentation see: https://github.com/form-for/form-for
