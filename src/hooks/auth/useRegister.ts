import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "@/actions";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "@/supabase/client";
import type { UserRegisterFormValues } from "@/lib/validators";

export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: async (data, variables: UserRegisterFormValues) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Registrar referido si viene un refCode en las variables
      const userId = data?.user?.id;
      const refCode = variables?.refCode;

      if (userId && refCode) {
        try {
          await supabase.rpc("register_referral", {
            p_referred_id: userId,
            p_ref_code: refCode.trim().toUpperCase(),
          });
        } catch (err) {
          console.error("[useRegister] register_referral error:", err);
        }
      }

      navigate("/");
    },
    onError: (err) => {
      toast.error(`Aqui ${err.message}`, {
        position: "bottom-right",
      });
    },
  });

  return { mutate, isPending };
};