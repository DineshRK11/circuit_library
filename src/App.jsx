import "./App.css";
import Mainpage from "./components/Mainpage";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import EditTemplate from "./components/EditTemplate";

function App() {
  
  return (
    <>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route exact path="/" element={<Mainpage />} />
        <Route exact path="/new" element={<Mainpage />} />
        <Route path="/edit/:id" element={<EditTemplate />} />
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;
