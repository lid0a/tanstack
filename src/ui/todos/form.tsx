import {
  Controller,
  useForm,
  type SubmitErrorHandler,
  type UseFormReset,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as GenericForm } from "~/ui/shared/form";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import type { BaseSyntheticEvent } from "react";

const formSchema = z.object({
  todo: z.string().min(1, "Title cannot be empty"),
  completed: z.boolean().default(false).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export function Form({
  label,
  defaultValues,
  onSubmit = () => {},
  onError = () => {},
  disabled,
}: {
  label: string;
  defaultValues?: FormSchema;
  onSubmit?: (
    data: FormSchema,
    event?: BaseSyntheticEvent,
    ctx?: { reset?: UseFormReset<FormSchema> },
  ) => unknown | Promise<unknown>;
  onError?: SubmitErrorHandler<FormSchema>;
  disabled?: boolean;
}) {
  const { control, handleSubmit, reset } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <GenericForm
      label={label}
      onSubmit={handleSubmit(async (data, event) => {
        await onSubmit(data, event, { reset });
      }, onError)}
      disabled={disabled}
    >
      <Controller
        name="todo"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input id={field.name} {...field} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="completed"
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id={field.name}
              ref={field.ref}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
              disabled={field.disabled}
            />
            <Label htmlFor={field.name}>Completed</Label>
          </div>
        )}
      />
    </GenericForm>
  );
}
