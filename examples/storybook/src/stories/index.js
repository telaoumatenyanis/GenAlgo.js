import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import GenAlgo from "../";

storiesOf("Button", module).add("with text", () => <GenAlgo />);
