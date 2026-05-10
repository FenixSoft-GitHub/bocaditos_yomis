import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useLogin, useUser } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { Mail, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const inputClass = `w-full pl-4 pr-11 py-3 rounded-lg border text-sm transition-all duration-200
  bg-fondo dark:bg-fondo-dark text-choco dark:text-cream
  placeholder:text-choco/40 dark:placeholder:text-cream/40
  border-cocoa/30 dark:border-cream/20
  focus:outline-none focus:ring-2 focus:ring-choco/20 dark:focus:ring-cream/20
  focus:border-choco dark:focus:border-cream/60`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const { mutate, isPending } = useLogin();
  const { session, isLoading } = useUser();

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  if (isLoading) return <Loader size={50} />;
  if (session) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Iniciar sesión</h1>
          <p className="text-sm text-choco/60 dark:text-cream/60">
            ¡Qué bueno tenerte de vuelta!
          </p>
        </div>

        {isPending ? (
          <Loader size={50} fullScreen={false} />
        ) : (
          <form onSubmit={onLogin} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-choco/40 dark:text-cream/40 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-choco/40 dark:text-cream/40 hover:text-choco dark:hover:text-cream transition-colors"
                  aria-label={
                    showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPass ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-lg font-semibold text-sm bg-choco text-cream hover:bg-cocoa dark:bg-cream dark:text-oscuro dark:hover:bg-butter transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              Iniciar sesión
            </button>
          </form>
        )}

        <p className="text-center text-sm text-choco/60 dark:text-cream/60">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-choco dark:text-cream underline underline-offset-4 hover:text-cocoa transition-colors"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
