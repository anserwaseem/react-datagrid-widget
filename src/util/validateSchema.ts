import * as yup from "yup";

export const validationSchema = yup.object({
  apiEndpoint: yup
    .string()
    .url("Enter a valid url")
    .required("Api Endpoint is required"),
  columns: yup.array().of(
    yup
      .object()
      .shape({
        label: yup.string().required("Label is required"),
        key: yup.string().required("Key is required"),
        dataType: yup.string().required("Data Type is required"),
      })
      .test("is-unique", "Key must be unique", function (column) {
        const allColumns: (typeof column)[] = this.parent;
        const keys = allColumns?.map((column) => column.key);

        return keys?.filter((key) => key === column.key).length === 1;
      })
  ),
});
