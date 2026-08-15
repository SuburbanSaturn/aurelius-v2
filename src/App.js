import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/AppRouter";
import AppChrome from "./app/AppChrome";

function App() {
  return (
    <BrowserRouter>
      <AppChrome />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
