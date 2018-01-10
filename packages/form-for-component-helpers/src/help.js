// @flow

import uniqueId from "./uniqueId";

type HelpResults = {
  id?: string,
  text?: string
};

export default function help(Component: any, helpText?: string): HelpResults {
  if (typeof helpText === "undefined" && Component.props) {
    helpText = Component.props.help;
  }

  if (!helpText) return {};

  const id = uniqueId(Component) + "-help";
  return {
    id: id,
    text: helpText
  };
}
