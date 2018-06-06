// @flow

import React from 'react';
import { TextArea as BaseTextArea } from 'form-for-components';

import Input, { type Props as InputProps } from './Input';

export type Props = InputProps;

export default class TextArea extends React.PureComponent<Props> {
  render() {
    return <Input {...this.props} component={BaseTextArea} />;
  }
}
