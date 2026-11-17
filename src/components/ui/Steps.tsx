import { cn } from "../../utils/cn";

interface StepsProps {
  steps: readonly string[];
  active: number;
  className?: string;
}

export function Steps({ steps, active, className }: StepsProps) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-2 text-xs",
        className,
      )}
    >
      {steps.map((label, index) => {
        const isActive = index === active;
        const isDone = index < active;

        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                isActive || isDone
                  ? "bg-primary text-white"
                  : "bg-surface-accent text-primary",
              )}
            >
              {isDone ? "✓" : index + 1}
            </span>
            <span
              className={cn(
                "whitespace-nowrap",
                isActive
                  ? "font-semibold text-primary"
                  : isDone
                    ? "text-gray-600"
                    : "text-gray-400",
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 && (
              <span className="hidden h-px w-6 bg-gray-300 sm:block" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default Steps;
