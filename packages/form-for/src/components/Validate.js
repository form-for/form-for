// @flow

import * as React from 'react';
import { ValidateContext, type Context } from '../contexts';

type Props = {
  children: React.Node,
  onValidate: Function,
  errorsContext: Context<Object>,
  validContext: Context<boolean>
};

export default class Validate extends React.Component<Props> {
  rendering: boolean = false;
  renderRequested: boolean = false;
  errors: Object = {};
  mounted: boolean = false;

  handleValidate = (name: string, error: ?string) => {
    const { [name]: currentError, ...newErrors } = this.errors;
    if (currentError == error) return;

    this.errors = newErrors;
    if (error) this.errors[name] = error;

    this.props.onValidate(this.errors);
    this.requestRender();
  };

  get valid(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  componentDidMount() {
    this.mounted = true;
    this.componentDidRender();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate() {
    this.componentDidRender();
  }

  requestRender() {
    if (this.rendering) this.renderRequested = true;
    else this.enforceRender();
  }

  componentDidRender() {
    if (this.renderRequested) {
      this.renderRequested = false;
      this.enforceRender();
    }

    this.rendering = false;
  }

  enforceRender() {
    setTimeout(() => {
      if (this.mounted) this.forceUpdate();
    }, 0);
  }

  render() {
    this.rendering = true;

    const { children, errorsContext, validContext } = this.props;

    const ErrorProvider = errorsContext.Provider;
    const ValidProvider = validContext.Provider;

    return (
      <ValidateContext.Provider value={this.handleValidate}>
        <ErrorProvider value={this.errors}>
          <ValidProvider value={this.valid}>{children}</ValidProvider>
        </ErrorProvider>
      </ValidateContext.Provider>
    );
  }
}
