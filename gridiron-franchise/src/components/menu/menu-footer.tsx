import Link from "next/link";
import { Settings, Info } from "lucide-react";

interface FooterButtonProps {
  label: string;
  icon: React.ReactNode;
  href: string;
}

function FooterButton({ label, icon, href }: FooterButtonProps) {
  return (
    <Link
      href={href}
      className="py-3 px-4 text-muted-foreground hover:text-foreground text-sm font-medium flex items-center justify-center gap-2 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}

interface MenuFooterProps {
  version?: string;
}

export function MenuFooter({ version = "v0.1.0-alpha" }: MenuFooterProps) {
  return (
    <div className="mt-auto pt-6">
      <div className="grid grid-cols-2 gap-4">
        <FooterButton label="Settings" icon={<Settings className="w-4 h-4" />} href="/settings" />
        <FooterButton label="Credits" icon={<Info className="w-4 h-4" />} href="/credits" />
      </div>
      <p className="text-center text-xs text-muted-foreground/50 mt-6">{version}</p>
    </div>
  );
}
