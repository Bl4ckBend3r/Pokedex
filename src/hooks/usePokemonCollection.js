import { useEffect, useState, useCallback } from "react";

export const usePokemonCollection = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPokemons = useCallback(async () => {
    setLoading(true);
    try {
      const local = await fetch("http://localhost:3000/pokemons").then(r => r.json());

      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
      const data = await res.json();

      const apiPokemons = await Promise.all(
        data.results.map(async (p) => {
          const r = await fetch(p.url);
          const d = await r.json();

          const localMatch = local.find(lp => String(lp.id) === String(d.id));

          return {
            id: d.id,
            name: d.name,
            image: d.sprites.other["official-artwork"].front_default,
            base_experience: localMatch?.base_experience ?? d.base_experience,
            weight: localMatch?.weight ?? d.weight,
            height: localMatch?.height ?? d.height,
            ability: d.abilities[0]?.ability?.name ?? "N/A",
            wins: localMatch?.wins ?? 0,
            losses: localMatch?.losses ?? 0,
          };
        })
      );

      const customPokemons = local.filter(lp => isNaN(Number(lp.id)) || Number(lp.id) > 150);
      setPokemons([...apiPokemons, ...customPokemons]);
    } catch (err) {
      console.error("Błąd podczas pobierania pokémonów:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  return { pokemons, loading, refetch: fetchPokemons };
};
