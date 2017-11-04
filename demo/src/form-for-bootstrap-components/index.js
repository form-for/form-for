import { Field } from "../../../src";
import { inputTypes } from "../../../src/components";

import Input from "./Input";
import Checkbox from "./Checkbox";
import Select from "./Select";

function bindBootstrapFieldComponents() {
  inputTypes.forEach(type => {
    Field.bindComponent(type, Input);
  });

  Field.bindComponent("checkbox", Checkbox);
  // Field.bindComponent('radio', RadioButtons);
  Field.bindComponent("select", Select);
}

export { bindBootstrapFieldComponents };
