import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
}

/** Labelled input with accessible error and hint wiring (aria-invalid / aria-describedby). */
export function FormField({ label, error, hint, id, ...props }: FieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  const describedBy = [error ? `${fieldId}-error` : null, hint ? `${fieldId}-hint` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input id={fieldId} aria-invalid={Boolean(error)} aria-describedby={describedBy} {...props} />
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fieldId}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
