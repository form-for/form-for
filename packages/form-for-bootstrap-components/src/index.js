import { Field } from "form-for";
import { inputTypes } from "form-for-components";

import Input from "./Input";
export type { Props as InputProps } from "./Input";

import Checkbox from "./Checkbox";
export type { Props as CheckboxProps } from "./Checkbox";

import Select from "./Select";
export type { Props as SelectProps } from "./Select";

import Radio from "./Radio";
export type { Props as RadioProps } from "./Radio";

const bindComponents = Field.autoBindComponentCallback(() => {
  inputTypes.forEach(type => Field.bindComponent(type, Input));
  Field.bindComponent("checkbox", Checkbox);
  Field.bindComponent("radio", Radio);
  Field.bindComponent("select", Select);
});

export { bindComponents, Input, Checkbox, Select, Radio };
