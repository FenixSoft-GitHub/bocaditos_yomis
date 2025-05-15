import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { useRegister, useUser } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { UserRegisterFormValues, userRegisterSchema } from "@/lib/validators";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
    },
    resolver: zodResolver(userRegisterSchema),
  });

  const { mutate, isPending } = useRegister();
  const { session, isLoading } = useUser();

  const onRegister = handleSubmit((data) => {
    const { email, password, fullName, phone } = data;
    mutate({ email, password, fullName, phone });
  });

  if (isLoading) return <Loader size={60} />;

  if (session) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-fonfo text-choco dark:bg-fondo-dark dark:text-cream mt-14">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Regístrate</h1>
          <p className="text-muted-foreground text-sm">
            Crea tu cuenta para comenzar
          </p>
        </div>

        {isPending ? (
          <div className="flex justify-center mt-20">
            <Loader size={60} />
          </div>
        ) : (
          <form onSubmit={onRegister} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-1">
              <label htmlFor="fullName" className="text-sm font-medium">
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                {...register("fullName")}
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 border border-cocoa/50 dark:border-cream/30 rounded-md bg-cream dark:bg-cocoa/10 text-sm text-choco dark:text-cream placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cocoa/30"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs">{errors.fullName.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium">
                Celular
              </label>
              <input
                id="phone"
                type="text"
                {...register("phone")}
                placeholder="0414-1234567"
                className="w-full px-4 py-3 border border-cocoa/50 dark:border-cream/30 rounded-md bg-cream dark:bg-cocoa/10 text-sm text-choco dark:text-cream placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cocoa/30"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}
            </div>

            {/* Correo */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-3 border border-cocoa/50 dark:border-cream/30 rounded-md bg-cream dark:bg-cocoa/10 text-sm text-choco dark:text-cream placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cocoa/30"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-cocoa/50 dark:border-cream/30 rounded-md bg-cream dark:bg-cocoa/10 text-sm text-choco dark:text-cream placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cocoa/30"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-oscuro text-sm font-semibold py-3 rounded-md shadow-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
            >
              Registrarme
            </button>
          </form>
        )}

        {/* Link de inicio de sesión */}
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?
          <Link to="/login" className="ml-1 underline font-semibold hover:text-cocoa">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;