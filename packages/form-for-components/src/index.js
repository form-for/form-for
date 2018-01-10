// @flow

import { Field } from "form-for";

import Checkbox from "./Checkbox";
export type { Props as CheckboxProps } from "./Checkbox";

import Input from "./Input";
export type { Props as InputProps } from "./Input";

import Radio from "./Radio";
export type { Props as RadioProps } from "./Radio";

import Select from "./Select";
export type { Props as SelectProps } from "./Select";

const inputTypes = [
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "number",
  "password",
  "range",
  "search",
  "tel",
  "text",
  "time",
  "url",
  "week"
];

const bindComponents = Field.autoBindComponentCallback(() => {
  Field.bindComponent("checkbox", Checkbox);
  Field.bindComponent("radio", Radio);
  Field.bindComponent("select", Select);

  inputTypes.forEach(type => {
    Field.bindComponent(type, Input);
  });
});

export { bindComponents, inputTypes, Checkbox, Input, Radio, Select };
