import { Route, Routes } from "react-router-dom";
import { MainPage, DetailPage, EventPage } from "./pages";
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/detail/:id" element={<DetailPage />} />
      <Route path="/event" element={<EventPage />} />
    </Routes>
  );
}

export default App;
