import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";


const Edit = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [pokemons, setPokemons] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ weight: "", height: "", base_experience: "" });

  useEffect(() => {
    fetch("http://localhost:3000/pokemons")
      .then((res) => res.json())
      .then((data) => setPokemons(data));
  }, []);

  const handleEditClick = (pokemon) => {
    setEditId(pokemon.id);
    setForm({
      weight: pokemon.weight,
      height: pokemon.height,
      base_experience: pokemon.base_experience,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:3000/pokemons/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    enqueueSnackbar(`Zmieniono atrybuty Pokémona #${editId}`, { variant: "success" });
    setEditId(null);
    const updated = await fetch("http://localhost:3000/pokemons").then((res) => res.json());
    setPokemons(updated);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-extrabold text-white text-center mb-10">Edycja Pokémonów</h2>

      <div className="text-right mb-6">
  <Link to="/create">
    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
      Stwórz Pokemona
    </button>
  </Link>
</div>

      <div className="grid gap-8">
        {pokemons.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 text-zinc-900 dark:text-white"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <img src={p.image} alt={p.name} className="w-16 h-16" />
                <h3 className="text-xl font-semibold capitalize">{p.name}</h3>
              </div>

              {editId !== p.id && (
                <button
                  onClick={() => handleEditClick(p)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Edytuj
                </button>
              )}
            </div>

            {editId === p.id && (
              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Waga</label>
                  <input
                    type="number"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Wzrost</label>
                  <input
                    type="number"
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Doświadczenie</label>
                  <input
                    type="number"
                    name="base_experience"
                    value={form.base_experience}
                    onChange={handleChange}
                    className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
                  />
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                  >
                    Zmień atrybuty
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default Edit;
