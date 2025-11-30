export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-start justify-center px-5 py-5">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
