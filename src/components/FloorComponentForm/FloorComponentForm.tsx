import { Form, Input, Select } from "antd";
import { FormContainer } from "./styles";

const { Option } = Select;

const FloorComponentForm = () => {
  return (
    <FormContainer>
      <Form name="customized_form_controls" layout="inline">
        <Form.Item name="floorName" label="Floor Name :">
          <Input />
        </Form.Item>

        <Form.Item label="Floor Area (L*W) :">
          <span>
            <Input className="dimension-input" />
          </span>
          &nbsp;x&nbsp;
          <span>
            <Input className="dimension-input" />
          </span>
          &nbsp;=&nbsp;
          <span>
            <Select
              defaultValue="sqf"
              //onChange={handleChange}
              className="dimension-measures"
            >
              <Option value="sqf">sqf</Option>
              <Option value="sqm">sqm</Option>
            </Select>
          </span>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

export default FloorComponentForm;
