import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  Phone,
  CreditCard,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { supabase } from "@/supabase/client";
import toast from "react-hot-toast";

interface PaymentMethod {
  id: string;
  type: "pago_movil" | "transferencia";
  bank_name: string;
  account_name: string;
  id_number: string;
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
      id_number: method.id_number,
      phone: method.phone ?? "",
      account_number: method.account_number ?? "",
      is_active: method.is_active,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.bank_name || !form.account_name || !form.id_number) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        bank_name: form.bank_name,
        account_name: form.account_name,
        id_number: form.id_number,
        phone: form.phone || null,
        account_number: form.account_number || null,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-cream">Métodos de pago</h2>
          <p className="text-sm text-muted mt-0.5">
            Datos bancarios que verán los clientes al pagar
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 btn-primary px-4 py-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo método
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="grid gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-24 bg-oscuro rounded-xl animate-pulse" />
          ))}
        </div>
      ) : methods.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-oscuro rounded-xl p-4 border transition-colors ${
                method.is_active
                  ? "border-white/10"
                  : "border-white/5 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-cocoa/20 flex items-center justify-center flex-shrink-0">
                    {method.type === "pago_movil" ? (
                      <Phone className="w-5 h-5 text-cocoa" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-cocoa" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-cream">{method.bank_name}</p>
                    <p className="text-xs text-muted">
                      {method.type === "pago_movil"
                        ? "Pago móvil"
                        : "Transferencia"}{" "}
                      · {method.account_name}
                    </p>
                    <p className="text-xs text-muted font-mono mt-0.5">
                      {method.type === "pago_movil"
                        ? method.phone
                        : method.account_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle activo/inactivo */}
                  <button
                    onClick={() => handleToggle(method)}
                    className="text-muted hover:text-cream transition-colors"
                  >
                    {method.is_active ? (
                      <ToggleRight className="w-6 h-6 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>

                  <button
                    onClick={() => openEdit(method)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-muted" />
                  </button>

                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
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
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-fondo rounded-2xl p-6 max-w-md w-full space-y-4 border border-white/10"
            >
              <h3 className="font-bold text-cream text-lg">
                {editing ? "Editar método" : "Nuevo método de pago"}
              </h3>

              {/* Tipo */}
              <div className="space-y-1.5">
                <label className="text-sm text-muted">Tipo *</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["pago_movil", "transferencia"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, type: t })}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        form.type === t
                          ? "border-cocoa bg-cocoa/10 text-cream"
                          : "border-white/10 text-muted hover:border-white/20"
                      }`}
                    >
                      {t === "pago_movil" ? "Pago móvil" : "Transferencia"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Banco */}
              <div className="space-y-1.5">
                <label className="text-sm text-muted">Banco *</label>
                <input
                  value={form.bank_name}
                  onChange={(e) =>
                    setForm({ ...form, bank_name: e.target.value })
                  }
                  placeholder="Ej: Banco de Venezuela"
                  className={inputClass}
                />
              </div>

              {/* Nombre de la cuenta */}
              <div className="space-y-1.5">
                <label className="text-sm text-muted">
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

              {/* RIF / Cédula */}
              <div className="space-y-1.5">
                <label className="text-sm text-muted">RIF / Cédula *</label>
                <input
                  value={form.id_number}
                  onChange={(e) =>
                    setForm({ ...form, id_number: e.target.value })
                  }
                  placeholder="Ej: J-12345678-9"
                  className={inputClass}
                />
              </div>

              {/* Teléfono — solo pago móvil */}
              {form.type === "pago_movil" && (
                <div className="space-y-1.5">
                  <label className="text-sm text-muted">Teléfono</label>
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

              {/* Número de cuenta — solo transferencia */}
              {form.type === "transferencia" && (
                <div className="space-y-1.5">
                  <label className="text-sm text-muted">Número de cuenta</label>
                  <input
                    value={form.account_number ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, account_number: e.target.value })
                    }
                    placeholder="Ej: 01340123456789012345"
                    className={`${inputClass} font-mono`}
                  />
                </div>
              )}

              {/* Activo */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() =>
                    setForm({ ...form, is_active: !form.is_active })
                  }
                  className={`w-10 h-6 rounded-full transition-colors ${
                    form.is_active ? "bg-green-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                      form.is_active ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </div>
                <span className="text-sm text-cream">Activo</span>
              </label>

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="py-2.5 rounded-xl border border-white/10 text-muted hover:text-cream transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="py-2.5 rounded-xl bg-cocoa text-cream font-medium text-sm hover:bg-cocoa/80 transition-colors disabled:opacity-50"
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

const inputClass = `w-full bg-oscuro border border-white/10 rounded-xl px-4 py-3
  text-cream placeholder:text-muted focus:outline-none focus:border-cocoa
  transition-colors text-sm`;
