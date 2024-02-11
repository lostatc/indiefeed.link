import { Form, FormControlProps } from "react-bootstrap";
import "./FormInput.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsPrefixProps } from "react-bootstrap/esm/helpers";

export const FormInput = (props: BsPrefixProps<"input"> & FormControlProps) => {
  return <Form.Control {...props} />;
};
