// src/pages/account/ReferralPage.tsx
import { ReferralCard } from "@/components/account/ReferralCard";

export default function ReferralPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-choco dark:text-cream">
          Programa de referidos
        </h1>
        <p className="text-sm text-choco/50 dark:text-cream/50 mt-1">
          Invita amigos y gana descuentos juntos
        </p>
      </div>
      <ReferralCard />
    </div>
  );
}
