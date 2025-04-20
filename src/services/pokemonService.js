import axios from "axios";

export const fetchPokemons = async (limit = 150) => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
  );

  const results = response.data.results;

  const detailed = await Promise.all(
    results.map(async (p) => {
      const res = await axios.get(p.url);
      return {
        id: res.data.id,
        name: res.data.name,
        image: res.data.sprites.other["official-artwork"].front_default,
        base_experience: res.data.base_experience,
        weight: res.data.weight,
        height: res.data.height,
        type: res.data.types[0].type.name,
      };
    })
  );

  return detailed;
};
