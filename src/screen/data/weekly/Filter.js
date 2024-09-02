import _ from "lodash";
import { Checkbox, Form, Switch } from "antd";

export default function ManageDataWeeklyFilter(
  showColors,
  setShowColors,
  { columnToggleOptions, columnToggle, onChange }
) {
  return (
    <div className="d-flex gap-3 align-items-center">
      <div className="mt-2">
        <Form>
          <Form.Item label="Colors">
            <Switch
              checked={showColors}
              onChange={(checked) => setShowColors(checked)}
            />
          </Form.Item>
        </Form>
      </div>
      <div className="ms-auto">
        <Checkbox.Group
          options={columnToggleOptions}
          value={columnToggle}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
