import React, { Component } from "react";
import { render } from "enzyme";
import { Field, Form } from "../../index";
import Input from "../fixture/Input";

describe("Field type default text", () => {
  Field.bindComponent("text", Input);

  const object = {
    schema: { name: {} }
  };

  it("binds components properly", () => {
    const wrapper = render(
      <Form for={object}>
        <Field name="name" />
      </Form>
    );

    expect(wrapper.find("input[name='name']").length).toBe(1);
  });
});
