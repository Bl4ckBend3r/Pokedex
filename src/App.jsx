import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./subpages/home/Home";
import Login from "./subpages/auth/Login";
import Register from "./subpages/auth/Register";
import PokemonDetails from "./subpages/details/PokemonDetails";
import Favorites from "./subpages/favorites/Favorites"; 
import Edit from "./subpages/edit/Edit";
import CreatePokemon from "./subpages/edit/CreatePokemon";
import Arena from "./subpages/arena/Arena";

const App = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/create" element={<CreatePokemon />} />
          <Route path="/arena" element={<Arena />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
