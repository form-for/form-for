import React, { Component } from "react";
import { mount } from "enzyme";
import { Field, Form } from "../../index";
import Input from "../fixture/Input";
import Counter from "../fixture/Counter";

describe("Controlled state form", () => {
  Field.bindComponent("text", Input);
  Field.bindComponent("counter", Counter);

  class ControlledTest extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hash: {
          schema: {
            name: { type: "text" },
            counter: { type: "counter" }
          }
        }
      };
    }

    handleChange = hash => {
      this.setState({ hash });
    };

    render() {
      return (
        <Form for={this.state.hash} onChange={this.handleChange} __testing_valid__>
          <Field name="name" />
          <Field name="counter" />
        </Form>
      );
    }
  }

  let wrapper;
  beforeAll(() => {
    wrapper = mount(<ControlledTest />);
    wrapper
      .find("input")
      .first()
      .simulate("change", { target: { value: "New value" } });
  });

  it("renders new value upon change", () => {
    expect(
      wrapper
        .find("input")
        .first()
        .props().value
    ).toEqual("New value");
  });

  it("does not re-render fields that have not changed", () => {
    expect(
      wrapper
        .find("input[name='counter']")
        .first()
        .props()["data-count"]
    ).toBe(1);
  });
});
