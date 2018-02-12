// @flow

import BaseForm from './BaseForm';
export type { Props as FormProps, SchemaProperty, Schema } from './BaseForm';

import Form from './Form';

import FieldGroup from './FieldGroup';
export type { Props as FieldGroupProps } from './FieldGroup';

import Field from './Field';
export type { ComponentProps, Props as FieldProps } from './Field';

import fieldDecorator from './fieldDecorator';

export { BaseForm, Form, Field, fieldDecorator as field, FieldGroup };
