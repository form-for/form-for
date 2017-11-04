export type ComponentProps = {
  name: string,
  error: ?string,
  onChange?: Function,
  onFocus?: Function,
  onBlur?: Function,
  value?: any,
  defaultValue?: any,
  [key: string]: any
};
