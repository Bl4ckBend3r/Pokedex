import { useNavigate } from "react-router-dom";

const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/pokemon/${pokemon.id}`)}
      className="bg-white text-black rounded shadow p-4 cursor-pointer hover:scale-105 transition"
    >
      <img src={pokemon.image} alt={pokemon.name} className="w-full h-32 object-contain mb-2" />
      <h3 className="text-center font-bold capitalize">{pokemon.name}</h3>
      <ul className="text-sm mt-2">
        <li><strong>XP:</strong> {pokemon.base_experience}</li>
        <li><strong>Waga:</strong> {pokemon.weight}</li>
        <li><strong>Wzrost:</strong> {pokemon.height}</li>
        <li><strong>Typ:</strong> {pokemon.type}</li>
      </ul>
    </div>
  );
};

export default PokemonCard;
