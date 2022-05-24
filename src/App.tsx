import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NemRoom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Home/>}/>
        <Route path="/rooms/new" element={<NewRoom/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
