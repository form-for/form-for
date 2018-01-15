import React, { Component } from "react";
import { mount } from "enzyme";
import { Field, Form } from "../../index";
import Input from "../fixture/Input";
import Select from "../fixture/Select";

describe("Field bind component", () => {
  Field.bindComponent("text", Input);
  Field.bindComponent("select", Select);

  const object = {
    schema: { name: { type: "text" }, role: { type: "select" } }
  };

  it("binds components properly", () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" />
        <Field name="role" />
      </Form>
    );

    expect(wrapper.find("input[name='name']").length).toBe(1);
    expect(wrapper.find("select[name='role']").length).toBe(1);
  });
});
