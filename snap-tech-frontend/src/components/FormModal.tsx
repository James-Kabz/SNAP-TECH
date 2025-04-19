// components/FormModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm, UseFormReturn, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ReactNode, useEffect } from "react";
import { ZodType, ZodTypeDef } from "zod";

interface FormModalProps<T extends Record<string, unknown>> {
  triggerText?: string;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerIcon?: ReactNode;
  title: string;
  initialValues?: Partial<T>;
  validationSchema: ZodType<T, ZodTypeDef, T>;
  onSubmit: (values: T) => Promise<void>;
  children: (form: UseFormReturn<T>) => ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FormModal<T extends Record<string, unknown>>({
  triggerText,
  triggerVariant = "default",
  triggerIcon,
  title,
  initialValues = {},
  validationSchema,
  onSubmit,
  children,
  isOpen,
  onOpenChange,
}: FormModalProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues as DefaultValues<T>,
  });

  // Fixed useEffect to prevent infinite loops
  useEffect(() => {
    if (isOpen) {
      form.reset(initialValues as T);
    }
  }, [isOpen, initialValues, form]);

  const handleSubmit = async (values: T) => {
    try {
      await onSubmit(values);
      toast.success("Operation completed successfully");
      onOpenChange?.(false);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Submission error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerText && (
        <DialogTrigger asChild>
          <Button variant={triggerVariant}>
            {triggerIcon && <span className="mr-2">{triggerIcon}</span>}
            {triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {children(form)}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}