import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1, "Wymagane"),
  weight: z.number().min(1, "Wymagane"),
  height: z.number().min(1, "Wymagane"),
  base_experience: z.number().min(0),
  ability: z.string().min(1, "Wymagane"),
});

const CreatePokemon = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [index, setIndex] = useState(151);
  const [usedImages, setUsedImages] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      weight: 0,
      height: 0,
      base_experience: 0,
      ability: "",
    },
  });

  useEffect(() => {
    fetch("http://localhost:3000/pokemons")
      .then((res) => res.json())
      .then((data) => {
        const used = data.map((p) => p.image);
        setUsedImages(used);
      });
  }, []);

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
  const isImageUsed = usedImages.includes(imageUrl);

  const onSubmit = async (data) => {
    if (isImageUsed) {
      enqueueSnackbar("Grafika już użyta!", { variant: "error" });
      return;
    }

    const newPokemon = {
      ...data,
      image: imageUrl,
      wins: 0,
      losses: 0,
    };

    await fetch("http://localhost:3000/pokemons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPokemon),
    });

    enqueueSnackbar(`Nowy pokemon ${data.name} został dodany`, {
      variant: "success",
    });
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-6">Stwórz Pokemona</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg text-zinc-900 dark:text-white space-y-4"
      >
        <div>
          <label className="block mb-1">Nazwa</label>
          <input {...register("name")} className="w-full p-2 rounded border" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Waga</label>
            <input type="number" {...register("weight", { valueAsNumber: true })} className="w-full p-2 rounded border" />
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Wzrost</label>
            <input type="number" {...register("height", { valueAsNumber: true })} className="w-full p-2 rounded border" />
            {errors.height && <p className="text-red-500 text-sm">{errors.height.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Doświadczenie</label>
            <input type="number" {...register("base_experience", { valueAsNumber: true })} className="w-full p-2 rounded border" />
            {errors.base_experience && <p className="text-red-500 text-sm">{errors.base_experience.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Zdolność</label>
            <input {...register("ability")} className="w-full p-2 rounded border" />
            {errors.ability && <p className="text-red-500 text-sm">{errors.ability.message}</p>}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" onClick={() => setIndex((prev) => Math.max(151, prev - 1))}>&larr;</button>
          <img src={imageUrl} alt="Preview" className={`w-32 h-32 ${isImageUsed ? "opacity-30" : ""}`} />
          <button type="button" onClick={() => setIndex((prev) => prev + 1)}>&rarr;</button>
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
