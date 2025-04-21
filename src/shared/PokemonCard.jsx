import { Link } from "react-router-dom";

const PokemonCard = ({ pokemon }) => {
  return (
    <Link to={`/pokemon/${pokemon.name}`}>
      <div className="bg-white dark:bg-zinc-100/10 text-zinc-900 dark:text-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col items-center gap-2 cursor-pointer">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-32 h-32 object-contain"
        />
        <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-center w-full text-zinc-700 dark:text-zinc-300">
          <div>
            <p className="font-semibold">Height</p>
            <p>{pokemon.height}</p>
          </div>
          <div>
            <p className="font-semibold">Base experience</p>
            <p>{pokemon.base_experience}</p>
          </div>
          <div>
            <p className="font-semibold">Weight</p>
            <p>{pokemon.weight}</p>
          </div>
          <div>
            <p className="font-semibold">Ability</p>
            <p>{pokemon.ability ?? "N/A"}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;
