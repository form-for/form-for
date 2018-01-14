import React, { Component } from "react";
import { mount } from "enzyme";
import { Field, Form } from "../index";
import Input from "./fixture/Input";

describe("Custom schema", () => {
  Field.bindComponent("text", Input);

  const schema = {
    name: {
      type: "text"
    }
  };

  it("is used when provided without object schema", () => {
    const wrapper = mount(
      <Form for={{ name: "John" }} schema={schema} __testing_valid__>
        <Field name="name" />
      </Form>
    );

    const input = wrapper.find("input").first();
    expect(input.props().defaultValue).toEqual("John");
  });

  it("takes precedence over `for` schema", () => {
    const value = { name: "John", schema: { name: { type: "Nothing" } } };

    const wrapper = mount(
      <Form for={value} schema={schema} __testing_valid__>
        <Field name="name" />
      </Form>
    );

    const input = wrapper.find("input").first();
    expect(input.props().defaultValue).toEqual("John");
  });
});
