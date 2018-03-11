import React from 'react';
import { shallow } from 'enzyme';
import { uniqueId } from './index';

describe('uniqueId', () => {
  class Component extends React.Component {
    render() {
      return <div id={this.props.id} data-id={uniqueId(this)} data-id-2={uniqueId(this)} />;
    }
  }

  it('returns the component id if given', () => {
    const wrapper = shallow(<Component id="123" />);
    expect(wrapper.prop('data-id')).toEqual('123');
  });

  it('generates a unique id for the component', () => {
    const wrapper = shallow(<Component />);
    expect(typeof wrapper.prop('data-id')).toEqual('string');
  });

  it('generates different ids for different components', () => {
    const wrapper1 = shallow(<Component />);
    const wrapper2 = shallow(<Component />);

    expect(wrapper1.prop('data-id')).not.toEqual(wrapper2.props('data-id'));
  });

  it('generates the same id for the same component', () => {
    const wrapper = shallow(<Component />);
    expect(wrapper.prop('data-id')).toEqual(wrapper.prop('data-id-2'));
  });
});
