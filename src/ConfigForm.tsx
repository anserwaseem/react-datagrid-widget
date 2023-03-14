import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { validationSchema } from "./util/validateSchema";
import { ColumnLimit } from "./util/constants";

type Column = {
  label: string;
  key: string;
  dataType: string;
};

type Config = {
  apiEndpoint: string;
  columns: Column[];
  jsonPath: string;
  titleKey: string;
  subtitleKey: string;
};

export const ConfigForm: React.FC = () => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [numberOfColumns, setNumberOfColumns] = useState(0);

  const formik = useFormik({
    initialValues: {
      apiEndpoint: "",
      columns: [] as Column[],
      jsonPath: "",
      titleKey: "",
      subtitleKey: "",
    } as Config,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  useEffect(() => {
    if (numberOfColumns >= ColumnLimit) {
      setIsSnackbarOpen(true);
    }
  }, [numberOfColumns]);

  const toggleCollapsible = () => setIsCollapsibleOpen(!isCollapsibleOpen);

  const handleSnackbarClose = () => setIsSnackbarOpen(false);

  const handleAddColumn = () => {
    formik.setFieldValue("columns", [
      ...formik.values.columns,
      { label: "", key: "", dataType: "" },
    ]);

    setNumberOfColumns(numberOfColumns + 1);
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
  };

  const handleSetColumn = (
    index: number,
    propertyName: string,
    value: string
  ) => {
    formik.setFieldValue(`columns[${index}].[${propertyName}]`, value);
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
          Cannot create more than {ColumnLimit} columns
        </Alert>
      </Snackbar>

      <Button onClick={toggleCollapsible}>
        <Typography variant="h6" textTransform={"none"}>
          DataGrid Configurations
        </Typography>
        {isCollapsibleOpen ? <ExpandLess /> : <ExpandMore />}
      </Button>

      <Collapse in={isCollapsibleOpen} timeout="auto" unmountOnExit>
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
            onSubmit={formik.handleSubmit}
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
              required
              margin="dense"
              value={formik.values.apiEndpoint}
              onChange={formik.handleChange}
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
              sx={{ mt: 0.5 }}
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
              id="jsonPath"
              label="JSON Path"
              type={"text"}
              fullWidth
              margin="dense"
              value={formik.values.jsonPath}
              onChange={formik.handleChange}
            />

            <TextField
              id="titleKey"
              name="titleKey"
              select
              label="Title Key"
              fullWidth
              margin="dense"
              value={formik.values.titleKey}
              onChange={formik.handleChange}
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
              onChange={formik.handleChange}
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
    </>
  );
};
