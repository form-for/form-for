import React from 'react';
import { shallow } from 'enzyme';
import { humanized } from './index';

describe('humanized', () => {
  class Component extends React.Component {
    render() {
      return <div name={humanized(this)} />;
    }
  }

  it('returns the humanized name prop', () => {
    const wrapper = shallow(<Component name="john doe" />);
    expect(wrapper.prop('name')).toEqual('John doe');
  });
});
