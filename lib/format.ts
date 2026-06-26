export function maskSecret(secret: string): string {
  if (!secret) return "";
  const prefix = secret.length > 7 ? secret.slice(0, 7) : secret;
  const suffix = secret.length > 4 ? secret.slice(-4) : "";
  return `${prefix}${"\u2022".repeat(12)}${suffix}`;
}

export function formatFileSize(bytes: number): string {
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export function shortChecksum(sha: string): string {
  if (!sha) return "";
  return sha.length > 16 ? `${sha.slice(0, 8)}...${sha.slice(-8)}` : sha;
}

export function initials(name: string): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].length > 1
      ? parts[0].slice(0, 2).toUpperCase()
      : parts[0].toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

const ACCENT_PALETTE = [
  "#4f46e5", "#0891b2", "#059669", "#d97706",
  "#db2777", "#7c3aed", "#2563eb", "#dc2626",
];

export function accentColor(name: string): string {
  let hash = 0;
  const s = name ?? "";
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return ACCENT_PALETTE[Math.abs(hash) % ACCENT_PALETTE.length];
}

export function envColors(environment: string): { text: string; bg: string } {
  switch ((environment ?? "").toLowerCase()) {
    case "production":
      return { text: "#d97706", bg: "#fffbeb" };
    case "staging":
      return { text: "#9333ea", bg: "#faf5ff" };
    case "development":
      return { text: "#2563eb", bg: "#eff6ff" };
    default:
      return { text: "#6b7280", bg: "#f9fafb" };
  }
}

export function formatDateTime(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
