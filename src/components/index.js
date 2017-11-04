// @flow

import Field from "../Field";

import Checkbox from "./Checkbox";
import Input from "./Input";
import Radio from "./Radio";
import Select from "./Select";

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

function bindFieldComponents() {
  Field.bindComponent("checkbox", Checkbox);
  Field.bindComponent("radio", Radio);
  Field.bindComponent("select", Select);

  inputTypes.forEach(type => {
    Field.bindComponent(type, Input);
  });
}

export { inputTypes, bindFieldComponents };
