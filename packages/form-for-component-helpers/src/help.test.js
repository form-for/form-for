import React from 'react';
import { shallow } from 'enzyme';
import { uniqueId, help } from './index';

describe('help', () => {
  class Component extends React.Component {
    render() {
      const { id, text } = help(this, this.props.customHelp);
      return <div data-id={uniqueId(this)} data-help-id={id} data-text={text} />;
    }
  }

  it('returns an empty object if without text', () => {
    const wrapper = shallow(<Component customHelp={null} />);
    expect(wrapper.prop('data-help-id')).toBeUndefined();
    expect(wrapper.prop('data-text')).toBeUndefined();
  });

  it('generates a unique help Id different than the other unique id', () => {
    const wrapper = shallow(<Component help="123" />);
    expect(typeof wrapper.prop('data-help-id')).toEqual('string');
    expect(wrapper.prop('data-help-id')).not.toEqual(wrapper.prop('data-id'));
  });

  it('guesses the text from the `help` prop', () => {
    const wrapper = shallow(<Component help="123" />);
    expect(wrapper.prop('data-text')).toEqual('123');
  });

  it('uses the help text when provided', () => {
    const wrapper = shallow(<Component customHelp="custom help" />);
    expect(wrapper.prop('data-text')).toEqual('custom help');
  });
});
