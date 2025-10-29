import { Button } from "~/components/ui/button";
import type { FormEventHandler, ReactNode } from "react";

export function Form({
  label,
  onSubmit = () => {},
  disabled,
  children,
}: {
  label: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={disabled}>
        <legend className="font-medium mb-4">{label}</legend>
        {children}
        <Button className="mt-8 w-full">Save</Button>
      </fieldset>
    </form>
  );
}
