type Status = "Pending" | "Paid" | "Shipped" | "Delivered" | string;

const statusMap: Record<string, { label: string; className: string }> = {
  Pending: {
    label: "Pendiente",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  Paid: {
    label: "Pagado",
    className:
      "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
  },
  Shipped: {
    label: "Enviado",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  Delivered: {
    label: "Entregado",
    className:
      "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  },
};

interface Props {
  status: Status;
}

export const StatusBadge = ({ status }: Props) => {
  const config = statusMap[status] ?? {
    label: status,
    className: "bg-cocoa/10 text-choco dark:bg-cream/10 dark:text-cream",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
};