// src/components/dashboard/payments/PaymentMethodsPanel.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  Phone,
  CreditCard,
  Wallet,
} from "lucide-react";
import { supabase } from "@/supabase/client";
import toast from "react-hot-toast";

interface PaymentMethod {
  id: string;
  type: "pago_movil" | "transferencia" | "usdt";
  bank_name: string;
  account_name: string;
  id_number: string | null;
  phone: string | null;
  account_number: string | null;
  is_active: boolean;
}

const emptyForm: Omit<PaymentMethod, "id"> = {
  type: "pago_movil",
  bank_name: "",
  account_name: "",
  id_number: "",
  phone: "",
  account_number: "",
  is_active: true,
};

const PAYMENT_TYPES = [
  { value: "pago_movil", label: "Pago móvil", icon: Phone },
  { value: "transferencia", label: "Transferencia", icon: CreditCard },
  { value: "usdt", label: "USDT (TRC20)", icon: Wallet },
] as const;

export function PaymentMethodsPanel() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMethods();
  }, []);

  async function fetchMethods() {
    setLoading(true);
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .order("created_at", { ascending: true });
    setMethods((data as PaymentMethod[]) ?? []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(method: PaymentMethod) {
    setEditing(method);
    setForm({
      type: method.type,
      bank_name: method.bank_name,
      account_name: method.account_name,
      id_number: method.id_number ?? "",
      phone: method.phone ?? "",
      account_number: method.account_number ?? "",
      is_active: method.is_active,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.bank_name || !form.account_name) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        bank_name: form.bank_name,
        account_name: form.account_name,
        id_number: form.id_number ?? "",
        phone: form.phone || undefined,
        account_number: form.account_number || undefined,
        is_active: form.is_active,
      };

      if (editing) {
        const { error } = await supabase
          .from("payment_methods")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("Método actualizado");
      } else {
        const { error } = await supabase
          .from("payment_methods")
          .insert(payload);
        if (error) throw error;
        toast.success("Método creado");
      }

      setShowForm(false);
      await fetchMethods();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(method: PaymentMethod) {
    const { error } = await supabase
      .from("payment_methods")
      .update({ is_active: !method.is_active })
      .eq("id", method.id);
    if (error) {
      toast.error("Error al actualizar");
      return;
    }
    await fetchMethods();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este método de pago?")) return;
    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Error al eliminar");
      return;
    }
    toast.success("Método eliminado");
    await fetchMethods();
  }

  const getTypeIcon = (type: string) => {
    if (type === "pago_movil") return <Phone className="size-5 text-cocoa" />;
    if (type === "usdt") return <Wallet className="size-5 text-yellow-500" />;
    return <CreditCard className="size-5 text-cocoa" />;
  };

  const getTypeLabel = (type: string) => {
    if (type === "pago_movil") return "Pago móvil";
    if (type === "usdt") return "USDT · TRC20";
    return "Transferencia";
  };

  const getAccountDisplay = (method: PaymentMethod) => {
    if (method.type === "pago_movil") return method.phone;
    if (method.type === "usdt") return method.account_number;
    return method.account_number;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-choco dark:text-cream">
            Métodos de pago
          </h2>
          <p className="text-sm text-choco/50 dark:text-cream/50 mt-0.5">
            Datos que verán los clientes al pagar
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 btn-primary px-4 py-2 text-sm rounded-xl"
        >
          <Plus className="size-4" />
          Nuevo método
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="grid gap-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-cocoa/5 dark:bg-cream/5 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : methods.length === 0 ? (
        <div className="text-center py-16 text-choco/40 dark:text-cream/40">
          <Building2 className="size-12 mx-auto mb-3 opacity-30" />
          <p>No hay métodos de pago configurados</p>
          <button
            onClick={openCreate}
            className="mt-4 text-sm text-cocoa hover:underline"
          >
            Agregar el primero
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {methods.map((method) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 border transition-colors bg-cream dark:bg-oscuro ${
                method.is_active
                  ? "border-cocoa/20 dark:border-cream/10"
                  : "border-cocoa/10 dark:border-cream/5 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-xl bg-cocoa/10 dark:bg-cream/10 flex items-center justify-center shrink-0">
                    {getTypeIcon(method.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-choco dark:text-cream">
                        {method.bank_name}
                      </p>
                      {method.type === "usdt" && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-600 dark:text-yellow-400">
                          USDT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-choco/50 dark:text-cream/50">
                      {getTypeLabel(method.type)} · {method.account_name}
                    </p>
                    <p className="text-xs text-choco/40 dark:text-cream/40 font-mono mt-0.5">
                      {getAccountDisplay(method)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Toggle activo/inactivo */}
                  <button
                    onClick={() => handleToggle(method)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      method.is_active
                        ? "bg-green-500"
                        : "bg-cocoa/20 dark:bg-cream/20"
                    }`}
                    aria-label={method.is_active ? "Desactivar" : "Activar"}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                        method.is_active ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => openEdit(method)}
                    className="p-2 bg-cocoa/5 dark:bg-cream/5 hover:bg-cocoa/10 dark:hover:bg-cream/10 rounded-lg transition-colors"
                  >
                    <Pencil className="size-4 text-choco/60 dark:text-cream/60" />
                  </button>

                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="size-4 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal formulario */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1410] rounded-2xl p-5 max-w-md w-full space-y-5 border border-cocoa/30 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-cream text-lg">
                  {editing ? "Editar método" : "Nuevo método de pago"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg text-cream/40 hover:text-cream hover:bg-cream/10 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/50">
                  Tipo *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setForm({ ...form, type: value })}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        form.type === value
                          ? "border-cocoa bg-cocoa text-cream shadow-sm"
                          : "border-cream/10 text-cream/50 hover:border-cream/30 hover:text-cream/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Banco / Red */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/50">
                  {form.type === "usdt" ? "Red / Exchange *" : "Banco *"}
                </label>
                <input
                  value={form.bank_name}
                  onChange={(e) =>
                    setForm({ ...form, bank_name: e.target.value })
                  }
                  placeholder={
                    form.type === "usdt"
                      ? "Ej: Binance / TRC20"
                      : "Ej: Banco de Venezuela"
                  }
                  className={inputClass}
                />
              </div>

              {/* Nombre cuenta */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/50">
                  Nombre de la cuenta *
                </label>
                <input
                  value={form.account_name}
                  onChange={(e) =>
                    setForm({ ...form, account_name: e.target.value })
                  }
                  placeholder="Ej: Bocaditos Yomi's"
                  className={inputClass}
                />
              </div>

              {/* RIF — no aplica para USDT */}
              {form.type !== "usdt" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-cream/50">
                    RIF / Cédula
                  </label>
                  <input
                    value={form.id_number ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, id_number: e.target.value })
                    }
                    placeholder="Ej: J-12345678-9"
                    className={inputClass}
                  />
                </div>
              )}

              {/* Teléfono — solo pago móvil */}
              {form.type === "pago_movil" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-cream/50">
                    Teléfono
                  </label>
                  <input
                    value={form.phone ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="Ej: 0414-1234567"
                    className={inputClass}
                  />
                </div>
              )}

              {/* Número de cuenta / Wallet */}
              {(form.type === "transferencia" || form.type === "usdt") && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-cream/50">
                    {form.type === "usdt"
                      ? "Dirección de wallet *"
                      : "Número de cuenta"}
                  </label>
                  <input
                    value={form.account_number ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, account_number: e.target.value })
                    }
                    placeholder={
                      form.type === "usdt"
                        ? "TRC20..."
                        : "Ej: 01340123456789012345"
                    }
                    className={`${inputClass} font-mono`}
                  />
                </div>
              )}

              {/* Toggle activo */}
              <div className="flex items-center gap-3 py-1">
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, is_active: !form.is_active })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                    form.is_active ? "bg-green-500" : "bg-cream/15"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                      form.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-cream/80">Activo</span>
              </div>

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-cream/10">
                <button
                  onClick={() => setShowForm(false)}
                  className="mt-3 py-2.5 rounded-xl border border-cream/15 text-cream/60 hover:text-cream hover:border-cream/30 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-3 py-2.5 rounded-xl bg-cocoa text-cream font-semibold text-sm hover:bg-cocoa/80 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {saving ? "Guardando..." : editing ? "Actualizar" : "Crear"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass = `w-full bg-cream/5 border border-cream/10 rounded-xl px-4 py-3
  text-cream placeholder:text-cream/30 focus:outline-none focus:border-cocoa/60
  transition-colors text-sm`;
