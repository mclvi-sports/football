import Link from "next/link";

interface MenuButtonSecondaryProps {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export function MenuButtonSecondary({
  label,
  icon,
  href,
}: MenuButtonSecondaryProps) {
  return (
    <Link
      href={href}
      className="w-full py-[18px] px-5 bg-card border border-border hover:bg-accent hover:border-accent rounded-2xl flex items-center gap-4 text-left transition-colors"
    >
      <div className="w-10 h-10 bg-muted rounded-[10px] flex items-center justify-center text-xl text-muted-foreground">
        {icon}
      </div>
      <span className="text-base font-semibold text-foreground">{label}</span>
    </Link>
  );
}
