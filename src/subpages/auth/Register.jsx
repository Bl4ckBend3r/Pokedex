import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const registerSchema = z
  .object({
    name: z.string().min(3, "Imię musi mieć co najmniej 3 znaki"),
    email: z.string().email("Niepoprawny email"),
    password: z
      .string()
      .min(8, "Minimum 8 znaków")
      .regex(/[A-Z]/, "Musi zawierać dużą literę")
      .regex(/[0-9]/, "Musi zawierać cyfrę")
      .regex(/[^a-zA-Z0-9]/, "Musi zawierać znak specjalny"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą się zgadzać",
    path: ["confirmPassword"],
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:3000/users?email=" + data.email);
      const existing = await res.json();

      if (existing.length > 0) {
        enqueueSnackbar("Użytkownik już istnieje!", { variant: "error" });
        return;
      }

      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          favorites: [],
          arena: [],
        }),
      });

      enqueueSnackbar("Rejestracja zakończona sukcesem!", { variant: "success" });
      navigate("/login");
    } catch (error) {
      enqueueSnackbar("Błąd rejestracji", { variant: "error" });
      console.error("Register error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Rejestracja</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Imię</label>
          <input
            type="text"
            {...register("name")}
            className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Hasło</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Powtórz hasło</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Zarejestruj się
        </button>
      </form>
    </div>
  );
};

export default Register;
