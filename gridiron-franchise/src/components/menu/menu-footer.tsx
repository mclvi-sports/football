import Link from "next/link";

interface FooterButtonProps {
  label: string;
  icon: React.ReactNode;
  href: string;
}

function FooterButton({ label, icon, href }: FooterButtonProps) {
  return (
    <Link
      href={href}
      className="py-3 px-4 text-zinc-500 hover:text-foreground text-sm font-medium flex items-center justify-center gap-2 transition-colors"
    >
      <span>{icon}</span>
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
        <FooterButton label="Settings" icon="⚙️" href="/settings" />
        <FooterButton label="Credits" icon="ℹ️" href="/credits" />
      </div>
      <p className="text-center text-xs text-zinc-700 mt-6">{version}</p>
    </div>
  );
}
