export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card px-4 py-4 lg:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          © {year} SABO Indústria e Comércio de Autopeças S.A.
        </p>
        <p className="text-xs text-muted-foreground/50">
          Portal de Treinamentos · v1.0
        </p>
      </div>
    </footer>
  )
}