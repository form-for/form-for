export type ComponentProps = {
  type: string,
  name: string,
  error: ?string,
  onMount?: Function,
  onFocus?: Function,
  onChange?: Function,
  onBlur?: Function,
  value?: any,
  defaultValue?: any
};
