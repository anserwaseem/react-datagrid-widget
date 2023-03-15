import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { FormEvent, useEffect, useState } from "react";
import { useFormik, getIn } from "formik";
import { validationSchema } from "../util/validateSchema";
import { ColumnLimit } from "../util/constants";
import DataGridWidget from "../components/DataGridWidget";

export const ConfigForm: React.FC = () => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [numberOfColumns, setNumberOfColumns] = useState(0);
  const [areConfigurationsSet, setAreConfigurationsSet] = useState(false);

  const formik = useFormik({
    initialValues: {
      apiEndpoint: "",
      columns: [] as Column[],
      titleKey: "",
      subtitleKey: "",
    } as Config,
    validationSchema: validationSchema,
    onSubmit: () => setAreConfigurationsSet(true),
  });

  useEffect(() => {
    if (numberOfColumns >= ColumnLimit) {
      setIsSnackbarOpen(true);
      setSnackbarMessage(`Cannot create more than ${ColumnLimit} columns.`);
    }
  }, [numberOfColumns]);

  const toggleCollapsible = () => setIsCollapsibleOpen(!isCollapsibleOpen);

  const handleSnackbarClose = () => setIsSnackbarOpen(false);

  const handleAddColumn = () => {
    formik.setFieldValue("columns", [
      ...formik.values.columns,
      { label: "", key: "", dataType: "", jsonPath: "" },
    ]);

    setNumberOfColumns(numberOfColumns + 1);

    if (areConfigurationsSet) setAreConfigurationsSet(false);
  };

  const handleDeleteColumn = (index: number) => {
    formik.setFieldValue(
      "columns",
      formik.values.columns.filter((_, i) => i !== index)
    );

    if (formik.values.titleKey === formik.values.columns[index].key)
      formik.setFieldValue("titleKey", "");

    if (formik.values.subtitleKey === formik.values.columns[index].key)
      formik.setFieldValue("subtitleKey", "");

    setNumberOfColumns(numberOfColumns - 1);

    if (areConfigurationsSet) setAreConfigurationsSet(false);
  };

  const handleSetColumn = (
    index: number,
    propertyName: string,
    value: string
  ) => {
    formik.setFieldValue(`columns[${index}].[${propertyName}]`, value);

    if (areConfigurationsSet) setAreConfigurationsSet(false);
  };

  const handleSetConfig = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    formik.handleChange(event);

    if (areConfigurationsSet) setAreConfigurationsSet(false);
  };

  const handleSetConfigurations = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formik.handleSubmit();
  };

  return (
    <>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Button onClick={toggleCollapsible}>
        <Typography variant="h6" textTransform={"none"}>
          DataGrid Configurations
        </Typography>
        {isCollapsibleOpen ? <ExpandLess /> : <ExpandMore />}
      </Button>

      <Collapse in={isCollapsibleOpen} timeout="auto">
        <Container>
          <Typography
            variant="h4"
            fontWeight={"bold"}
            pt={"1rem"}
            textAlign={"center"}
          >
            Set Configurations
          </Typography>

          <Box
            component="form"
            autoComplete={"true"}
            onSubmit={handleSetConfigurations}
            py={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "#44444",
              "& .MuiInputBase-root, .MuiButton-root": {
                boxShadow: "0px 0px 10px 0px rgba(0.5,0,0,0.1)",
                borderRadius: "30px !important",
              },
            }}
          >
            <TextField
              id="apiEndpoint"
              label="API Endpoint"
              fullWidth
              autoFocus
              margin="dense"
              value={formik.values.apiEndpoint}
              onChange={handleSetConfig}
              error={
                formik.touched.apiEndpoint && Boolean(formik.errors.apiEndpoint)
              }
              helperText={
                formik.touched.apiEndpoint && formik.errors.apiEndpoint
              }
            />

            <Button
              variant="outlined"
              color="info"
              onClick={handleAddColumn}
              disabled={numberOfColumns >= ColumnLimit}
              sx={{ my: 0.5 }}
            >
              Add Column
            </Button>
            {formik.values.columns.map((column, index) => (
              <Stack key={index} direction="row" sx={{ gap: 2 }}>
                <TextField
                  id="label"
                  label="Label"
                  fullWidth
                  margin="dense"
                  value={column.label}
                  onChange={(event) =>
                    handleSetColumn(index, "label", event.target.value)
                  }
                  error={Boolean(
                    getIn(formik.touched, `columns[${index}].label`) &&
                      getIn(formik.errors, `columns[${index}].label`)
                  )}
                  helperText={
                    getIn(formik.touched, `columns[${index}].label`) &&
                    getIn(formik.errors, `columns[${index}].label`)
                  }
                />
                <TextField
                  id="key"
                  label="Key"
                  fullWidth
                  margin="dense"
                  value={column.key}
                  onChange={(event) =>
                    handleSetColumn(index, "key", event.target.value)
                  }
                  error={Boolean(
                    getIn(formik.touched, `columns[${index}].key`) &&
                      getIn(formik.errors, `columns[${index}].key`)
                  )}
                  helperText={
                    getIn(formik.touched, `columns[${index}].key`) &&
                    getIn(formik.errors, `columns[${index}].key`)
                  }
                />
                <TextField
                  id="dataType"
                  label="Data Type"
                  fullWidth
                  margin="dense"
                  value={column.dataType}
                  onChange={(event) =>
                    handleSetColumn(index, "dataType", event.target.value)
                  }
                  error={Boolean(
                    getIn(formik.touched, `columns[${index}].dataType`) &&
                      getIn(formik.errors, `columns[${index}].dataType`)
                  )}
                  helperText={
                    getIn(formik.touched, `columns[${index}].dataType`) &&
                    getIn(formik.errors, `columns[${index}].dataType`)
                  }
                />
                <TextField
                  id="jsonPath"
                  label="JSON Path"
                  type={"text"}
                  fullWidth
                  margin="dense"
                  value={column.jsonPath}
                  onChange={(event) =>
                    handleSetColumn(index, "jsonPath", event.target.value)
                  }
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteColumn(index)}
                  sx={{
                    marginY: "0.3rem",
                  }}
                >
                  Delete
                </Button>
              </Stack>
            ))}

            <TextField
              id="titleKey"
              name="titleKey"
              select
              label="Title Key"
              fullWidth
              margin="dense"
              value={formik.values.titleKey}
              onChange={handleSetConfig}
            >
              <MenuItem key={""} value={""}>
                Not Selected // Or Empty
              </MenuItem>
              {formik.values.columns.map((column, index) => (
                <MenuItem key={index} value={column.key}>
                  {column.key}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="subtitleKey"
              name="subtitleKey"
              select
              label="Subtitle Key"
              fullWidth
              margin="dense"
              value={formik.values.subtitleKey}
              onChange={handleSetConfig}
            >
              <MenuItem key={""} value={""}>
                Not Selected // Or Empty
              </MenuItem>
              {formik.values.columns.map((column, index) => (
                <MenuItem key={index} value={column.key}>
                  {column.key}
                </MenuItem>
              ))}
            </TextField>

            <Button variant="contained" color="success" type="submit">
              Set
            </Button>
          </Box>
        </Container>
      </Collapse>

      {areConfigurationsSet && (
        <DataGridWidget
          config={formik.values}
          setIsSnackbarOpen={setIsSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
        />
      )}
    </>
  );
};
