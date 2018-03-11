# form-for-bootstrap-components

> Accessible Bootstap 4 components for form-for

[![npm version](https://img.shields.io/npm/v/form-for-bootstrap-components.svg)](https://www.npmjs.org/package/form-for-bootstrap-components)

```javascript
import { Field, Form } from 'form-for';
import { connectFields } from 'form-for-bootstrap-components';

connectFields();
```

## Key features

* Bootstrap classes on top of the base components
* Humanized label guessing
  * If a label is not provided, the components will use the `humanized` function from [form-for-component-helpers](`https://github.com/form-for/form-for/tree/master/packages/form-for-component-helpers`) to display a name that's nice to look at. In most cases this will be exactly what you'd type in anyway.
  * You can provide `label={null}` if you don't want the label
* Help texts through the `help` prop on the schema or the `<Field>` tag
* Aria attributes and ids for accessibility

## Install

```sh
npm install --save form-for form-for-bootstrap-components
```

or https://unpkg.com/form-for-bootstrap-components/umd

You'll also need to include Bootstrap 4 through a CDN or import it in your code. If you're looking for
an alternative look and feel, we recommend [https://bootswatch.com/](Bootswatch).

## Usage

### Bind all fields

```js
import { connectFields } from 'form-for-bootstrap-components';

connectFields();
```

### Bind specific fields

```js
import { Field } from 'form-for';
import { Input } from 'form-for-bootstrap-components';

Field.connect('text', Input);
```

## List of components

* Checkbox
* Radio **(provide `options` to the field schema)**
  * Guessed option labels: `{type: 'radio', options: ['guest', 'user', 'admin']}`
  * Provided option labels: `{type: 'radio', options: {guest: 'Guest Label', user: 'User Label', admin: 'Admin Label'}}`
* Select **(provide `options` to the field schema)**
  * Guessed option labels: `{type: 'select', options: ['guest', 'user', 'admin']}`
  * Provided option labels: `{type: 'select', options: {guest: 'Guest Label', user: 'User Label', admin: 'Admin Label'}}`
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

For more in depth documentation see: https://github.com/form-for/form-for
