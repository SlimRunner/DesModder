import { PluginController } from "../PluginController";
import { MainPopupFunc } from "./PerformanceView";
import { DispatchedEvent, TimingData } from "#globals";

export default class PerformanceInfo extends PluginController {
  static id = "performance-info" as const;
  static enabledByDefault = false;

  timingDataHistory: TimingData[] = [];
  dispatchListenerID!: string;

  afterEnable() {
    this.dsm.pillboxMenus?.addPillboxButton({
      id: "dsm-pi-menu",
      tooltip: "performance-info-name",
      iconClass: "dsm-icon-pie-chart",
      popup: () => MainPopupFunc(this, this.dsm),
    });
    this.dispatchListenerID = this.cc.dispatcher.register((e) => {
      if (e.type === "on-evaluator-changes") {
        this.onEvaluatorChanges(e);
      }
    });
  }

  afterDisable() {
    this.cc.dispatcher.unregister(this.dispatchListenerID);
    this.dsm.pillboxMenus?.removePillboxButton("dsm-pi-menu");
  }

  onEvaluatorChanges(e: DispatchedEvent) {
    if (e.type !== "on-evaluator-changes") return;
    this.timingDataHistory?.push(e.timingData);
    if (this.timingDataHistory.length > 10) this.timingDataHistory.shift();
    // Don't this.cc.updateViews here. This is inside a dispatched event,
    // so it will update views anyways.
  }

  getTimingData() {
    return (
      this.timingDataHistory[this.timingDataHistory.length - 1] ??
      defaultTimingData
    );
  }

  refreshState() {
    this.cc._showToast({ message: "Refreshing graph..." });
    // should this be using killWorker instead?
    const oldUnsavedChanges = this.cc._hasUnsavedChanges;
    this.calc.setState(this.calc.getState(), { allowUndo: true });
    this.cc._hasUnsavedChanges = oldUnsavedChanges;
  }
}

const defaultTimingData: TimingData = {
  cacheHits: 0,
  cacheMisses: 0,
  cacheReads: 0,
  cacheWrites: 0,
  timeInWorker: 0,
  updateAnalysis: 0,
  computeAllLabels: 0,
  computeAriaDescriptions: 0,
  graphAllChanges: 0,
  processStatements: 0,
  publishAllStatuses: 0,
  updateIntersections: 0,
};
