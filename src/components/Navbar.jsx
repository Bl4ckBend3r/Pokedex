import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const { toggleTheme, theme } = useTheme();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-yellow-400 hover:opacity-80">
        Pokedex
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-yellow-300">
              Logowanie
            </Link>
            <Link to="/register" className="hover:text-yellow-300">
              Rejestracja
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm">👤 {user.name}</span>
            <Link to="/favourites" className="hover:text-yellow-300">Ulubione</Link>
            <Link to="/arena" className="hover:text-yellow-300">Arena</Link>
            <Link to="/ranking" className="hover:text-yellow-300">Ranking</Link>
            <Link to="/edit" className="hover:text-yellow-300">Edycja</Link>
            <button onClick={logout} className="hover:text-red-400">Wyloguj</button>
          </>
        )}
        <button onClick={toggleTheme} className="text-xl">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
