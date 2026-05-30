// src/components/dashboard/coupons/CouponTemplatesPanel.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { Pencil, Tag, Gift, Cake, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface CouponTemplate {
  id: string;
  type: "welcome" | "birthday" | "review";
  code_prefix: string;
  discount: number;
  expires_in_days: number;
  min_order: number;
  is_active: boolean;
}

const typeConfig = {
  welcome: { label: "Bienvenida", icon: Gift, color: "text-amber-600" },
  birthday: { label: "Cumpleaños", icon: Cake, color: "text-purple-600" },
  review: { label: "Reseña", icon: Star, color: "text-green-600" },
};

function TemplateCard({
  template,
  onEdit,
}: {
  template: CouponTemplate;
  onEdit: (t: CouponTemplate) => void;
}) {
  const config = typeConfig[template.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="dark:bg-oscuro bg-cream border border-borde border-choco/30 rounded-xl p-5 flex flex-col gap-4 mt-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cocoa/10">
            <Icon size={20} className={config.color} />
          </div>
          <div>
            <p className="font-semibold text-choco dark:text-cream">
              {config.label}
            </p>
            <p className="text-xs text-choco/40 dark:text-cream/40 font-mono tracking-wider">
              {template.code_prefix}XXXXXX
            </p>
          </div>
        </div>
        <StatusBadge status={template.is_active ? "active" : "inactive"} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="border border-borde border-choco/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-choco dark:text-cream">
            {template.discount}%
          </p>
          <p className="text-xs text-choco/50 dark:text-cream/50">Descuento</p>
        </div>
        <div className="border border-borde border-choco/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-choco dark:text-cream">
            {template.expires_in_days}d
          </p>
          <p className="text-xs text-choco/50 dark:text-cream/50">Vigencia</p>
        </div>
        <div className="border border-borde border-choco/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-choco dark:text-cream">
            {template.min_order === 0 ? "—" : `$${template.min_order}`}
          </p>
          <p className="text-xs text-choco/50 dark:text-cream/50">Mín. orden</p>
        </div>
      </div>

      <button
        onClick={() => onEdit(template)}
        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg
          border border-borde text-choco/60 dark:text-cream/60
          hover:text-choco dark:hover:text-cream hover:border-cocoa
          transition-colors text-sm font-medium"
      >
        <Pencil size={14} />
        Editar plantilla
      </button>
    </motion.div>
  );
}

function EditModal({
  template,
  onClose,
}: {
  template: CouponTemplate;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    discount: template.discount,
    expires_in_days: template.expires_in_days,
    min_order: template.min_order,
    code_prefix: template.code_prefix,
    is_active: template.is_active,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("coupon_templates")
        .update({
          discount: form.discount,
          expires_in_days: form.expires_in_days,
          min_order: form.min_order,
          code_prefix: form.code_prefix.toUpperCase(),
          is_active: form.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", template.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupon-templates"] });
      toast.success("Plantilla actualizada");
      onClose();
    },
    onError: () => toast.error("Error al actualizar"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="dark:bg-oscuro bg-cream border border-borde rounded-2xl p-6 w-full max-w-md space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-texto text-lg">
            Editar — {typeConfig[template.type].label}
          </h3>
          <button
            onClick={onClose}
            className="text-texto/50 hover:text-texto transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Prefijo */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-texto/70">
              Prefijo del código
            </label>
            <input
              type="text"
              value={form.code_prefix}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  code_prefix: e.target.value.toUpperCase(),
                }))
              }
              maxLength={12}
              className="w-full px-4 py-2.5 rounded-lg border bg-fondo dark:bg-oscuro border-borde
                text-texto font-mono tracking-widest text-sm
                focus:outline-none focus:ring-2 focus:ring-cocoa/40"
            />
          </div>

          {/* Descuento */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-texto/70">
              Descuento (%)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={form.discount}
              onChange={(e) =>
                setForm((f) => ({ ...f, discount: Number(e.target.value) }))
              }
              className="w-full px-4 py-2.5 rounded-lg border bg-fondo dark:bg-oscuro border-borde
                text-texto text-sm focus:outline-none focus:ring-2 focus:ring-cocoa/40"
            />
          </div>

          {/* Vigencia */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-texto/70">
              Vigencia (días)
            </label>
            <input
              type="number"
              min={1}
              max={365}
              value={form.expires_in_days}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  expires_in_days: Number(e.target.value),
                }))
              }
              className="w-full px-4 py-2.5 rounded-lg border bg-fondo dark:bg-oscuro border-borde
                text-texto text-sm focus:outline-none focus:ring-2 focus:ring-cocoa/40"
            />
          </div>

          {/* Monto mínimo */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-texto/70">
              Monto mínimo ($) — 0 para sin mínimo
            </label>
            <input
              type="number"
              min={0}
              value={form.min_order}
              onChange={(e) =>
                setForm((f) => ({ ...f, min_order: Number(e.target.value) }))
              }
              className="w-full px-4 py-2.5 rounded-lg border bg-fondo dark:bg-oscuro border-borde
                text-texto text-sm focus:outline-none focus:ring-2 focus:ring-cocoa/40"
            />
          </div>

          {/* Activo */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-texto/70">
              Cupón activo
            </span>
            <button
              onClick={() =>
                setForm((f) => ({ ...f, is_active: !f.is_active }))
              }
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.is_active ? "bg-cocoa" : "bg-borde"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
                shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-borde text-texto/70
              hover:text-texto transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg bg-cocoa text-white text-sm
              font-semibold hover:bg-cocoa/90 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function CouponTemplatesPanel() {
  const [editing, setEditing] = useState<CouponTemplate | null>(null);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["coupon-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupon_templates")
        .select("*")
        .order("type");
      if (error) throw error;
      return data as CouponTemplate[];
    },
  });

  return (
    <>
      <DashboardSection
        title="Plantillas de cupones"
        description="Configura los cupones automáticos que se envían a los clientes"
        icon={<Tag size={20} className="text-cocoa" />}
        count={templates.length}
        isLoading={isLoading}
      >
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} onEdit={setEditing} />
        ))}
      </DashboardSection>

      {editing && (
        <EditModal template={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
