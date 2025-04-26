import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const CreatePokemon = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    weight: "",
    height: "",
    base_experience: "",
  });
  const [index, setIndex] = useState(151);
  const [usedImages, setUsedImages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/pokemons")
      .then((res) => res.json())
      .then((data) => {
        const used = data.map((p) => p.image);
        setUsedImages(used);
      });
  }, []);

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usedImages.includes(imageUrl)) {
      enqueueSnackbar("Grafika już użyta!", { variant: "error" });
      return;
    }

    const newPokemon = {
      ...form,
      weight: parseInt(form.weight),
      height: parseInt(form.height),
      base_experience: parseInt(form.base_experience),
      image: imageUrl,
      wins: 0,
      losses: 0,
    };

    await fetch("http://localhost:3000/pokemons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPokemon),
    });

    enqueueSnackbar(`Nowy pokemon ${form.name} został dodany`, {
      variant: "success",
    });
    navigate("/");
  };

  const nextImage = () => setIndex((prev) => prev + 1);
  const prevImage = () => setIndex((prev) => Math.max(151, prev - 1));

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-6">
        Stwórz Pokemona
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg text-zinc-900 dark:text-white"
      >
        <div className="mb-4">
          <label className="block mb-1">Nazwa</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Waga</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Wzrost</label>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Doświadczenie</label>
            <input
              type="number"
              name="base_experience"
              value={form.base_experience}
              onChange={handleChange}
              className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" onClick={prevImage}>&larr;</button>
          <img
            src={imageUrl}
            alt="Pokemon preview"
            className={`w-32 h-32 ${usedImages.includes(imageUrl) ? "opacity-30" : ""}`}
          />
          <button type="button" onClick={nextImage}>&rarr;</button>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Stwórz
        </button>
      </form>
    </div>
  );
};

export default CreatePokemon;
