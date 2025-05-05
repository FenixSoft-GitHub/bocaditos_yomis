import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
// import { z } from 'zod';
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
    <div className="w-full h-screen flex flex-col items-center pt-32 gap-5 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold capitalize">Regístrate</h1>

      <p className="text-sm font-medium">
        Por favor, rellene los siguientes campos:
      </p>

      {isPending ? (
        <div className="w-full h-full flex justify-center mt-20">
          <Loader size={60} />
          {/* <LuLoaderCircle className='animate-spin' size={60} /> */}
        </div>
      ) : (
        <>
          <form
            className="flex flex-col items-center gap-2 w-full mt-8 sm:w-[400px] lg:w-[500px]"
            onSubmit={onRegister}
          >
            <input
              type="text"
              placeholder="Nombre Completo"
              className="border border-slate-300 text-gray-900 dark:text-gray-100 px-5 py-4 placeholder:text-black dark:placeholder:text-gray-300 text-sm rounded-full w-full"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-red-500">{errors.fullName.message}</p>
            )}

            <input
              type="text"
              placeholder="Celular"
              className="border border-slate-300 text-gray-900 dark:text-gray-100 px-5 py-4 placeholder:text-black dark:placeholder:text-gray-300 text-sm rounded-full w-full"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}

            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="border border-slate-300 text-gray-900 dark:text-gray-100 px-5 py-4 placeholder:text-black dark:placeholder:text-gray-300 text-sm rounded-full w-full"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              className="border border-slate-300 text-gray-900 dark:text-gray-100 px-5 py-4 placeholder:text-black dark:placeholder:text-gray-300 text-sm rounded-full w-full"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}

            <button className="bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full mt-5 w-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 outline-2 outline-offset-2 outline-gray-600">
              Registrarme
            </button>
          </form>

          <p className="text-sm text-stone-800 dark:text-gray-200">
            ¿Ya tienes una cuenta?
            <Link to="/login" className="underline ml-2 dark:text-gray-200">
              Inicia sesión
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default RegisterPage;
