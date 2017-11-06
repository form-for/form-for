import { Field } from "../../../src";
import { inputTypes } from "../../../src/components";

import Input from "./Input";
import Checkbox from "./Checkbox";
import Select from "./Select";
import Radio from "./Radio";

function bindBootstrapFieldComponents() {
  inputTypes.forEach(type => {
    Field.bindComponent(type, Input);
  });

  Field.bindComponent("checkbox", Checkbox);
  Field.bindComponent("radio", Radio);
  Field.bindComponent("select", Select);
}

export { bindBootstrapFieldComponents };
