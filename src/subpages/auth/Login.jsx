import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; 

const loginSchema = z.object({
  email: z.string().email("Niepoprawny email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `http://localhost:3000/users?email=${data.email}`
      );
      const users = await res.json();

      if (users.length === 0) {
        enqueueSnackbar("Nie znaleziono użytkownika", { variant: "error" });
        return;
      }

      const user = users[0];
      if (user.password !== data.password) {
        enqueueSnackbar("Błędne hasło", { variant: "error" });
        return;
      }

      login(user); 
      enqueueSnackbar("Zalogowano pomyślnie!", { variant: "success" });
      navigate("/");
    } catch (error) {
      enqueueSnackbar("Błąd logowania", { variant: "error" });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Logowanie</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Hasło</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 rounded border dark:bg-zinc-700 dark:border-zinc-600"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Zaloguj się
        </button>
      </form>
    </div>
  );
};

export default Login;
