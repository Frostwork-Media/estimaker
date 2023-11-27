import { Icon24Hours, IconLoader2 } from "@tabler/icons-react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const button = cva(["flex items-center gap-2 px-3 py-2 rounded-md font-bold"], {
  variants: {
    color: {
      inverted: "bg-foreground text-background",
      neutral: "bg-neutral-200 text-foreground",
      red: "bg-red-500 text-background",
    },
  },
  defaultVariants: {
    color: "inverted",
  },
});

type SharedButtonProps = {
  isLoading?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  VariantProps<typeof button>;

type ButtonProps = SharedButtonProps & {
  leftIcon?: typeof Icon24Hours;
};

export const Button = ({
  children,
  isLoading,
  leftIcon: LeftIcon,
  color,
  ...props
}: ButtonProps) => {
  return (
    <button className={cn(button({ color }))} {...props}>
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
  color,
  ...props
}: SharedButtonProps & { icon: typeof Icon24Hours }) => {
  return (
    <button className={cn(button({ color }), "p-2 rounded-md")} {...props}>
      {isLoading ? (
        <IconLoader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
    </button>
  );
};
