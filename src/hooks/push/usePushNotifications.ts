// src/hooks/usePushNotifications.ts

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  getPushPermission,
  isPushSupported,
  isAlreadySubscribed,
  subscribeToPush,
  unsubscribeFromPush,
  syncPushSubscription,
} from "@/actions/push";
import toast from "react-hot-toast";

export type PushStatus =
  | "unsupported"
  | "loading"
  | "default"
  | "subscribed"
  | "unsubscribed"
  | "denied";

export const usePushNotifications = () => {
  const [status, setStatus] = useState<PushStatus>("loading");

  useEffect(() => {
    const check = async () => {
      if (!isPushSupported()) {
        setStatus("unsupported");
        return;
      }

      const permission = getPushPermission();

      if (permission === "denied") {
        setStatus("denied");
        return;
      }

      if (permission === "default") {
        setStatus("default");
        return;
      }

      // permission === "granted"
      const subscribed = await isAlreadySubscribed();

      if (subscribed) {
        // Sincronizar silenciosamente — actualiza Supabase si el endpoint cambió
        syncPushSubscription();
        setStatus("subscribed");
      } else {
        setStatus("unsubscribed");
      }
    };

    check();
  }, []);

  const { mutate: subscribe, isPending: isSubscribing } = useMutation({
    mutationFn: subscribeToPush,
    onSuccess: (ok) => {
      if (ok) {
        setStatus("subscribed");
        toast.success("Notificaciones activadas", { position: "bottom-right" });
      } else {
        toast.error("No se pudo activar las notificaciones", {
          position: "bottom-right",
        });
      }
    },
    onError: () => {
      const permission = getPushPermission();
      if (permission === "denied") setStatus("denied");
      toast.error("Permiso denegado", { position: "bottom-right" });
    },
  });

  const { mutate: unsubscribe, isPending: isUnsubscribing } = useMutation({
    mutationFn: unsubscribeFromPush,
    onSuccess: () => {
      setStatus("unsubscribed");
      toast.success("Notificaciones desactivadas", {
        position: "bottom-right",
      });
    },
  });

  const toggle = () => {
    if (status === "subscribed") {
      unsubscribe();
    } else {
      subscribe();
    }
  };

  return {
    status,
    isLoading: isSubscribing || isUnsubscribing,
    isSupported: status !== "unsupported",
    isSubscribed: status === "subscribed",
    isDenied: status === "denied",
    toggle,
    subscribe,
    unsubscribe,
  };
};

// // src/hooks/usePushNotifications.ts

// import { useState, useEffect } from "react";
// import { useMutation } from "@tanstack/react-query";
// import {
//   getPushPermission,
//   isPushSupported,
//   isAlreadySubscribed,
//   subscribeToPush,
//   unsubscribeFromPush,
// } from "@/actions/push";
// import toast from "react-hot-toast";

// export type PushStatus =
//   | "unsupported" // el navegador no soporta push
//   | "loading" // verificando estado inicial
//   | "default" // nunca se pidió permiso
//   | "subscribed" // activo
//   | "unsubscribed" // tiene permiso pero no está suscrito
//   | "denied"; // el usuario bloqueó las notificaciones

// export const usePushNotifications = () => {
//   const [status, setStatus] = useState<PushStatus>("loading");

//   // Verificar estado inicial
//   useEffect(() => {
//     const check = async () => {
//       if (!isPushSupported()) {
//         setStatus("unsupported");
//         return;
//       }

//       const permission = getPushPermission();

//       if (permission === "denied") {
//         setStatus("denied");
//         return;
//       }

//       if (permission === "default") {
//         setStatus("default");
//         return;
//       }

//       // permission === "granted" — verificar si realmente está suscrito
//       const subscribed = await isAlreadySubscribed();
//       setStatus(subscribed ? "subscribed" : "unsubscribed");
//     };

//     check();
//   }, []);

//   // Mutación para suscribir
//   const { mutate: subscribe, isPending: isSubscribing } = useMutation({
//     mutationFn: subscribeToPush,
//     onSuccess: (ok) => {
//       if (ok) {
//         setStatus("subscribed");
//         toast.success("Notificaciones activadas", { position: "bottom-right" });
//       } else {
//         toast.error("No se pudo activar las notificaciones", {
//           position: "bottom-right",
//         });
//       }
//     },
//     onError: () => {
//       const permission = getPushPermission();
//       if (permission === "denied") setStatus("denied");
//       toast.error("Permiso denegado", { position: "bottom-right" });
//     },
//   });

//   // Mutación para desuscribir
//   const { mutate: unsubscribe, isPending: isUnsubscribing } = useMutation({
//     mutationFn: unsubscribeFromPush,
//     onSuccess: () => {
//       setStatus("unsubscribed");
//       toast.success("Notificaciones desactivadas", {
//         position: "bottom-right",
//       });
//     },
//   });

//   const toggle = () => {
//     if (status === "subscribed") {
//       unsubscribe();
//     } else {
//       subscribe();
//     }
//   };

//   return {
//     status,
//     isLoading: isSubscribing || isUnsubscribing,
//     isSupported: status !== "unsupported",
//     isSubscribed: status === "subscribed",
//     isDenied: status === "denied",
//     toggle,
//     subscribe,
//     unsubscribe,
//   };
// };
