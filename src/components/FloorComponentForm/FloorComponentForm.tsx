import { Form, Input, Select, Row, Col, Typography } from "antd";
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
          <Row align="middle" gutter={8}>
            <Col>
              <Input className="dimension-input" />
            </Col>
            <Typography.Text>x</Typography.Text>
            <Col>
              <Input className="dimension-input" />
            </Col>
            <Typography.Text>=</Typography.Text>
            <Col>
              <Select
                defaultValue="sqf"
                //onChange={handleChange}
                className="dimension-measures"
              >
                <Option value="sqf">sqf</Option>
                <Option value="sqm">sqm</Option>
              </Select>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

export default FloorComponentForm;
