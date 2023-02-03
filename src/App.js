import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import EpochTable from "./component/EpochTable";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.REACT_APP_NETWORK_HTTP_URI,
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <EpochTable />
    </ApolloProvider>
  );
}

export default App;
