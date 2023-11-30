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
    size: {
      sm: "text-sm px-2 py-1",
      md: "text-base px-3 py-2",
    },
  },
  defaultVariants: {
    color: "inverted",
    size: "md",
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
  size,
  ...props
}: ButtonProps) => {
  return (
    <button className={cn(button({ color, size }))} {...props}>
      {isLoading ? (
        <IconLoader2 className="w-4 h-4 animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

const iconButton = cva([], {
  variants: {
    size: {
      md: "w-4 h-4",
      sm: "w-3 h-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const IconButton = ({
  icon: Icon,
  isLoading,
  color,
  size,
  ...props
}: SharedButtonProps & { icon: typeof Icon24Hours }) => {
  return (
    <button
      className={cn(button({ color, size }), "p-2 rounded-md")}
      {...props}
    >
      {isLoading ? (
        <IconLoader2 className={cn("animate-spin", iconButton({ size }))} />
      ) : (
        <Icon className={cn(iconButton({ size }))} />
      )}
    </button>
  );
};
