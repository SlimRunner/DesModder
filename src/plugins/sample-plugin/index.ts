import { PluginController } from "#plugins/PluginController.js";
import { Config, configList } from "./config";
import { AllActions, DispatchedEvent } from "../../globals/extra-actions";

declare module "src/globals/extra-actions" {
  interface AllActions {
    "simple-plugin": {
      type: "dsm-simple-plugin-add-random-polynomial";
      index: number;
    };
  }
}

function getHeaderElement(): HTMLElement | null {
  return document.querySelector(".header-account-name");
}

export default class ChangeUsername extends PluginController<Config> {
  static id = "sample-plugin" as const;
  static enabledByDefault = true;
  static config = configList;
  oldName = "";

  enabledByDefault = false;

  afterConfigChange() {
    const headerElement = getHeaderElement();
    if (headerElement === null) {
      return;
    }
    const text = headerElement.innerText;
    if (text !== undefined) {
      this.oldName = text;
    }
    headerElement.innerText = this.settings.customText;
  }

  afterEnable() {
    const headerElement = getHeaderElement();
    if (headerElement === null) {
      return;
    }
    const text = headerElement.innerText;
    if (text !== undefined) {
      this.oldName = text;
    }
    headerElement.innerText = this.settings.customText;
  }

  afterDisable() {
    const headerElement = getHeaderElement();
    if (headerElement === null) {
      return;
    }
    headerElement.innerText = this.oldName;
  }

  getPolynomial() {
    const randInt = (start: number, end: number | null = null) => {
      if (end === null) {
        [start, end] = [0, start];
      }

      // from developer.mozilla.org "getting_a_random_integer_between_two_values"
      const minCeiled = Math.ceil(start);
      const maxFloored = Math.floor(end);
      return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    };

    const range = function* (
      start: number,
      end: number | null = null,
      step: number = 1
    ) {
      if (end === null) {
        [start, end] = [0, start];
      }
      if ((end - start) * step < 0) {
        // nothing to do
      } else if (step >= 1) {
        for (let i = start; i < end; i += step) {
          yield i;
        }
      } else {
        for (let i = start; i > end; i += step) {
          yield i;
        }
      }
    };

    const poly: number[] = [];
    const terms = randInt(1, 6);
    for (const _ of range(terms)) {
      poly.push(randInt(-10, 10));
    }

    return poly.map((n, i) => `${n}${i === 0 ? "" : `x^${i}`}`).join("+");
  }

  handleDispatchedAction(action: DispatchedEvent) {
    switch (action.type) {
      case "dsm-simple-plugin-add-random-polynomial":
        this.cc._toplevelNewItemAtSelection(
          this.cc.createItemModel({
            latex: this.getPolynomial(),
            type: "expression",
            id: this.cc.generateId(),
            color: this.cc.getNextColor(),
          }),
          { shouldFocus: true }
        );
        this.cc._closeAddExpression();
        break;
      default:
        action satisfies Exclude<DispatchedEvent, AllActions["simple-plugin"]>;
    }
    return undefined;
  }
}
