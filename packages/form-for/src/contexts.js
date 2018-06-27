// @flow

import { createContext } from 'react';

export type Context<T> = any;

export const ValidateContext: Context<Function> = createContext();

export const FormChangeContext: Context<Function> = createContext();
export const FormErrorsContext: Context<Object> = createContext();
export const FormValidContext: Context<boolean> = createContext();
export const FormSubmittedContext: Context<boolean> = createContext();
export const FormSubmittingContext: Context<boolean> = createContext();

export const FieldGroupContext: Context<{
  object: Object,
  schema: Object,
  prefix: string,
  onFieldGroupChange: Function
}> = createContext({});
export const FieldGroupErrorsContext: Context<Object> = createContext();
export const FieldGroupValidContext: Context<Object> = createContext();

export const FieldContext: Context<{ name: string }> = createContext({});
