import { ConfigForm } from "./ConfigForm";
import DataGridWidget from "./DataGridWidget";

function App() {
  return (
    <>
      <ConfigForm />
      <DataGridWidget
        labelKeyDataTypes={[
          {
            label: "Account Id",
            key: "account_id",
            dataType: "string",
          },
          {
            label: "Name",
            key: "name",
            dataType: "string",
          },
          {
            label: "Amount",
            key: "amount",
            dataType: "number",
          },
          {
            label: "Date",
            key: "date",
            dataType: "date",
          },
        ]}
        apiEndpoint="https://us-central1-fir-apps-services.cloudfunctions.net/transactions"
        jsonPaths={{
          amount: "amount",
          name: "name",
          date: "date",
          account_id: "account_id",
        }}
        titleKey="name"
        subtitleKey="amount"
      />
    </>
  );
}

export default App;
