import { Icon24Hours, IconLoader2 } from "@tabler/icons-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const button = cva([
  "flex items-center gap-2 px-3 py-2 rounded-md bg-foreground text-background font-bold",
]);

type SharedButtonProps = {
  isLoading?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type ButtonProps = SharedButtonProps & {
  leftIcon?: typeof Icon24Hours;
};

export const Button = ({
  children,
  isLoading,
  leftIcon: LeftIcon,
  ...props
}: ButtonProps) => {
  return (
    <button className={cn(button())} {...props}>
      {isLoading ? (
        <IconLoader2 className="w-4 h-4 animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export const IconButton = ({
  icon: Icon,
  isLoading,
  ...props
}: SharedButtonProps & { icon: typeof Icon24Hours }) => {
  return (
    <button className={cn(button(), "p-2 rounded-md")} {...props}>
      {isLoading ? (
        <IconLoader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
    </button>
  );
};
