import Link from "next/link";

interface MenuButtonPrimaryProps {
  title: string;
  subtitle?: string;
  href: string;
  icon?: React.ReactNode;
}

export function MenuButtonPrimary({
  title,
  subtitle,
  href,
  icon = "▶",
}: MenuButtonPrimaryProps) {
  return (
    <Link
      href={href}
      className="w-full p-5 bg-blue-500 hover:bg-blue-600 rounded-2xl flex items-center justify-between text-left transition-colors"
    >
      <div className="flex flex-col gap-1">
        <span className="text-lg font-bold text-white">{title}</span>
        {subtitle && (
          <span className="text-[13px] text-white/80">{subtitle}</span>
        )}
      </div>
      <div className="text-2xl text-white">{icon}</div>
    </Link>
  );
}
