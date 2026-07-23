export interface StatusStyle {
  badge: string;
  icon: string;
  border: string;
}

const STATUS_STYLES: Record<string, StatusStyle> = {
  encaminhado: {
    badge: "bg-green-100 text-green-700",
    icon: "bg-green-100 text-green-600",
    border: "border-green-500",
  },
  "em análise": {
    badge: "bg-amber-100 text-amber-700",
    icon: "bg-amber-100 text-amber-600",
    border: "border-amber-400",
  },
  "aguardando documentos": {
    badge: "bg-blue-100 text-blue-700",
    icon: "bg-blue-100 text-blue-600",
    border: "border-blue-400",
  },
  concluido: {
    badge: "bg-gray-100 text-gray-600",
    icon: "bg-gray-100 text-gray-500",
    border: "border-gray-300",
  },
  concluído: {
    badge: "bg-gray-100 text-gray-600",
    icon: "bg-gray-100 text-gray-500",
    border: "border-gray-300",
  },
};

const DEFAULT_STYLE: StatusStyle = {
  badge: "bg-gray-100 text-gray-600",
  icon: "bg-gray-100 text-gray-500",
  border: "border-gray-800",
};

export function getStatusStyle(estagio: string): StatusStyle {
  return STATUS_STYLES[estagio.trim().toLowerCase()] ?? DEFAULT_STYLE;
}
