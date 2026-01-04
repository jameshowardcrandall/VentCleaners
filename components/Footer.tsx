export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            V
          </div>
          <span className="text-lg font-display font-bold text-foreground">
            VentCleaners
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} VentCleaners. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
