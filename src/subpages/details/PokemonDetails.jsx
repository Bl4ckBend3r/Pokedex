import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Heart } from "lucide-react";

const PokemonDetails = () => {
  const { name } = useParams();
  const { user, login } = useContext(AuthContext);
  const [pokemon, setPokemon] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      const details = {
        id: data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        base_experience: data.base_experience,
        weight: data.weight,
        height: data.height,
        ability: data.abilities[0]?.ability.name ?? "unknown",
      };
      setPokemon(details);

      if (user?.favorites?.includes(details.id)) {
        setIsFavorite(true);
      }
    };
    fetchDetails();
  }, [name, user]);

  const toggleFavorite = async () => {
    if (!user) return;

    const updatedFavorites = isFavorite
      ? user.favorites.filter((id) => id !== pokemon.id)
      : [...user.favorites, pokemon.id];

    const updatedUser = { ...user, favorites: updatedFavorites };

    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ favorites: updatedFavorites }),
    });

    login(updatedUser);
    setIsFavorite(!isFavorite);
  };
  const handleAddToArena = async () => {
    if (!user) return;

    if (user.arena.length >= 2) {
      alert("Arena pełna! Najpierw usuń któregoś pokemona.");
      return;
    }

    if (user.arena.includes(Number(pokemon.id))) {
      alert("Ten pokemon już jest na arenie!");
      return;
    }

    const updatedArena = [...user.arena, pokemon.id];
    const updatedUser = { ...user, arena: updatedArena };

    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ arena: updatedArena }),
    });

    login(updatedUser);
    alert(`${pokemon.name} został dodany do areny!`);
  };

  if (!pokemon)
    return <div className="text-center text-white">Ładowanie...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xl rounded-3xl p-8 w-full max-w-4xl flex flex-col lg:flex-row items-center gap-8">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-64 h-64 object-contain"
        />
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
            <h1 className="text-4xl font-extrabold capitalize">
              {pokemon.name}
            </h1>
            {user && (
              <button onClick={toggleFavorite}>
                <Heart
                  className="w-6 h-6"
                  fill={isFavorite ? "red" : "none"}
                  stroke="red"
                />
              </button>
            )}
            <button
              onClick={handleAddToArena}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
            >
              DO ARENY
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Height</p>
              <p>{pokemon.height}</p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">
                Base experience
              </p>
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
