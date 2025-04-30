import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import PokemonCard from "@/shared/PokemonCard";

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const localPokemons = await fetch("http://localhost:3000/pokemons").then(res => res.json());

      const fetched = await Promise.all(
        user.favorites.map(async (rawId) => {
          const id = String(rawId);
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await res.json();

          const local = localPokemons.find(lp => String(lp.id) === String(data.id));

          return {
            id: data.id,
            name: data.name,
            image: data.sprites.other["official-artwork"].front_default,
            base_experience: local?.base_experience ?? data.base_experience ?? 0,
            weight: local?.weight ?? data.weight ?? 0,
            height: local?.height ?? data.height ?? 0,
            ability: data.abilities[0]?.ability?.name ?? "N/A",
            wins: local?.wins ?? 0,
            losses: local?.losses ?? 0,
          };
        })
      );

      setPokemonList(fetched);
    };

    if (user?.favorites?.length > 0) {
      fetchFavorites();
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold my-6 text-center">Ulubione Pokemony</h2>
      {pokemonList.length === 0 ? (
        <p className="text-center text-gray-500">Brak ulubionych 😔</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {pokemonList.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
