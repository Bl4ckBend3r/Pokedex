import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

const Arena = () => {
  const { user, login, refreshUser } = useContext(AuthContext);
  const [pokemonData, setPokemonData] = useState([]);
  const [winnerId, setWinnerId] = useState(null);

  useEffect(() => {
    refreshUser(); 
    const fetchPokemonDetails = async () => {
      if (!user?.arena?.length) return;

      const local = await fetch("http://localhost:3000/pokemons").then((res) =>
        res.json()
      );

      const pokemons = await Promise.all(
        user.arena.map(async (id) => {
          let found = local.find((p) => p.id === id);
          if (found) return found;

          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await res.json();
          return {
            id: data.id,
            name: data.name,
            weight: data.weight,
            base_experience: data.base_experience,
            image: data.sprites.other["official-artwork"].front_default,
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
    const power1 = p1.weight * p1.base_experience;
    const power2 = p2.weight * p2.base_experience;

    let winner, loser;

    if (power1 > power2) {
      winner = p1;
      loser = p2;
    } else if (power2 > power1) {
      winner = p2;
      loser = p1;
    }

    if (winner) {
      winner.base_experience += 10;
      winner.wins = (winner.wins || 0) + 1;
      loser.losses = (loser.losses || 0) + 1;
    }

    await Promise.all(
      [winner, loser].map(async (p) => {
        if (p) {
          await fetch(`http://localhost:3000/pokemons/${p.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              base_experience: p.base_experience,
              wins: p.wins || 0,
              losses: p.losses || 0,
            }),
          });
        }
      })
    );

    setWinnerId(winner?.id || null);

    const updatedUser = { ...user, arena: [] };
    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ arena: [] }),
    });

    login(updatedUser);
  };

  const handleResetArena = async () => {
    const updatedUser = { ...user, arena: [] };
    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ arena: [] }),
    });
    login(updatedUser);
    setPokemonData([]);
    setWinnerId(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <h1 className="text-center text-3xl font-bold text-white mb-6">Arena</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`bg-zinc-800 text-white rounded-xl flex justify-center items-center h-64 w-64 shadow-xl ${
              winnerId && pokemonData[i]?.id !== winnerId ? "opacity-50" : ""
            }`}
          >
            {pokemonData[i] ? (
              <div className="text-center">
                <img
                  src={pokemonData[i].image}
                  alt={pokemonData[i].name}
                  className="w-32 h-32 mx-auto"
                />
                <p className="capitalize font-semibold mt-2">
                  {pokemonData[i].name}
                </p>
              </div>
            ) : (
              <p>Brak Pokémona</p>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        {winnerId && (
          <>
            <p className="text-xl font-bold text-green-400 mb-2">
              Zwycięzca: {pokemonData.find((p) => p.id === winnerId)?.name}
            </p>
            <button
              onClick={handleResetArena}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-lg transition mr-4"
            >
              Opuść arenę
            </button>
          </>
        )}
        <button
          disabled={pokemonData.length < 2}
          onClick={handleBattle}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded text-lg transition"
        >
          WALCZ!
        </button>
      </div>
    </div>
  );
};

export default Arena;
