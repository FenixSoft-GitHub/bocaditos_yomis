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



// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Link, Navigate } from "react-router-dom";
// import { useRegister, useUser } from "@/hooks";
// import { Loader } from "@/components/shared/Loader";
// import { UserRegisterFormValues, userRegisterSchema } from "@/lib/validators";

// const RegisterPage = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<UserRegisterFormValues>({
//     defaultValues: {
//       fullName: "",
//       email: "",
//       password: "",
//       phone: "",
//     },
//     resolver: zodResolver(userRegisterSchema),
//   });

//   const { mutate, isPending } = useRegister();
//   const { session, isLoading } = useUser();

//   const onRegister = handleSubmit((data) => {
//     const { email, password, fullName, phone } = data;

//     mutate({ email, password, fullName, phone });
//   });

//   if (isLoading) return <Loader size={60} />;

//   if (session) return <Navigate to="/" />;

//   return (
//     <div className="w-full h-screen flex flex-col items-center pt-32 gap-5 dark:bg-gray-900 dark:text-gray-100">
//       <h1 className="text-4xl font-bold capitalize">Regístrate</h1>

//       <p className="text-sm font-medium">
//         Por favor, rellene los siguientes campos:
//       </p>

//       {isPending ? (
//         <div className="w-full h-full flex justify-center mt-20">
//           <Loader size={60} />
//         </div>
//       ) : (
//         <>
//           <form
//             className="flex flex-col items-center gap-2 w-full mt-8 sm:w-[400px] lg:w-[500px]"
//             onSubmit={onRegister}
//           >
//             <input
//               type="text"
//               placeholder="Nombre Completo"
//               className="border border-slate-300 text-gray-900 dark:text-gray-100 px-5 py-4 placeholder:text-black dark:placeholder:text-gray-300 text-sm rounded-full w-full"
//               {...register("fullName")}
//             />
//             {errors.fullName && (
//               <p className="text-red-500">{errors.fullName.message}</p>
//             )}

//             <input
//               type="text"
//               placeholder="Celular"
//               className="border border-slate-300 text-gray-900 dark:text-gray-100 px-5 py-4 placeholder:text-black dark:placeholder:text-gray-300 text-sm rounded-full w-full"
//               {...register("phone")}
//             />
//             {errors.phone && (
//               <p className="text-red-500">{errors.phone.message}</p>
//             )}

//             <input
//               type="email"
//               placeholder="Ingresa tu correo electrónico"
//               className="border border-slate-300 text-gray-900 dark:text-gray-100 px-5 py-4 placeholder:text-black dark:placeholder:text-gray-300 text-sm rounded-full w-full"
//               {...register("email")}
//             />
//             {errors.email && (
//               <p className="text-red-500">{errors.email.message}</p>
//             )}

//             <input
//               type="password"
//               placeholder="Ingresa tu contraseña"
//               className="border border-slate-300 text-gray-900 dark:text-gray-100 px-5 py-4 placeholder:text-black dark:placeholder:text-gray-300 text-sm rounded-full w-full"
//               {...register("password")}
//             />
//             {errors.password && (
//               <p className="text-red-500">{errors.password.message}</p>
//             )}

//             <button className="bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full mt-5 w-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 outline-2 outline-offset-2 outline-gray-600">
//               Registrarme
//             </button>
//           </form>

//           <p className="text-sm text-stone-800 dark:text-gray-200">
//             ¿Ya tienes una cuenta?
//             <Link to="/login" className="underline ml-2 dark:text-gray-200">
//               Inicia sesión
//             </Link>
//           </p>
//         </>
//       )}
//     </div>
//   );
// };

// export default RegisterPage;
