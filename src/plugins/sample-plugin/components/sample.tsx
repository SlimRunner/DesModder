import { Button, Tooltip } from "#components";
import { Component, jsx } from "#DCGView";
import "./sample.less";

export class MessageBox extends Component {
  template() {
    return (
      <div class="dcg-popover-interior dsm-sample-context-menu">
        <ul>
          <li>
            <Tooltip tooltip={"huh"}>
              <Button
                color="light-gray"
                class="dsm-sample-context-menu-button"
                onTap={() => {
                  // pressed button 1
                }}
              >
                {"Button 1"}
              </Button>
            </Tooltip>
          </li>
          <li>
            <Tooltip tooltip={"huh"}>
              <Button
                color="light-gray"
                class="dsm-sample-context-menu-button"
                onTap={() => {
                  // pressed button 2
                }}
              >
                {"Button 2"}
              </Button>
            </Tooltip>
          </li>
        </ul>
      </div>
    );
  }
}
