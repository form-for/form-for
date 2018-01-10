# form-for-bootstrap-components

Simple and accessible Bootstrap 4 form-for components.

Just import `{ bindFieldComponents }` from `form-for-bootstrap-components` and call it. All default HTML inputs will be bound and ready to use with bootstrap.

**⚠ WARNING:** the CSS for bootstrap is not included.

**Note:** The `select`, `checkbox` and `radio` components use Bootstrap's custom classes

```javascript
import { bindBootstrapFieldComponents } from "form-for-bootstrap-components";
import { Field, Form } from "form-for";

bindBootstrapFieldComponents();

const user = new User();

<Form for={user} onSubmit={...}>
  <Field name="name" />
  <button>Submit</button>
</Form>
```

## Getting Started

Install `form-for-bootstrap-components`

```bash
npm install form-for-bootstrap-components --save
```

Bind components to form-for Field

```javascript
import { bindBootstrapFieldComponents } from "form-for-bootstrap-components";

bindBootstrapFieldComponents();
```

## List of components bound

- Checkbox
- Radio **(provide `options` to the field schema)**
    - Guessed option labels: `{type: 'radio', options: ['guest', 'user', 'admin']}`
    - Provide option labels: `{type: 'radio', options: {guest: 'Guest Label', user: 'User Label', admin: 'Admin Label'}}`
- Select **(provide `options` to the field schema)**
    - Guessed option labels: `{type: 'select', options: ['guest', 'user', 'admin']}`
    - Provide option labels: `{type: 'select', options: {guest: 'Guest Label', user: 'User Label', admin: 'Admin Label'}}`
- Input types
    - color
    - date
    - datetime-local
    - email
    - file
    - hidden
    - image
    - month
    - number
    - password
    - range
    - search
    - tel
    - text
    - time
    - url
    - week
