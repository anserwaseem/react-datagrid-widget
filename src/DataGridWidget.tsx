import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { JSONPath } from "jsonpath-plus";
import { List, ListItem, ListItemText, useMediaQuery, useTheme } from "@mui/material";

type LabelKeyDataType = {
  label: string;
  key: string;
  dataType: "string" | "number" | "boolean" | "date" | "bigint";
};

type DataGridWidgetProps = {
  labelKeyDataTypes: LabelKeyDataType[];
  apiEndpoint: string;
  jsonPaths: { [key: string]: string };
  titleKey: string;
  subtitleKey: string;
};

// interface DataGridWidgetProps {
//   labelKeyDataTypes: { label: string; key: string; dataType: string }[];
//   apiEndpoint: string;
//   jsonPaths: { [key: string]: string };
//   config?: {
//     titleKey?: string;
//     subtitleKey?: string;
//   };
// }

const DataGridWidget: React.FC<DataGridWidgetProps> = ({
  labelKeyDataTypes,
  apiEndpoint,
  jsonPaths,
  titleKey,
  subtitleKey,
}) => {
  const [data, setData] = useState<any[]>([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const jsonData = (await response.json())?.data as any[];

        const transformedData = jsonData.map((item: any, index: number) => {
          const transformedItem: any = {};
          labelKeyDataTypes.forEach(({ key, dataType }) => {
            const jsonPath = jsonPaths[key];
            const value = JSONPath({ path: jsonPath, json: item })[0];
            transformedItem[key] = transformValue(value, dataType.toString());
            transformedItem.id = index;

            // let value = item;
            // jsonPaths[key].split(".").forEach((path) => {
            //   value = value[path];
            // });
            // transformedItem[key] = transformValue(value, dataType);
            // transformedItem.id = index;
          });
          return transformedItem;
        });
        setData(transformedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiEndpoint, jsonPaths, labelKeyDataTypes, titleKey, subtitleKey]);

  const columns: GridColDef[] = labelKeyDataTypes.map(({ label, key }) => ({
    field: key,
    headerName: label,
    flex: 1,
    sortable: true,
  }));

  const transformValue = (value: any, dataType: string) => {
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
  };

  // const renderTitle = (params: any) => (
  //   <strong>{params?.row?.[titleKey] ?? ""}</strong>
  // );
  // const renderSubtitle = (params: any) => (
  //   <div>{params?.row?.[subtitleKey] ?? ""}</div>
  // );

  return isSmallScreen ? (
    <List>
      {data.map((item: any) => (
        <ListItem key={item.id}>
          <ListItemText
            primary={item[titleKey || labelKeyDataTypes[0].key]}
            secondary={item[subtitleKey || labelKeyDataTypes[1]?.key]}
          />
        </ListItem>
      ))}
    </List>
  ) : (
    <DataGrid
      rows={data}
      columns={columns}
      autoHeight
      disableRowSelectionOnClick
    />
  );
};

export default DataGridWidget;
