// @flow

import * as React from "react";

export default function withHelp(WrappedComponent: React.ComponentType<*>) {
  return class extends React.Component<*> {
    buildHelpProps() {
      if (!this.props.props) return {};

      const helpId = this.props.id + "-help";
      return {
        help: this.props.help,
        helpId,
        "aria-describedby": helpId
      };
    }

    render() {
      return <WrappedComponent {...this.buildHelpProps()} {...this.props} />;
    }
  };
}
