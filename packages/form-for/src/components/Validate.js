// @flow

import * as React from 'react';
import { ValidateContext, type Context } from '../contexts';

type Props = {
  children: React.Node,
  onValidate?: Function,
  errorsContext: Context<Object>,
  validContext: Context<boolean>
};

type CombinedProps = Props & {
  onParentValidate?: Function
};

class Validate extends React.Component<CombinedProps> {
  rendering: boolean = false;
  renderRequested: boolean = false;
  errors: Object = {};
  mounted: boolean = false;

  dispatchValidate() {
    const { onValidate } = this.props;
    if (onValidate) onValidate(this.errors);
  }

  dispatchParentValidate(name: string, error: ?string) {
    const { onParentValidate } = this.props;
    if (onParentValidate) onParentValidate(name, error);
  }

  handleValidate = (name: string, error: ?string) => {
    const { [name]: currentError, ...newErrors } = this.errors;
    if (currentError == error) return;

    this.errors = newErrors;
    if (error) this.errors[name] = error;

    this.dispatchValidate();
    this.requestRender();
    this.dispatchParentValidate(name, error);
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

export default (props: Props) => (
  <ValidateContext.Consumer>
    {onValidate => <Validate {...props} onParentValidate={onValidate} />}
  </ValidateContext.Consumer>
);
