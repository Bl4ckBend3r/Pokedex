import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Heart } from "lucide-react";
import { useSnackbar } from "notistack";

const PokemonDetails = () => {
  const { name } = useParams();
  const { user, login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [pokemon, setPokemon] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToArena = async () => {
    if (!user || !pokemon) return;
  
    if (user.arena.includes(pokemon.id)) {
      enqueueSnackbar("Ten pokemon już jest na arenie!", {
        variant: "warning",
      });
      return;
    }
  
    if (user.arena.length >= 2) {
      enqueueSnackbar("Arena pełna! Usuń któregoś pokemona.", {
        variant: "error",
      });
      return;
    }
  
    
    const local = await fetch("http://localhost:3000/pokemons").then((res) =>
      res.json()
    );
    const exists = local.find((p) => p.id === pokemon.id);
  
    if (!exists) {
      await fetch("http://localhost:3000/pokemons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pokemon),
      });
    }
  
    const updatedArena = [...user.arena, String(pokemon.id)];
    const updatedUser = { ...user, arena: updatedArena };
  
    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ arena: updatedArena }),
    });
  
    login(updatedUser);
    enqueueSnackbar(`${pokemon.name} dodany do areny!`, {
      variant: "success",
    });
  };
  

  useEffect(() => {
    const fetchDetails = async () => {
      const local = await fetch("http://localhost:3000/pokemons").then((res) =>
        res.json()
      );

      const localPoke = local.find((p) => p.name === name);

      if (localPoke) {
        setPokemon(localPoke);
        setIsFavorite(user?.favorites?.includes(localPoke.id));
        return;
      }

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      const details = {
        id: String(data.id),
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        base_experience: data.base_experience,
        weight: data.weight,
        height: data.height,
        ability: data.abilities[0]?.ability.name ?? "N/A",
        wins: 0,
        losses: 0,
      };
      setPokemon(details);
    };

    fetchDetails();
  }, [name, user]);

  const toggleFavorite = async () => {
    if (!user || !pokemon) return;

    const updatedFavorites = isFavorite
    ? user.favorites.filter((id) => String(id) !== String(pokemon.id))
    : [...user.favorites, String(pokemon.id)];
  

    const updatedUser = { ...user, favorites: updatedFavorites };

    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorites: updatedFavorites }),
    });

    login(updatedUser);
    setIsFavorite(!isFavorite);

    enqueueSnackbar(
      isFavorite
        ? `${pokemon.name} został usunięty z ulubionych!`
        : `${pokemon.name} dodany do ulubionych!`,
      { variant: "info" }
    );
  };

  if (!pokemon)
    return <div className="text-center text-white">Ładowanie...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full flex flex-col md:flex-row items-center gap-10">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-60 h-60 object-contain"
        />

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex justify-center md:justify-between items-center gap-4">
            <h1 className="text-4xl font-extrabold capitalize">
              {pokemon.name}
            </h1>
            {user && (
              <div className="flex gap-3 items-center">
                <button onClick={toggleFavorite} title="Ulubione">
                  <Heart
                    className="w-7 h-7"
                    fill={isFavorite ? "red" : "none"}
                    stroke="red"
                  />
                </button>

                <button
                  onClick={handleAddToArena}
                  className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base rounded-lg shadow-md transition-all duration-200 hover:scale-105"
                >
                  Do Areny
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Wzrost</p>
              <p>{pokemon.height}</p>
            </div>
            <div>
              <p className="text-gray-400">Waga</p>
              <p>{pokemon.weight}</p>
            </div>
            <div>
              <p className="text-gray-400">Doświadczenie</p>
              <p>{pokemon.base_experience}</p>
            </div>
            <div>
              <p className="text-gray-400">Zdolność</p>
              <p>{pokemon.ability}</p>
            </div>
            {(pokemon.wins > 0 || pokemon.losses > 0) && (
              <>
                <div>
                  <p className="text-gray-400">Wygrane</p>
                  <p>{pokemon.wins}</p>
                </div>
                <div>
                  <p className="text-gray-400">Przegrane</p>
                  <p>{pokemon.losses}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
