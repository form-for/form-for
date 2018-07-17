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

export const FormDataContext: Context<Object> = createContext();
export const FormChangeContext: Context<Function> = createContext();
export const FormErrorsContext: Context<Object> = createContext();
export const FormValidContext: Context<boolean> = createContext();
export const FormSubmittedContext: Context<boolean> = createContext();
export const FormSubmittingContext: Context<?Promise<*>> = createContext();

type FieldGroupContextProps = {
  for: Object,
  schema: Object,
  prefix: string,
  onChange: Function
};
export const FieldGroupContext: Context<FieldGroupContextProps> = createContext({});
export const FieldGroupErrorsContext: Context<Object> = createContext();
export const FieldGroupValidContext: Context<boolean> = createContext();

export const FieldContext: Context<{ name: string }> = createContext({});

export const ArrayFieldContext: Context<FieldGroupContextProps & { index: number }> = createContext();
export const ArrayFieldHelpersContext: Context<{
  insert: (index: any, item: any) => any,
  move: (fromIndex: any, toIndex: any) => any,
  remove: (index: any) => any,
  push: (item: any) => any,
  pop: () => any,
  shift: () => any,
  unshift: (item: any) => any,
  swap: (indexA: any, indexB: any) => any
}> = createContext();
