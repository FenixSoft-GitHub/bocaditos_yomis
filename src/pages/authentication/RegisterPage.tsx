import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useRegister, useUser } from "@/hooks";
import { Loader } from "@/components/shared/Loader";
import { UserRegisterFormValues, userRegisterSchema } from "@/lib/validators";
import { User, Phone, Mail, Eye, EyeOff, Gift } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";

const inputClass = `w-full pl-4 pr-11 py-2.5 rounded-lg border text-sm transition-all duration-200
  bg-fondo dark:bg-fondo-dark text-choco dark:text-cream
  placeholder:text-choco/40 dark:placeholder:text-cream/40
  border-cocoa/30 dark:border-cream/20
  focus:outline-none focus:ring-2 focus:ring-choco/20 dark:focus:ring-cream/20
  focus:border-choco dark:focus:border-cream/60`;

const RegisterPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [refCodeValid, setRefCodeValid] = useState<boolean | null>(null);
  const [refCodeChecking, setRefCodeChecking] = useState(false);

  // Leer ?ref=CODIGO de la URL automáticamente
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormValues>({
    defaultValues: { fullName: "", email: "", password: "", phone: "" },
    resolver: zodResolver(userRegisterSchema),
  });

  const { mutate, isPending } = useRegister();
  const { session, isLoading } = useUser();

  // Auto-rellenar código si viene en la URL
  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setRefCode(refFromUrl.toUpperCase());
    }
  }, [searchParams]);

  // Validar código cuando el usuario termina de escribir
  useEffect(() => {
    if (!refCode.trim()) {
      setRefCodeValid(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setRefCodeChecking(true);
      try {
        const { data } = await supabase
          .from("users")
          .select("id")
          .eq("ref_code", refCode.trim().toUpperCase())
          .single();

        setRefCodeValid(!!data);
      } catch {
        setRefCodeValid(false);
      } finally {
        setRefCodeChecking(false);
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [refCode]);

  const onRegister = handleSubmit(({ email, password, fullName, phone }) => {
    mutate({
      email,
      password,
      fullName,
      phone,
      refCode: refCodeValid ? refCode.trim().toUpperCase() : undefined,
    });
  });

  if (isLoading) return <Loader size={50} />;
  if (session) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen -mt-8 flex flex-col justify-center items-center px-4 py-10 bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Crear cuenta</h1>
          <p className="text-sm text-choco/60 dark:text-cream/60">
            Únete y empieza a disfrutar nuestros bocaditos 🍞
          </p>
        </div>

        {isPending ? (
          <Loader size={50} fullScreen={false} />
        ) : (
          <form onSubmit={onRegister} className="space-y-2" noValidate>
            {/* Nombre */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Nombre completo
              </label>
              <div className="relative mt-1">
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Juan Pérez"
                  className={inputClass}
                  {...register("fullName")}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-choco/40 dark:text-cream/40 pointer-events-none" />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-500 pl-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Celular
              </label>
              <div className="relative mt-1">
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0414-1234567"
                  className={inputClass}
                  {...register("phone")}
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-choco/40 dark:text-cream/40 pointer-events-none" />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 pl-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <div className="relative mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ejemplo@correo.com"
                  className={inputClass}
                  {...register("email")}
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-choco/40 dark:text-cream/40 pointer-events-none" />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 pl-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  className={inputClass}
                  {...register("password")}
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
              {errors.password && (
                <p className="text-xs text-red-500 pl-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Código de referido — opcional */}
            <div className="space-y-2">
              <label
                htmlFor="refCode"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Gift size={14} className="text-cocoa" />
                Código de referido
                <span className="text-choco/40 dark:text-cream/40 font-normal">
                  (opcional)
                </span>
              </label>
              <div className="relative mt-1">
                <input
                  id="refCode"
                  type="text"
                  placeholder="Ej: JUAN1A2B"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                  maxLength={12}
                  className={`${inputClass} ${
                    refCodeValid === true
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                      : refCodeValid === false
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : ""
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {refCodeChecking ? (
                    <div
                      className="size-4 border-2 border-cocoa/40
                      border-t-cocoa rounded-full animate-spin"
                    />
                  ) : refCodeValid === true ? (
                    <span className="text-green-500 text-lg">✓</span>
                  ) : refCodeValid === false ? (
                    <span className="text-red-400 text-lg">✗</span>
                  ) : (
                    <Gift className="size-4 text-choco/40 dark:text-cream/40" />
                  )}
                </div>
              </div>

              {/* Feedback del código */}
              {refCodeValid === true && (
                <p className="text-xs text-green-600 dark:text-green-400 pl-1 flex items-center gap-1">
                  ✓ Código válido — ambos recibirán 5% de descuento
                </p>
              )}
              {refCodeValid === false && refCode.length > 0 && (
                <p className="text-xs text-red-500 pl-1">
                  Código no encontrado
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 mt-3 rounded-lg font-semibold text-sm
                bg-choco text-cream hover:bg-cocoa
                dark:bg-cream dark:text-oscuro dark:hover:bg-butter
                transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              Crear cuenta
            </button>
          </form>
        )}

        <p className="text-center text-sm text-choco/60 dark:text-cream/60">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-choco dark:text-cream underline underline-offset-4 hover:text-cocoa transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;