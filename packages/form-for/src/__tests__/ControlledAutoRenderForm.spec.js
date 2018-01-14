import React, { Component } from "react";
import { mount } from "enzyme";
import { Field, Form } from "../index";
import Input from "../fixture/Input";

describe("Controlled auto render form", () => {
  Field.bindComponent("text", Input);

  class ControlledAutoRenderFormTest extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hash: {
          name: "Old value",
          schema: {
            name: { type: "text" }
          }
        }
      };
    }

    handleChange = hash => {
      this.setState({ hash });
    };

    render() {
      return (
        <Form for={this.state.hash} onChange={this.handleChange} autoRender __testing_valid__>
          <Field name="name" />
        </Form>
      );
    }
  }

  it("does not call render internally", () => {
    const wrapper = mount(<ControlledAutoRenderFormTest />);
    wrapper
      .find("input")
      .first()
      .simulate("change", { target: { value: "New value" } });

    expect(
      wrapper
        .find("input")
        .first()
        .props().value
    ).toEqual("Old value");
  });
});
