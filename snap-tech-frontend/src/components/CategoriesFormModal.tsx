import { CategoryFormValues, categorySchema } from "@/schema/category";
import { FormModal } from "./FormModal";
import { DialogDescription } from "./ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

interface CategoryFormModalProps {
  triggerText?: string;
  initialValues?: Partial<CategoryFormValues>;
  onSubmit:  (values: CategoryFormValues) => Promise<void>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CategoryFormModal({
  triggerText,
  initialValues,
  onSubmit,
  isOpen,
  onOpenChange,
}: CategoryFormModalProps) {

    const handleFormSubmit = async (values: CategoryFormValues) => {
        await onSubmit({ ...values})
    }

    return (
        <FormModal<CategoryFormValues>
            triggerText={triggerText}
            title={initialValues?.id ? 'Edit Product' : 'Add Product'}
            initialValues={initialValues}
            validationSchema={categorySchema}
            onSubmit={handleFormSubmit}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            >
                {(form) => (
                    <>
                    <DialogDescription className="mb-4">
                        {initialValues?.id ? 'Edit the category details' : 'Fill in the details for a new product'}
                    </DialogDescription>
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Category Name" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Category Description" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    </>
                )}
                </FormModal>
    );
    
}