import {  useState } from "react";
import PokemonCard from "../../shared/PokemonCard";
import { usePokemonCollection } from "@/hooks/usePokemonCollection";


const Home = () => {
  const { pokemons, loading, refetch } = usePokemonCollection();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonsPerPage = 15;

  // useEffect(() => {
  //   const fetchPokemons = async () => {
  //     const localPokemons = await fetch("http://localhost:3000/pokemons").then(res => res.json());
  
  //     const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
  //     const data = await res.json();
     
  //     const detailed = await Promise.all(
  //       data.results.map(async (p) => {
  //         const res = await fetch(p.url);
  //         const poke = await res.json();
  
  //         const local = localPokemons.find(lp => String(lp.id) === String(poke.id));
  
  //         return {
  //           id: poke.id,
  //           name: poke.name,
  //           image: poke.sprites.other["official-artwork"].front_default,
  //           base_experience: local?.base_experience ?? poke.base_experience ?? 0,
  //           weight: local?.weight ?? poke.weight ?? 0,
  //           height: local?.height ?? poke.height ?? 0,
  //           ability: poke.abilities[0]?.ability?.name ?? "N/A",
  //           wins: local?.wins ?? 0,
  //           losses: local?.losses ?? 0,
  //         };
  //       })
  //     );
  
  //     setPokemons(detailed);
  //   };
  
  //   fetchPokemons();
  // }, []);
  

  const filtered = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * pokemonsPerPage;
  const indexOfFirst = indexOfLast - pokemonsPerPage;
  const currentPokemons = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / pokemonsPerPage);

  return (
    <div className="w-full px-4 sm:px-8">
      <input
        type="text"
        placeholder="Szukaj Pokémona..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl transition bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 mt-8">
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
