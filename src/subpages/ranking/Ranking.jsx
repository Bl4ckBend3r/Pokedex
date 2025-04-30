import { useEffect, useState } from "react";
import { fetchFullCollection } from "@/utils/fetchFullCollection"; 

const sortOptions = [
  { label: "Doświadczenie", value: "base_experience" },
  { label: "Waga", value: "weight" },
  { label: "Wzrost", value: "height" },
  { label: "Wygrane walki", value: "wins" },
  { label: "Przegrane walki", value: "losses" }
];

const Ranking = () => {
  const [pokemons, setPokemons] = useState([]);
  const [sortBy, setSortBy] = useState("wins");

  useEffect(() => {
    const fetchData = async () => {
      const fullList = await fetchFullCollection();
      setPokemons(fullList);
    };

    fetchData();
  }, []);

  const sortedPokemons = [...pokemons].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-6">Ranking Pokémonów</h2>

      <div className="mb-6 text-center">
        <label htmlFor="sort" className="mr-2 font-semibold">
          Sortuj według:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded border dark:bg-zinc-700 dark:text-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {sortedPokemons.map((pokemon, index) => (
          <div
            key={pokemon.id}
            className="bg-zinc-800 text-white rounded-xl p-4 flex items-center shadow-md"
          >
            <span className="text-xl font-bold w-10">#{index + 1}</span>
            <img src={pokemon.image} alt={pokemon.name} className="w-16 h-16 mx-4" />
            <div className="flex-1">
              <p className="capitalize font-semibold text-lg">{pokemon.name}</p>
              <p className="text-sm">
                W: {pokemon.wins || 0} | L: {pokemon.losses || 0} | Exp: {pokemon.base_experience} |
                Waga: {pokemon.weight} | Wzrost: {pokemon.height}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;