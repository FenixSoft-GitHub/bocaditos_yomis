import { useState } from "react";
// import { LuLoaderCircle } from "react-icons/lu";
import { Link, Navigate } from "react-router-dom";
import { useLogin, useUser } from "@/hooks";
import { Loader } from "@/components/shared/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useLogin();
  const { session, isLoading } = useUser();

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({ email, password });
  };
  
  if (isLoading) return <Loader size={60} />;

  if (session) return <Navigate to="/" />;
  

  return (
    <div className="w-full h-screen flex flex-col items-center gap-5 pt-42 bg-cream/40 dark:bg-fondo-dark">
      <h1 className="text-4xl font-bold capitalize">Iniciar sesión</h1>

      <p className="text-sm font-medium">¡Que bueno tenerte de vuelta!</p>

      {isPending ? (
        <div className="w-full h-full flex justify-center">
          <Loader size={60} />
          {/* <LuLoaderCircle className="animate-spin" size={60} /> */}
        </div>
      ) : (
        <>
          <form
            className="flex flex-col items-center gap-8 w-full mt-10 sm:w-[400px] lg:w-[500px]"
            onSubmit={onLogin}
          >
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="border border-slate-300 text-gray-900 dark:text-gray-100 px-5 py-4 placeholder:text-black dark:placeholder:text-gray-300 text-sm rounded-full w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              className="border border-slate-300 text-gray-900 dark:text-gray-100 px-5 py-4 placeholder:text-black dark:placeholder:text-gray-300 text-sm rounded-full w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full mt-5 w-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 outline-2 outline-offset-2 outline-gray-600 cursor-pointer">
              Iniciar sesión
            </button>
          </form>

          <p className="text-sm text-stone-800 dark:text-gray-300">
            ¿No tienes una cuenta?
            <Link to="/register" className="underline ml-2">
              Regístrate
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default LoginPage;
