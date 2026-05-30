// src/pages/account/UserCouponsPage.tsx
import { useState } from 'react'
import { useUserCoupons, type UserCoupon, type CouponStatus } from '@/hooks/autocoupon/useUserCoupons'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Copy, CheckCheck, Gift, Cake, Star, Clock, PackageCheck, Ban } from 'lucide-react'
import { toast } from 'react-hot-toast'

// ─── Helpers ────────────────────────────────────────────────

const typeConfig = {
  welcome:  { label: 'Bienvenida',  icon: Gift, color: 'text-amber-500'  },
  birthday: { label: 'Cumpleaños',  icon: Cake, color: 'text-purple-500' },
  review:   { label: 'Reseña',      icon: Star, color: 'text-green-500'  },
}

const statusConfig: Record<CouponStatus, {
  label: string
  className: string
  icon: React.ElementType
}> = {
  active:  {
    label: 'Disponible',
    className: 'bg-green-500/10 text-green-400 border border-green-500/30',
    icon: Tag,
  },
  used:    {
    label: 'Usado',
    className: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    icon: PackageCheck,
  },
  expired: {
    label: 'Expirado',
    className: 'bg-red-500/10 text-red-400 border border-red-500/30',
    icon: Ban,
  },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-VE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function daysUntilExpiry(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ─── CouponCard ──────────────────────────────────────────────

function CouponCard({
  coupon,
  status,
}: {
  coupon: UserCoupon & { status: CouponStatus }
  status: CouponStatus
}) {
  const [copied, setCopied] = useState(false)
  const typeConf   = typeConfig[coupon.type]
  const statusConf = statusConfig[status]
  const Icon       = typeConf.icon
  const StatusIcon = statusConf.icon
  const daysLeft   = status === 'active' ? daysUntilExpiry(coupon.expires_at) : null
  const isUrgent   = daysLeft !== null && daysLeft <= 3

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    toast.success('Código copiado')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border overflow-hidden transition-all ${
        status === 'active'
          ? 'border-cocoa/30 bg-gradient-to-br from-oscuro to-cocoa/5'
          : 'border-borde bg-oscuro opacity-70'
      }`}
    >
      {/* Urgency banner */}
      {isUrgent && (
        <div className="bg-red-500 text-white text-xs font-semibold text-center py-1 px-3">
          ⚡ Vence en {daysLeft} {daysLeft === 1 ? 'día' : 'días'}
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              status === 'active' ? 'bg-cocoa/10' : 'bg-borde/50'
            }`}>
              <Icon size={20} className={
                status === 'active' ? typeConf.color : 'text-texto/30'
              } />
            </div>
            <div>
              <p className="font-semibold text-choco dark:text-cream text-sm">
                {typeConf.label}
              </p>
              <p className="text-xs text-choco/50 dark:text-cream/50">
                Recibido el {formatDate(coupon.created_at)}
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1
            rounded-full text-xs font-semibold ${statusConf.className}`}>
            <StatusIcon size={11} />
            {statusConf.label}
          </span>
        </div>

        {/* Código */}
        <div className={`rounded-xl border-2 border-dashed p-4 text-center ${
          status === 'active'
            ? 'border-cocoa/40 bg-cocoa/5'
            : 'border-borde bg-transparent'
        }`}>
          <p className="text-xs font-medium text-choco/50 dark:text-cream/50
            uppercase tracking-widest mb-1">
            Código de descuento
          </p>
          <p className={`font-mono font-bold tracking-[0.2em] text-2xl ${
            status === 'active'
              ? 'text-cocoa dark:text-dorado'
              : 'text-choco/30 dark:text-cream/30'
          }`}>
            {coupon.code}
          </p>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-fondo dark:bg-oscuro/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-choco dark:text-cream">
              {coupon.discount}%
            </p>
            <p className="text-xs text-choco/50 dark:text-cream/50">Descuento</p>
          </div>
          <div className="bg-fondo dark:bg-oscuro/50 rounded-lg p-2.5 text-center">
            {status === 'active' ? (
              <>
                <p className="text-lg font-bold text-choco dark:text-cream">
                  {daysLeft}d
                </p>
                <p className="text-xs text-choco/50 dark:text-cream/50">Días restantes</p>
              </>
            ) : status === 'used' ? (
              <>
                <p className="text-xs font-semibold text-choco dark:text-cream mt-1">
                  {coupon.used_at ? formatDate(coupon.used_at) : '—'}
                </p>
                <p className="text-xs text-choco/50 dark:text-cream/50">Usado el</p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-choco/50 dark:text-cream/50 mt-1">
                  {formatDate(coupon.expires_at)}
                </p>
                <p className="text-xs text-choco/50 dark:text-cream/50">Expiró el</p>
              </>
            )}
          </div>
        </div>

        {/* Monto mínimo */}
        {coupon.min_order > 0 && (
          <p className="text-xs text-choco/40 dark:text-cream/40 text-center">
            Válido en compras mayores a ${coupon.min_order}
          </p>
        )}

        {/* CTA */}
        {status === 'active' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl
                border border-borde text-choco/70 dark:text-cream/70
                hover:border-cocoa hover:text-choco dark:hover:text-cream
                transition-colors text-sm font-medium"
            >
              {copied
                ? <><CheckCheck size={14} className="text-green-500" /> Copiado</>
                : <><Copy size={14} /> Copiar</>
              }
            </button>
            <a
              href="/products"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl
                bg-cocoa text-white text-sm font-semibold
                hover:bg-cocoa/90 transition-colors"
            >
              Usar ahora →
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────

function CouponSkeleton() {
  return (
    <div className="rounded-2xl border border-borde bg-oscuro p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-cocoa/10" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 rounded bg-cocoa/10" />
          <div className="h-2.5 w-32 rounded bg-cocoa/10" />
        </div>
      </div>
      <div className="h-16 rounded-xl bg-cocoa/10" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-12 rounded-lg bg-cocoa/10" />
        <div className="h-12 rounded-lg bg-cocoa/10" />
      </div>
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────

function EmptyState({ tab }: { tab: string }) {
  const messages = {
    active:  { icon: '🎁', title: 'No tienes cupones disponibles',  desc: 'Completa tu primera compra o deja una reseña para ganar descuentos.' },
    used:    { icon: '📦', title: 'Aún no has usado cupones',        desc: 'Cuando uses un cupón en tu compra aparecerá aquí.' },
    expired: { icon: '⏰', title: 'No tienes cupones expirados',     desc: '¡Usa tus cupones antes de que venzan!' },
  }
  const msg = messages[tab as keyof typeof messages]

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <span className="text-5xl">{msg.icon}</span>
      <p className="font-semibold text-choco dark:text-cream">{msg.title}</p>
      <p className="text-sm text-choco/50 dark:text-cream/50 max-w-xs">{msg.desc}</p>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────

type Tab = 'active' | 'used' | 'expired'

export default function UserCouponsPage() {
  const [tab, setTab] = useState<Tab>('active')
  const { data, isLoading } = useUserCoupons()

  const tabs: { key: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { key: 'active',  label: 'Disponibles', icon: Tag,          count: data?.active.length  },
    { key: 'used',    label: 'Usados',       icon: PackageCheck, count: data?.used.length    },
    { key: 'expired', label: 'Expirados',    icon: Clock,        count: data?.expired.length },
  ]

  const currentCoupons = data?.[tab] ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-choco dark:text-cream">
          Mis cupones
        </h1>
        <p className="text-sm text-choco/50 dark:text-cream/50 mt-1">
          Tus descuentos exclusivos para usar en tu próxima compra
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-borde">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                border-b-2 transition-colors -mb-px ${
                tab === t.key
                  ? 'border-cocoa text-cocoa dark:text-dorado'
                  : 'border-transparent text-choco/50 dark:text-cream/50 hover:text-choco dark:hover:text-cream'
              }`}
            >
              <Icon size={15} />
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`inline-flex items-center justify-center
                  size-5 rounded-full text-xs font-bold ${
                  tab === t.key
                    ? 'bg-cocoa text-white'
                    : 'bg-cocoa/10 text-cocoa/70'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Contenido */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <CouponSkeleton key={i} />)}
            </div>
          ) : currentCoupons.length === 0 ? (
            <EmptyState tab={tab} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCoupons.map(coupon => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  status={coupon.status}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}