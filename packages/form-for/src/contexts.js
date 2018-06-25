// @flow

import { createContext } from 'react';

// $FlowFixMe
export const ErrorsContext = createContext<Object>();

// $FlowFixMe
export const ValidContext = createContext<boolean>();

// $FlowFixMe
export const SubmittedContext = createContext<boolean>();

// $FlowFixMe
export const SubmittingContext = createContext<boolean>();

// $FlowFixMe
export const FormContext = createContext<{
  onFormChange: Function,
  onFormValidate: Function
}>();

// $FlowFixMe
export const FieldGroupContext = createContext<{
  object: Object,
  schema: Object,
  prefix: string,
  onFieldGroupChange: Function
}>({});

// $FlowFixMe
export const FieldContext = createContext<{
  name: string
}>({});
