import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./subpages/home/Home";

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Dodamy kolejne strony później */}
        </Routes>
      </main>
    </Router>
  );
};

export default App;
