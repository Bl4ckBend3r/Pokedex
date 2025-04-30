export const fetchFullCollection = async () => {
    const localData = await fetch("http://localhost:3000/pokemons").then((res) => res.json());
  
    const apiData = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150").then((res) =>
      res.json()
    );
  
    const merged = await Promise.all(
      apiData.results.map(async (p) => {
        const res = await fetch(p.url);
        const poke = await res.json();
  
        const local = localData.find((lp) => String(lp.id) === String(poke.id));
  
        return {
          id: poke.id,
          name: poke.name,
          image: poke.sprites.other["official-artwork"].front_default,
          base_experience: local?.base_experience ?? poke.base_experience ?? 0,
          weight: local?.weight ?? poke.weight ?? 0,
          height: local?.height ?? poke.height ?? 0,
          ability: local?.ability ?? poke.abilities[0]?.ability?.name ?? "N/A",
          wins: local?.wins ?? 0,
          losses: local?.losses ?? 0,
        };
      })
    );
  
    return merged;
  };
  