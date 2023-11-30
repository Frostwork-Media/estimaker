import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-indigo-50 dark:bg-neutral-800">
      <SliderPrimitive.Range className="absolute h-full bg-indigo-600 dark:bg-neutral-50" />
    </SliderPrimitive.Track>
    {props.value &&
      props.value.map((_value, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block h-3 w-3 rounded-full bg-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-50 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300"
        />
      ))}
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
