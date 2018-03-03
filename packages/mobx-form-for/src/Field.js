// @flow

import * as React from 'react';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Field as BaseField } from 'form-for';

class Field extends BaseField {}

export default observer(Field);
