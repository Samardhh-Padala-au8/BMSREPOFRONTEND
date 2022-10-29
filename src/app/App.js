import { Route, Routes } from "react-router-dom";
import { MainPage, DetailPage } from "./pages";
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/detail/:id" element={<DetailPage />} />
    </Routes>
  );
}

export default App;
