import { CircleAlert, CircleCheck, Info } from "lucide-react";
import type { ReactNode } from "react";

interface AlertProps {
  tone?: "error" | "success" | "info";
  title?: string;
  children?: ReactNode;
  className?: string;
}

const styles = {
  error: { box: "border-red-200 bg-red-50 text-red-900", icon: "text-red-600", Icon: CircleAlert },
  success: { box: "border-green-200 bg-green-50 text-green-900", icon: "text-green-600", Icon: CircleCheck },
  info: { box: "border-zinc-200 bg-zinc-50 text-zinc-800", icon: "text-zinc-500", Icon: Info },
} as const;

/** Inline message for forms and page banners. Errors are announced to screen readers. */
export default function Alert({ tone = "error", title, children, className = "" }: AlertProps) {
  const { box, icon, Icon } = styles[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${box} ${className}`}
    >
      <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${icon}`} />
      <div className="min-w-0 leading-relaxed">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "mt-0.5 opacity-90" : ""}>{children}</div>}
      </div>
    </div>
  );
}
