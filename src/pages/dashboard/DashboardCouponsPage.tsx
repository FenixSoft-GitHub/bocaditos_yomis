// src/pages/dashboard/CouponsPage.tsx
import { CouponTemplatesPanel } from "@/components/dashboard/coupons/CouponTemplatesPanel";
import { AutoCouponsTable } from "@/components/dashboard/coupons/AutoCouponsTable";

export default function CouponsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-texto">Cupones automáticos</h1>
        <p className="text-texto/50 text-sm mt-1">
          Gestiona las plantillas y revisa los cupones enviados a tus clientes
        </p>
      </div>

      <CouponTemplatesPanel />
      <AutoCouponsTable />
    </div>
  );
}
