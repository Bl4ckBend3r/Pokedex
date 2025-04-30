import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import WinnerModal from "@/components/WinnerModal";

const Arena = () => {
  const { user, login } = useContext(AuthContext);
  const [pokemonData, setPokemonData] = useState([]);
  const [winnerId, setWinnerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!user?.arena?.length) return;

      const localPokemons = await fetch("http://localhost:3000/pokemons").then(
        (res) => res.json()
      );

      const pokemons = await Promise.all(
        user.arena.map(async (id) => {
          let found = localPokemons.find((p) => String(p.id) === String(id));
          if (found) return found;

          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await res.json();
          return {
            id: data.id,
            name: data.name,
            weight: data.weight,
            height: data.height,
            base_experience: data.base_experience,
            image: data.sprites.other["official-artwork"].front_default,
            ability: data.abilities[0]?.ability.name || "unknown",
            wins: 0,
            losses: 0,
          };
        })
      );

      setPokemonData(pokemons);
    };

    fetchPokemonDetails();
  }, [user]);
  const handleBattle = async () => {
    const [p1, p2] = pokemonData;
    if (!p1 || !p2) return;

    const ensurePokemonExists = async (pokemon) => {
      console.log("🔎 Sprawdzam istnienie pokemona:", pokemon);
    
      const checkRes = await fetch(`http://localhost:3000/pokemons/${pokemon.id}`);
      if (checkRes.ok) {
        const existing = await checkRes.json();
        console.log("Już istnieje:", existing);
        return existing;
      }
      
      const createRes = await fetch("http://localhost:3000/pokemons", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(pokemon.id),
          name: pokemon.name,
          weight: pokemon.weight,
          height: pokemon.height,
          base_experience: pokemon.base_experience,
          image: pokemon.image,
          ability: pokemon.ability ?? "unknown",
          wins: 0,
          losses: 0,
        }),
      });
      console.log("POST result:", await createRes.text());
      ;
    
      if (!createRes.ok) {
        const errorText = await createRes.text();
        throw new Error(`Błąd dodawania pokemona: ${errorText}`);
      }
    

      const newRes = await fetch(`http://localhost:3000/pokemons/${pokemon.id}`);
      if (!newRes.ok) {
        throw new Error(`Błąd ładowania pokemona ID: ${pokemon.id} po dodaniu`);
      }
    
      const result = await newRes.json();
      console.log("Dodano pokemona do JSON-servera:", result);
      return result;
    };
    

    const first = await ensurePokemonExists(p1);
    const second = await ensurePokemonExists(p2);

    const power1 = first.weight * first.base_experience;
    const power2 = second.weight * second.base_experience;

    let winner = null;
    let loser = null;

    if (power1 === power2) {
      setWinnerId(null);
      setIsDraw(true);
      setShowModal(true);
      return;
    }

    if (power1 > power2) {
      winner = first;
      loser = second;
    } else {
      winner = second;
      loser = first;
    }

    await Promise.all([
      fetch(`http://localhost:3000/pokemons/${Number(winner.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base_experience: winner.base_experience + 10,
          wins: Number(winner.wins || 0) + 1,
          losses: Number(winner.losses || 0),
        }),
      }),
      fetch(`http://localhost:3000/pokemons/${Number(loser.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wins: Number(loser.wins || 0),
          losses: Number(loser.losses || 0) + 1,
        }),
      }),
    ]);

    setWinnerId(winner.id);
    setShowModal(true);

    const updated = await fetch("http://localhost:3000/pokemons").then((res) =>
      res.json()
    );
    setPokemonData(updated.filter((p) => user.arena.includes(String(p.id))));
  };

  const handleRemove = async (id) => {
    const updatedArena = user.arena.filter(
      (pokemonId) => String(pokemonId) !== String(id)
    );
    const updatedUser = { ...user, arena: updatedArena };

    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ arena: updatedArena }),
    });

    login(updatedUser);
    setPokemonData((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const handleLeaveArena = async () => {
    if (!user) return;
    const updatedUser = { ...user, arena: [] };

    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ arena: [] }),
    });

    login(updatedUser);
    setWinnerId(null);
    setPokemonData([]);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <h1 className="text-center text-3xl font-bold text-white mb-6">Arena</h1>

      {showModal && (
        <WinnerModal
          pokemon={isDraw ? null : pokemonData.find((p) => p.id === winnerId)}
          onClose={() => {
            setShowModal(false);
            setIsDraw(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`relative bg-zinc-800 text-white rounded-xl flex justify-center items-center h-72 w-72 shadow-xl transition-all duration-300 ${
              winnerId && pokemonData[i]?.id !== winnerId ? "opacity-50" : ""
            }`}
          >
            {pokemonData[i] ? (
              <>
                <button
                  onClick={() => handleRemove(pokemonData[i].id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                >
                  Usuń
                </button>
                <div className="text-center">
                  <img
                    src={pokemonData[i].image}
                    alt={pokemonData[i].name}
                    className="w-32 h-32 mx-auto"
                  />
                  <p className="capitalize font-semibold mt-2">
                    {pokemonData[i].name}
                  </p>
                  {(pokemonData[i].wins > 0 || pokemonData[i].losses > 0) && (
                    <p className="text-sm mt-1">
                      W: {pokemonData[i].wins || 0} | L:{" "}
                      {pokemonData[i].losses || 0}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p>Brak Pokémona</p>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-8 flex flex-col items-center gap-4">
        {winnerId && (
          <p className="text-xl font-bold text-green-400 mb-2">
            Zwycięzca: {pokemonData.find((p) => p.id === winnerId)?.name}
          </p>
        )}
        <button
          disabled={pokemonData.length < 2}
          onClick={handleBattle}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded text-lg transition w-40"
        >
          WALCZ!
        </button>

        {winnerId && (
          <button
            onClick={handleLeaveArena}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-lg transition w-40"
          >
            Opuść Arenę
          </button>
        )}
      </div>
    </div>
  );
};

export default Arena;
