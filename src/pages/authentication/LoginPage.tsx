import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useLogin, useUser } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Logo } from "@/components/shared/Logo";

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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-fonfo text-choco dark:bg-fondo-dark dark:text-cream mt-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Logo className="mx-auto" />
          <h1 className="text-3xl font-bold tracking-tight">Iniciar sesión</h1>
          <p className="text-muted-foreground text-sm">
            ¡Qué bueno tenerte de vuelta!
          </p>
        </div>

        {isPending ? (
          <div className="flex justify-center items-center mt-20">
            <Loader size={60} />
          </div>
        ) : (
          <form onSubmit={onLogin} className="space-y-4">
            {/* Correo electrónico */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-cocoa/50 dark:border-cream/30 rounded-md bg-cream dark:bg-cocoa/10 text-sm text-choco dark:text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-cocoa/30"
                />
                <MdOutlineAlternateEmail className="absolute right-3 top-1/2 size-6 transform -translate-y-1/2 text-choco/60 dark:text-cream/60 pointer-events-none" />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-cocoa/50 dark:border-cream/30 rounded-md bg-cream dark:bg-cocoa/10 text-sm text-choco dark:text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-cocoa/30"
                />
                <TbLockPassword className="absolute right-3 top-1/2 size-6 transform -translate-y-1/2 text-choco/60 dark:text-cream/60 pointer-events-none" />
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-oscuro text-sm font-semibold py-3 rounded-md shadow-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
            >
              Iniciar sesión
            </button>
          </form>
        )}

        {/* Enlace a registro */}
        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?
          <Link
            to="/register"
            className="ml-1 underline font-semibold hover:text-cocoa"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;