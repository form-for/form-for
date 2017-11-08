// @flow

import Form from "./Form";
import type { Props as FormProps } from "./Form";

import Field from "./Field";
import type { Props as FieldProps } from "./Field";

import type { ComponentProps } from "./ComponentProps.flow";

import FieldGroup from "./FieldGroup";
import fieldDecorator from "./fieldDecorator";

export { Form, Field, fieldDecorator as field, FieldGroup };
export type { FormProps, FieldProps, ComponentProps };
