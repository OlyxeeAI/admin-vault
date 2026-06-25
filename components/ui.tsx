import { envColors } from "@/lib/format";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-gray-900 sm:text-[32px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[15px] text-gray-500">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-ios bg-white px-6 py-16 text-center shadow-ios">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        {icon}
      </div>
      <h3 className="text-[17px] font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-[14px] text-gray-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function EnvBadge({ environment }: { environment: string }) {
  const { text, bg } = envColors(environment);
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium capitalize"
      style={{ color: text, backgroundColor: bg }}
    >
      {environment || "—"}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const ok = status?.toUpperCase() === "SUCCESS" || status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
        ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          ok ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {status}
    </span>
  );
}
