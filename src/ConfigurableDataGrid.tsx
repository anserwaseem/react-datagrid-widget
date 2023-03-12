import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface ConfigurableDataGridProps {
  labelKeyDataTypes: { label: string; key: string; dataType: string }[];
  apiEndpoint: string;
  jsonPaths: { [key: string]: string };
  config?: {
    titleKey?: string;
    subtitleKey?: string;
  };
}

const ConfigurableDataGrid: React.FC<ConfigurableDataGridProps> = ({
  labelKeyDataTypes,
  apiEndpoint,
  jsonPaths,
  config,
}) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {}, [window.innerWidth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const jsonData = (await response.json())?.data as any[];

        const transformedData = jsonData.map((item: any, index: number) => {
          const transformedItem: any = {};
          labelKeyDataTypes.forEach(({ key, dataType }) => {
            let value = item;
            jsonPaths[key].split(".").forEach((path) => {
              value = value[path];
            });
            transformedItem[key] = transformValue(value, dataType);
            transformedItem.id = index;
          });
          return transformedItem;
        });
        setData(transformedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiEndpoint, jsonPaths, labelKeyDataTypes]);

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
      default:
        return String(value);
    }
  };

  const isSmallScreen = window.innerWidth < 600;

  const titleKey = config?.titleKey || labelKeyDataTypes[0].key;
  const subtitleKey = config?.subtitleKey || labelKeyDataTypes[1]?.key;

  const renderTitle = (params: any) => (
    <strong>{params?.row?.[titleKey] ?? ""}</strong>
  );
  const renderSubtitle = (params: any) => (
    <div>{params?.row?.[subtitleKey] ?? ""}</div>
  );

  if (isSmallScreen) {
    return <div></div>;
  }

  return (
    <DataGrid
      rows={data}
      columns={columns}
      autoHeight
      disableRowSelectionOnClick
    />
  );
};

export default ConfigurableDataGrid;
