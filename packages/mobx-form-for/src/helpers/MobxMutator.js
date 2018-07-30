// @flow

import { Mutator } from 'form-for';
import { runInAction } from 'mobx';

export default class MobxMutator extends Mutator {
  before(value: any) {
    return value;
  }

  mutate(methodName: string, args: any[]) {
    runInAction(() => super.mutate(methodName, args));
  }
}
