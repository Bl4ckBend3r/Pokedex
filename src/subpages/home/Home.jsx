import { useEffect, useState } from "react";
import PokemonCard from "../../shared/PokemonCard";

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonsPerPage = 15;

  const filtered = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * pokemonsPerPage;
  const indexOfFirst = indexOfLast - pokemonsPerPage;
  const currentPokemons = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / pokemonsPerPage);

  useEffect(() => {
    const fetchPokemons = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
      const data = await res.json();

      const detailed = await Promise.all(
        data.results.map(async (p) => {
          const res = await fetch(p.url);
          const poke = await res.json();
          return {
            id: poke.id,
            name: poke.name,
            image: poke.sprites.other["official-artwork"].front_default,
            base_experience: poke.base_experience,
            weight: poke.weight,
            height: poke.height,
            type: poke.types[0]?.type.name,
          };
        })
      );

      setPokemons(detailed);
    };

    fetchPokemons();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <input
        type="text"
        placeholder="Szukaj Pokémona..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 rounded border mb-6"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {currentPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-yellow-400 text-black"
                : "bg-gray-700 text-white"
            } hover:scale-105 transition`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
