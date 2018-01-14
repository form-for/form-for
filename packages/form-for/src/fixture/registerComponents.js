import { Field } from "../index";
import Input from "./Input";
import Select from "./Select";

Field.registerComponentExistance("text", Input);
Field.registerComponentExistance("select", Select);
