import { cn } from "../../utils/cn";

interface QuantityStepperProps {
  value: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
}

export function QuantityStepper({
  value,
  max,
  min = 1,
  onChange,
  label = "Jumlah",
  className,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-gray-300 bg-surface",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Kurangi ${label.toLowerCase()}`}
        className="flex h-8 w-8 items-center justify-center text-base text-gray-600 transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isNaN(next)) onChange(next);
        }}
        aria-label={label}
        className="h-8 w-11 border-x border-gray-300 bg-surface text-center text-sm text-surface-text focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Tambah ${label.toLowerCase()}`}
        className="flex h-8 w-8 items-center justify-center text-base text-gray-600 transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;
