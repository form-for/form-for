// @flow

import { withFieldMutatorContext, FieldMutatorComponent } from 'form-for';
import MobxMutator from '../helpers/MobxMutator';

export default withFieldMutatorContext(FieldMutatorComponent, MobxMutator);
