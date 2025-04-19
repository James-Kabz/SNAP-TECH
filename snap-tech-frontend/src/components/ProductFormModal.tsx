// components/ProductFormModal.tsx
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "./FormModal";
import { ProductFormValues, productSchema } from "@/schema/product";
import { DialogDescription } from "./ui/dialog";
import { useCallback, useState } from "react";
import { Upload } from "lucide-react";


interface ProductFormModalProps {
  triggerText?: string;
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues & { imageFile?: File }) => Promise<void>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProductFormModal({
  triggerText,
  initialValues,
  onSubmit,
  isOpen,
  onOpenChange,
}: ProductFormModalProps) {

    const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFormSubmit = async (values: ProductFormValues) => {
    await onSubmit({ ...values, imageFile: imageFile || undefined });
  };

  return (
    <FormModal<ProductFormValues>
      triggerText={triggerText}
      title={initialValues?.id ? "Edit Product" : "Add Product"}
      initialValues={initialValues}
      validationSchema={productSchema}
      onSubmit={handleFormSubmit}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {(form) => (
        <>
        <DialogDescription className="mb-4">
            {initialValues?.id ? "Edit the product details" : "Fill in the details for a new product"}
          </DialogDescription>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Textarea placeholder="Product description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Image Upload Field */}
          <FormItem>
            <FormLabel>Product Image</FormLabel>
            <div className="flex items-center gap-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-24 w-24 rounded-md object-cover"
                />
              ) : initialValues?.image_url ? (
                <img
                  src={initialValues.image_url}
                  alt="Current product"
                  className="h-24 w-24 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-md bg-gray-100">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
          
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  {/* Replace with your actual category select component */}
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </FormModal>
  );
}