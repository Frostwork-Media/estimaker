import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const button = cva([
  "px-3 py-2 rounded-md bg-foreground text-background font-bold",
]);

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button className={cn(button())} {...props}>
      {children}
    </button>
  );
};
