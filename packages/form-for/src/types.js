// @flow

export type SchemaProperty = { type?: string, [key: string]: any };
export type Schema = { [key: string]: SchemaProperty };

export type ComponentProps = {
  name: string,
  type?: string,
  error?: string,
  validating?: boolean,
  touched: boolean,
  value: any,
  onMount: Function,
  onFocus: Function,
  onChange: Function
};
