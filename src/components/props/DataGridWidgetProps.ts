export interface DataGridWidgetProps {
  config: Config;
  setIsSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
}
