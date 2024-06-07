import { cn } from "@/lib/utils.ts";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container mx-auto px-4 max-w-6xl", className)}>
      {children}
    </div>
  );
}
