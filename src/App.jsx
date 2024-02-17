import "./App.css";

import { Route, Routes } from "react-router-dom";

import Forms from "./components/Forms";
import RoomPage from "./pages/RoomPage";
const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Forms />} />
        <Route path="/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
};
export default App;