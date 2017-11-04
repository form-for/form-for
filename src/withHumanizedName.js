// @flow

import * as React from "react";
import { humanize } from "./stringHelpers";

type Props = {
  name: string,
  [_: string]: any
};

export default function withHumanizedName(WrappedComponent: React.ComponentType<*>, propNames: string[]) {
  return class extends React.Component<Props> {
    getSimpleName() {
      const name = this.props.name;

      const lastIndexOfBracket = name.lastIndexOf("[");
      if (lastIndexOfBracket === -1) {
        return name;
      }

      return name.substring(lastIndexOfBracket + 1, name.length - 1);
    }

    getHumanizedName() {
      return humanize(this.getSimpleName());
    }

    getHumanizedProps() {
      const props = {};
      const humanizedName = this.getHumanizedName();

      propNames.forEach(propName => {
        props[propName] = humanizedName;
      });

      return props;
    }

    render() {
      return <WrappedComponent {...this.getHumanizedProps()} {...this.props} />;
    }
  };
}
