import { useEffect, useState } from "react";

export const usePokemonCollection = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const localPokemons = await fetch("http://localhost:3000/pokemons").then((res) => res.json());

        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
        const data = await res.json();

        const detailed = await Promise.all(
          data.results.map(async (p) => {
            const res = await fetch(p.url);
            const poke = await res.json();

            const local = localPokemons.find((lp) => String(lp.id) === String(poke.id));

            return {
              id: poke.id,
              name: poke.name,
              image: poke.sprites.other["official-artwork"].front_default,
              base_experience: local?.base_experience ?? poke.base_experience ?? 0,
              weight: local?.weight ?? poke.weight ?? 0,
              height: local?.height ?? poke.height ?? 0,
              ability: poke.abilities[0]?.ability?.name ?? "N/A",
              wins: local?.wins ?? 0,
              losses: local?.losses ?? 0,
            };
          })
        );

        const customPokemons = localPokemons.filter((lp) => isNaN(Number(lp.id)) || Number(lp.id) > 150);


        setPokemons([...detailed, ...customPokemons]);
      } catch (error) {
        console.error("Błąd podczas pobierania kolekcji Pokémonów:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  return { pokemons, loading };
};
