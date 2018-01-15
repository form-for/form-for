import React, { Component } from "react";
import { mount } from "enzyme";
import { Field, Form } from "../../index";
import Input from "../fixture/Input";

describe("Skip validation", () => {
  Field.bindComponent("text", Input);

  const object = {
    name: "John",
    schema: { name: { type: "text" } }
  };

  it("does not pass down the field error", () => {
    const wrapper = mount(
      <Form for={object} skipValidation __testing_valid__>
        <Field name="name" validator={() => "Invalid"} />
      </Form>
    );

    wrapper.find("input").simulate("change");
    expect(wrapper.find("input").props()["data-error"]).toBeUndefined();
  });
});
