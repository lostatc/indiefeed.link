import { Form, FormControlProps } from "react-bootstrap";
import "./FormInput.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const FormInput = (props: FormControlProps) => {
  return <Form.Control {...props} />;
};
