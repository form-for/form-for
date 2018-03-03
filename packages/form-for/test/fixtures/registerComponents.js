import { Field } from '../../src';
import Input from './Input';
import Select from './Select';

Field.registerComponentExistence('text', Input);
Field.registerComponentExistence('select', Select);
