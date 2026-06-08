const CONFIG = {
  1: { color: "bg-red-500",   title: "High priority" },
  2: { color: "bg-amber-400", title: "Medium priority" },
  3: { color: "bg-gray-600",  title: "Low priority" },
};

export default function PriorityDot({ priority = 2 }) {
  const cfg = CONFIG[priority] ?? CONFIG[2];
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${cfg.color}`}
      title={cfg.title}
      aria-label={cfg.title}
    />
  );
}
