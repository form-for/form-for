// @flow

import Form from './Form';
export type { Props as FormProps, SchemaProperty, Schema } from './Form';

import FieldGroup from './FieldGroup';
export type { Props as FieldGroupProps } from './FieldGroup';

import Field from './Field';
export type { ComponentProps, Props as FieldProps } from './Field';

import fieldDecorator from './fieldDecorator';

export { Form, Field, fieldDecorator as field, FieldGroup };
