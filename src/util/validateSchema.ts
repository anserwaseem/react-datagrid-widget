import * as yup from "yup";

export const validationSchema = yup.object({
  apiEndpoint: yup
    .string()
    .url("Enter a valid url")
    .required("Api Endpoint is required"),
});
