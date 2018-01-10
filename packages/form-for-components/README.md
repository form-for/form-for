# form-for-components

Core components for form-for.

Just import `{ bindComponents }` from `form-for-components` and call it. All default HTML inputs will be bound :P

```javascript
import { bindFieldComponents } from "form-for-components";
import { Field, Form } from "form-for";

bindFieldComponents();

const user = new User();

<Form for={user} onSubmit={...}>
  <Field name="name" />
  <button>Submit</button>
</Form>
```

**If you're looking for styled components, check out [form-for-bootstrap-components](https://github.com/form-for/form-for-bootstrap-components)**

## Getting Started

Install `form-for-components`

```bash
npm install form-for-components --save
```

Bind components to form-for Field

```javascript
import { bindFieldComponents } from "form-for-components";
import { Field, Form } from "form-for";

bindFieldComponents();
```

## Creating custom components

Here's the full list of exports available, in case you want to use them  

```javascript
import { inputTypes, Checkbox, Input, Radio, Select, bindComponents } from "form-for-components";
```

**For examples on how to do it, check out [form-for-bootstrap-components](https://github.com/form-for/form-for-bootstrap-components)**

## List of components bound

- Checkbox
- Radio **(provide `options: { value1: string1, value2: string2 }` to the field schema)**
- Select **(provide `options: { value1: string1, value2: string2 }` to the field schema)**
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
    
    **(this list is available through `import { inputTypes } from "form-for-components"`)**

## Resources

- [Contributing Guide](../../CONTRIBUTING.md)
- [Code of Conduct](../../CODE_OF_CONDUCT.md)

## Motivation

[FormFor](https://github.com/form-for/form-for) can do great things, but on its own still requires a lot of work. These components empower the core HTML inputs
  to be used with [FormFor](https://github.com/form-for/form-for).
