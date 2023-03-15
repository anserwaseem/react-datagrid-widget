import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { JSONPath } from "jsonpath-plus";
import {
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGridWidgetProps } from "./props/DataGridWidgetProps";

const DataGridWidget: React.FC<DataGridWidgetProps> = ({
  config,
  setIsSnackbarOpen,
  setSnackbarMessage,
}) => {
  const { apiEndpoint, columns, titleKey, subtitleKey } = config;

  const [data, setData] = useState<any[]>([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const jsonData = (await response.json())?.data as any[];
        if (columns?.length > 0) {
          // get data of whole column using its jsonPath and store in rawData
          let rawData: any[] = [];
          columns.forEach(({ key, jsonPath }) => {
            const jsonResult = JSONPath({
              path: jsonPath === "" ? `$..${key}` : jsonPath,
              json: jsonData,
            });
            rawData.push(jsonResult);
          });

          const maxArrayLength =
            Math.max(...rawData?.map((arr) => arr.length)) ?? 0;

          // create an array of objects with key as column key and value as data of that column
          let transformedData: any[] = [];
          for (let i = 0; i < maxArrayLength; i++) {
            const transformedItem: any = {};
            rawData.forEach((arr, index) => {
              transformedItem[columns[index].key] = transformValue(
                arr[i],
                columns?.[index]?.dataType ?? "string"
              );
              transformedItem.id = i;
            });
            transformedData.push(transformedItem);
          }
          setData(transformedData);
        } else setData(jsonData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiEndpoint, columns, titleKey, subtitleKey]);

  const gridColumns: GridColDef[] = columns.map(({ label, key }) => ({
    field: key,
    headerName: label,
    flex: 1,
    sortable: true,
  }));

  const transformValue = (value: any, dataType: DataType) => {
    if (typeof value !== dataType) {
      setIsSnackbarOpen(true);
      setSnackbarMessage(
        `Data type mismatch. Expected ${dataType} but got ${typeof value} in the data.`
      );
      return String(value);
    }
    try {
      switch (dataType) {
        case "number":
          return Number(value);
        case "date":
          return new Date(value).toISOString();
        case "boolean":
          return Boolean(value);
        case "bigint":
          return BigInt(value);
        default:
          return String(value);
      }
    } catch (error: any) {
      console.error(error);
      setIsSnackbarOpen(true);
      setSnackbarMessage(error?.message ?? "Error");
      return String(value);
    }
  };

  return isSmallScreen ? (
    <List>
      {data.map((item: any) => (
        <ListItem key={item.id}>
          <ListItemText
            primary={item[titleKey || columns[0].key]}
            secondary={item[subtitleKey || columns[1]?.key]}
          />
        </ListItem>
      ))}
    </List>
  ) : (
    <DataGrid
      rows={data}
      columns={gridColumns}
      autoHeight
      disableRowSelectionOnClick
    />
  );
};

export default DataGridWidget;
