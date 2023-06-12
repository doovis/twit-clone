import { Routes, Route } from "react-router-dom";

import "./index.css";
import Home from "./components/Home";
import LoginModal from "./components/modals/LoginModal";
import SignupModal from "./components/modals/SignupModal";
import Users from "./Users";
import { useAppDispatch, useAppSelector } from "./store/store";


function App() {

  const selector = useAppSelector(state => state.state);
  

  return (
    <div className="bg-[#15202B]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/signup" element={<SignupModal />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
}

export default App;
