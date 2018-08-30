import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import Polynomial from "../polynomial.js";

storiesOf("GenAlgo", module).add("Polynomial Extremum", () => <Polynomial />);
