import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "../../utils/cn";

interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = id || React.useId();

    return (
      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <CheckboxPrimitive.Root
            ref={ref}
            id={generatedId}
            className={cn(
              "peer h-4 w-4 shrink-0 rounded border border-gray-300 bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white",
              error && "border-red-500 focus:ring-red-500",
              className,
            )}
            {...props}
          >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
              <svg
                className="h-3.5 w-3.5 stroke-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          {label && (
            <label
              htmlFor={generatedId}
              className="cursor-pointer text-sm font-medium text-surface-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
            >
              {label}
            </label>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
