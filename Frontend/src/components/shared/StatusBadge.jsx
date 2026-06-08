const CONFIG = {
  wishlist:  { label: "Wishlist",  classes: "bg-gray-700 text-gray-300" },
  applied:   { label: "Applied",   classes: "bg-blue-900/60 text-blue-300" },
  screening: { label: "Screening", classes: "bg-amber-900/60 text-amber-300" },
  interview: { label: "Interview", classes: "bg-emerald-900/60 text-emerald-300" },
  offer:     { label: "Offer",     classes: "bg-purple-900/60 text-purple-300" },
  rejected:  { label: "Rejected",  classes: "bg-red-900/50 text-red-400" },
  withdrawn: { label: "Withdrawn", classes: "bg-gray-800 text-gray-500" },
};

export const COLUMN_META = {
  wishlist:  { label: "Wishlist",  dot: "bg-gray-500",    header: "text-gray-400" },
  applied:   { label: "Applied",   dot: "bg-blue-400",    header: "text-blue-400" },
  screening: { label: "Screening", dot: "bg-amber-400",   header: "text-amber-400" },
  interview: { label: "Interview", dot: "bg-emerald-400", header: "text-emerald-400" },
  offer:     { label: "Offer",     dot: "bg-purple-400",  header: "text-purple-400" },
  rejected:  { label: "Rejected",  dot: "bg-red-500",     header: "text-red-400" },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] ?? CONFIG.wishlist;
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}
