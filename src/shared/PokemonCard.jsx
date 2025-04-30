import { useNavigate } from "react-router-dom";

const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pokemon/${pokemon.name}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative bg-gradient-to-br from-gray-100 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 p-4 rounded-2xl shadow-lg flex flex-col items-center cursor-pointer transition hover:scale-105"
    >
      {/* W/L badge */}
      {((pokemon.wins ?? 0) > 0 || (pokemon.losses ?? 0) > 0)&& (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          W: {pokemon.wins ?? 0} | L: {pokemon.losses ?? 0}
        </div>
      )}

      {/* Image */}
      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="w-32 h-32 object-contain mb-4"
      />

      {/* Name */}
      <h3 className="text-xl font-bold capitalize">{pokemon.name}</h3>

      {/* Attributes */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Height</p>
          <p>{pokemon.height}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Base experience</p>
          <p>{pokemon.base_experience}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Weight</p>
          <p>{pokemon.weight}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Ability</p>
          <p>{pokemon.ability ?? "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
