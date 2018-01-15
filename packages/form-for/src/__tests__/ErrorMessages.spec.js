import React, { Component } from "react";
import { mount, render } from "enzyme";
import { Field, Form } from "../index";
import Input from "../fixture/Input";

describe("Error messages", () => {
  beforeAll(() => {
    console.warn = jest.fn();
  });

  it("throws on missing schema", () => {
    expect(() => render(<Form for={{}} __testing_valid__ />)).toThrow(`Undefined schema for "Object" instance`);
  });

  it("throws on missing field binding", () => {
    const message = `Unbound component type "text" requested for property "name" in "Object" instance`;

    expect(() =>
      render(
        <Form for={{ schema: {} }} __testing_valid__>
          <Field name="name" />
        </Form>
      )
    ).toThrow(message);
  });

  it("warns on missing field in schema", () => {
    Field.bindComponent("text", Input);

    render(
      <Form for={{ schema: {} }} __testing_valid__>
        <Field name="name" />
      </Form>
    );

    const message = `Undefined property "name" in schema for "Object" instance`;
    expect(console.warn).toHaveBeenCalledWith(message);
  });
});
