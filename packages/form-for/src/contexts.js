// @flow

import * as React from 'react';

interface ProviderProps<T> {
  value: T;
  children?: React.Node;
}

interface ConsumerProps<T> {
  children: (value: T) => React.Node;
  unstable_observedBits?: number;
}

type Provider<T> = React.ComponentType<ProviderProps<T>>;
type Consumer<T> = React.ComponentType<ConsumerProps<T>>;

export interface Context<T> {
  Provider: Provider<T>;
  Consumer: Consumer<T>;
}

const createContext: any = React.createContext;

export const ValidateContext: Context<Function> = createContext();

export const FormForContext: Context<Object> = createContext();
export const FormChangeContext: Context<Function> = createContext();
export const FormErrorsContext: Context<Object> = createContext();
export const FormValidContext: Context<boolean> = createContext();
export const FormSubmittedContext: Context<boolean> = createContext();
export const FormSubmittingContext: Context<?Promise<*>> = createContext();

export const FieldGroupContext: Context<{
  for: Object,
  schema: Object,
  prefix: string,
  onChange: Function
}> = createContext({});
export const FieldGroupErrorsContext: Context<Object> = createContext();
export const FieldGroupValidContext: Context<boolean> = createContext();

export const FieldNameContext: Context<string> = createContext();
