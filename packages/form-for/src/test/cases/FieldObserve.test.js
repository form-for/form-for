import React, { Component } from "react";
import { mount } from "enzyme";
import { Field, Form } from "../../index";
import Input from "../fixture/Input";
import Counter from "../fixture/Counter";

describe("Field observe", () => {
  Field.bindComponent("text", Input);
  Field.bindComponent("counter", Counter);

  const object = {
    schema: {
      name: { type: "text" },
      counter: { type: "counter" }
    }
  };

  it("re-renders upon observed field changes", () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" />
        <Field name="counter" observe="name" />
      </Form>
    );

    wrapper
      .find("input")
      .first()
      .simulate("change", { target: { value: "New value" } });

    expect(
      wrapper
        .find("input[name='counter']")
        .first()
        .props()["data-count"]
    ).toBe(2);
  });

  it("observes all with `observe: true`", () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" />
        <Field name="counter" observe={true} />
      </Form>
    );

    wrapper
      .find("input")
      .first()
      .simulate("change", { target: { value: "New value" } });

    expect(
      wrapper
        .find("input[name='counter']")
        .first()
        .props()["data-count"]
    ).toBe(2);
  });

  it("observes given an array", () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" />
        <Field name="counter" observe={["name"]} />
      </Form>
    );

    wrapper
      .find("input")
      .first()
      .simulate("change", { target: { value: "New value" } });

    expect(
      wrapper
        .find("input[name='counter']")
        .first()
        .props()["data-count"]
    ).toBe(2);
  });

  it("does not update if a non-observed field changes", () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" />
        <Field name="counter" observe="another" />
      </Form>
    );

    wrapper
      .find("input")
      .first()
      .simulate("change", { target: { value: "New value" } });

    expect(
      wrapper
        .find("input[name='counter']")
        .first()
        .props()["data-count"]
    ).toBe(1);
  });

  it("calls validator upon observed field changes", () => {
    const validator = jest.fn();

    const wrapper = mount(
      <Form for={{ counter: 0 }} schema={object.schema} __testing_valid__>
        <Field name="name" />
        <Field name="counter" observe="name" validator={validator} />
      </Form>
    );

    wrapper
      .find("input")
      .first()
      .simulate("change", { target: { value: "New value" } });

    expect(validator).toHaveBeenCalledWith(0, { counter: 0, name: "New value" });
  });
});
