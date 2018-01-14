import React, { Component } from "react";
import { mount } from "enzyme";
import { Field, Form } from "../index";
import Input from "./fixture/Input";

Field.bindComponent("text", Input);

describe("Controlled state form", () => {
  class ControlledTest extends Component {
    constructor(props) {
      super(props);
      this.state = { hash: props.hash };
    }

    handleChange = hash => {
      this.setState({ hash });
    };

    render() {
      return (
        <Form for={this.state.hash} onChange={this.handleChange} __testing_valid__>
          <Field name="name" />
          <Field name="surname" />
        </Form>
      );
    }
  }

  it("updates the data reference on update props", () => {
    const hash = {
      schema: {
        name: { type: "text" },
        surname: {}
      }
    };

    const wrapper = mount(<ControlledTest hash={hash} />);
    wrapper
      .find("input")
      .first()
      .simulate("change", { target: { value: "My new value" } });

    expect(hash.name).toEqual("My new value");
    expect(
      wrapper
        .find("input")
        .first()
        .props().value
    ).toEqual("My new value");
  });
});
