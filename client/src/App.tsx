import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import UploadPage from "./pages/UploadPage";

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UploadPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
