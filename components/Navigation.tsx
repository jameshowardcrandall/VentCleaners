import { Phone } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              V
            </div>
            <span className="text-2xl font-display font-bold text-foreground">
              VentCleaners
            </span>
          </div>
          <a
            href="#contact"
            className="hidden md:flex items-center px-5 py-2.5 rounded-full font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            (540)684-5359
          </a>
        </div>
      </div>
    </nav>
  );
}
