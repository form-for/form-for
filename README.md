# ![Form For](./assets/logo.png)

[![npm version](https://img.shields.io/npm/v/form-for.svg)](https://www.npmjs.org/package/form-for)
[![Build Status](https://travis-ci.org/pedsmoreira/form-for.svg?branch=master)](https://travis-ci.org/pedsmoreira/form-for)
[![Maintainability](https://api.codeclimate.com/v1/badges/eea356eb9597322d9ef5/maintainability)](https://codeclimate.com/github/pedsmoreira/form-for/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/eea356eb9597322d9ef5/test_coverage)](https://codeclimate.com/github/pedsmoreira/form-for/test_coverage)
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

## Getting Started

### Installation

```bash
npm install form-for --save
```

And to import:

```javascript
import { Form, Field, field } from "form-for";
```

**Note**: The core components don't have styling, we recommend also adding one of these:

- [form-for-bootstrap](https://github.com/pedsmoreira/form-for-bootstrap)

### Declaring models

// TODO

### Creating forms

// TODO

### Custom components

// TODO

### Encapsulating input names

If instead of assigning the name `firstName`, you with to do `user[firstName]`, you can do so with the prefix attribute:

```jsx
<Form prefix="user">
    <Field name="firstName" />
</Form>
```

## Resources

- [Contributing Guide](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

- The logo was created by Xicons.co and can be found [here](https://www.iconfinder.com/icons/2024631/document_documents_file_files_text_texts_icon).

## Motivation

FormFor is inspired by [Simple Form](https://github.com/plataformatec/simple_form),
a gem that greatly facilitates creating forms in Rails.
