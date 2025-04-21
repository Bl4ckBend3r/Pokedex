import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const PokemonDetails = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      setPokemon({
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        base_experience: data.base_experience,
        weight: data.weight,
        height: data.height,
        ability: data.abilities[0]?.ability.name ?? "unknown",
      });
    };
    fetchDetails();
  }, [name]);

  if (!pokemon) return <div className="text-center text-white">Ładowanie...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xl rounded-3xl p-8 w-full max-w-4xl flex flex-col lg:flex-row items-center gap-8">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-64 h-64 object-contain"
        />
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-extrabold mb-4 capitalize">{pokemon.name}</h1>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Height</p>
              <p>{pokemon.height}</p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Base experience</p>
              <p>{pokemon.base_experience}</p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Weight</p>
              <p>{pokemon.weight}</p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Ability</p>
              <p>{pokemon.ability}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
