export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-start justify-center px-6 py-12 sm:py-16">
        <div className="w-full max-w-[400px]">
          {/* Logo and Branding */}
          <div className="text-center mb-12">
            <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-4xl">🏈</span>
            </div>
            <h1 className="text-[28px] font-bold tracking-tight">
              Gridiron Franchise
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your team. Build a dynasty.
            </p>
          </div>

          {/* Main Content */}
          {children}
        </div>
      </main>
    </div>
  );
}
