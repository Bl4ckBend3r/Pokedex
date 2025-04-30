import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { fetchFullCollection } from "@/utils/fetchFullCollection";

const schema = z.object({
  weight: z.number().min(1, "Wymagana liczba większa od zera"),
  height: z.number().min(1, "Wymagana liczba większa od zera"),
  base_experience: z.number().min(0, "Wymagane"),
});

const Edit = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      weight: 0,
      height: 0,
      base_experience: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const fullList = await fetchFullCollection();
      setPokemons(fullList);
    };

    fetchData();
  }, []);

  const handleEditClick = (pokemon) => {
    setEditId(pokemon.id);
    reset({
      weight: pokemon.weight,
      height: pokemon.height,
      base_experience: pokemon.base_experience,
    });
  };

  const onSubmit = async (data) => {
    await fetch(`http://localhost:3000/pokemons/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    enqueueSnackbar(`Zmieniono atrybuty ${pokemons.find(p => p.id === editId)?.name}`, {
      variant: "success",
    });

    setEditId(null);
    navigate("/");

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
        {pokemons.map((p, i) => (
          <div
            key={p.id}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 text-zinc-900 dark:text-white"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <img src={p.image} alt={p.name} className="w-16 h-16" />
                <h3 className="text-xl font-semibold capitalize">{i + 1}. {p.name}</h3>
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
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Waga</label>
                  <input
                    type="number"
                    {...register("weight", { valueAsNumber: true })}
                    className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
                  />
                  {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Wzrost</label>
                  <input
                    type="number"
                    {...register("height", { valueAsNumber: true })}
                    className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
                  />
                  {errors.height && <p className="text-red-500 text-sm">{errors.height.message}</p>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Doświadczenie</label>
                  <input
                    type="number"
                    {...register("base_experience", { valueAsNumber: true })}
                    className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
                  />
                  {errors.base_experience && (
                    <p className="text-red-500 text-sm">{errors.base_experience.message}</p>
                  )}
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
