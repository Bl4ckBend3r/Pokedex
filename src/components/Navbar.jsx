import { Link, useNavigate } from "react-router-dom";
import useTheme from "@/hooks/useTheme";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Sun, Moon, User } from "lucide-react";

const Navbar = () => {
  const { isDark, setIsDark } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
  className={`w-full px-4 py-3 flex items-center justify-between ${
    isDark ? "bg-zinc-900 text-white" : "bg-blue-100 text-zinc-900"
  }`}
>

      <div className="flex items-center space-x-4">
        <Link to="/">
          <h1 className="text-2xl font-bold text-blue-400">Pokedex</h1>
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{user.name}</span>
            </div>

            <Link to="/favorites">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                ULUBIONE
              </button>
            </Link>
            <Link to="/arena">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                ARENA
              </button>
            </Link>
            <Link to="/ranking">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                RANKING
              </button>
            </Link>
            <Link to="/edit">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                EDYCJA
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              WYLOGUJ
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="text-blue-400">Logowanie</button>
            </Link>
            <Link to="/register">
              <button className="text-blue-400">Rejestracja</button>
            </Link>
          </>
        )}

        <label className="flex items-center cursor-pointer ml-4">
          <input
            type="checkbox"
            className="sr-only"
            checked={isDark}
            onChange={() => setIsDark(!isDark)}
          />
          <div className="w-10 h-6 bg-gray-400 rounded-full shadow-inner relative">
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-md transition-transform duration-300 transform ${
                isDark ? "translate-x-full bg-yellow-400" : "bg-white"
              }`}
            ></div>
          </div>
          <div className="ml-2">
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </div>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;