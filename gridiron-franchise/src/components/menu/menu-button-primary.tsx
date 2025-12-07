import Link from "next/link";
import { Play } from "lucide-react";

interface MenuButtonPrimaryProps {
  title: string;
  subtitle?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function MenuButtonPrimary({
  title,
  subtitle,
  href,
  onClick,
  disabled,
  icon = <Play className="w-6 h-6" />,
}: MenuButtonPrimaryProps) {
  const className = `w-full p-5 bg-blue-500 hover:bg-blue-600 rounded-2xl flex items-center justify-between text-left transition-colors ${
    disabled ? "opacity-50 pointer-events-none" : ""
  }`;

  const content = (
    <>
      <div className="flex flex-col gap-1">
        <span className="text-lg font-bold text-white">{title}</span>
        {subtitle && (
          <span className="text-[13px] text-white/80">{subtitle}</span>
        )}
      </div>
      <div className="text-2xl text-white">{icon}</div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  );
}
