import React, { Component } from "react";
import { mount } from "enzyme";
import { Field, Form } from "../index";
import Input from "../fixture/Input";

describe("Field error", () => {
  Field.bindComponent("text", Input);

  const object = {
    name: "John",
    schema: { name: { type: "text" } }
  };

  it("does not show error if not existent", () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" />
      </Form>
    );

    wrapper.find("input").simulate("change");
    expect(wrapper.find("input").props()["data-error"]).toBeUndefined();
  });

  it("shows state error", () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" validator={() => "State error"} />
      </Form>
    );

    wrapper.find("input").simulate("change");
    expect(wrapper.find("input").props()["data-error"]).toEqual("State error");
  });

  it("provides error prop if present", () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" error="Prop error" />
      </Form>
    );

    const input = wrapper.find("input[name='name']").first();
    expect(input.props()["data-error"]).toEqual("Prop error");
  });
});
