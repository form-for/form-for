// @flow

import { createContext } from 'react';

type Consumer<T> = any;

export const ErrorsContext: Consumer<Object> = createContext();
export const ValidContext: Consumer<boolean> = createContext();
export const SubmittedContext: Consumer<boolean> = createContext();
export const SubmittingContext: Consumer<boolean> = createContext();

export const FormContext: Consumer<{
  onFormChange: Function,
  onFormValidate: Function
}> = createContext();

export const FieldGroupContext: Consumer<{
  object: Object,
  schema: Object,
  prefix: string,
  onFieldGroupChange: Function
}> = createContext({});

export const FieldContext: Consumer<{
  name: string
}> = createContext({});
