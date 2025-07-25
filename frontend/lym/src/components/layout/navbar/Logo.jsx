import { ShoppingCart } from "lucide-react";

export function Logo() {
  return (
    <div className="mr-4 flex items-center md:mr-8 pl-2">
      <a href="/" className="flex items-center space-x-3 group">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-r from-primary to-primary/80 p-2 rounded-full">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Look Your Mood
          </span>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Encuentra tu estilo
          </span>
        </div>
      </a>
    </div>
  );
}
