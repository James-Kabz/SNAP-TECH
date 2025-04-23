"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/UseAuth"
import { toast } from "sonner"
import { Category, Product } from "@/lib/types"
import { ProductFormModal } from "@/components/ProductFormModal"
import { ProductFormValues } from "@/schema/product"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/products`)
      setProducts(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }, [apiUrl])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (!user || !user.roles?.includes("admin")) {
      navigate("/login")
      return
    }
    fetchProducts()
    fetchCategories()
  }, [user, navigate, apiUrl, fetchProducts, fetchCategories])

  const handleSubmit = async (values: ProductFormValues & { imageFile?: File }, onOpenChange?: (open: boolean) => void) => {
    console.log("Form values before submission:", values);
    try {
      const formData = new FormData();
      
      // Append all fields including numbers and optional fields
      formData.append('name', values.name);
      formData.append('price', String(values.price));
      formData.append('stock', String(values.stock));
      formData.append('category_id', String(values.category_id));
      
      // Handle optional description
      if (values.description) {
        formData.append('description', values.description);
      } else {
        formData.append('description', ''); // Send empty string if null
      }
      
      // Handle image file
      if (values.imageFile) {
        formData.append('image_url', values.imageFile);
      } else if (values.image_url) {
        // If no new image but existing image_url, send it as string
        formData.append('existing_image', values.image_url);
      }

  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
  
      const url = values.id 
        ? `${apiUrl}/products/${values.id}`
        : `${apiUrl}/products`;
      
      const method = values.id ? 'put' : 'post';
      
      await axios[method](url, formData, config);
      toast.success(`Product ${values.id ? 'updated' : 'created'} successfully`);
      await fetchProducts();
      onOpenChange?.(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(`Failed to ${values.id ? "update" : "create"} product`);
      throw error;
    }
  }
  // const handleSubmit = async (values: ProductFormValues & { imageFile?: File }, onOpenChange?: (open: boolean) => void) => {
  //   try {
  //     // Prepare the payload similar to your category form
  //     const payload = {
  //       name: values.name,
  //       description: values.description || null,
  //       price: values.price,
  //       stock: values.stock,
  //       category_id: values.category_id,
  //       // Handle image separately if it exists
  //       ...(values.imageFile && { image_url: values.imageFile })
  //     };
  
  //     if (values.id) {
  //       // Update existing product
  //       await axios.put(`${apiUrl}/products/${values.id}`, payload, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       toast.success("Product updated successfully");
  //     } else {
  //       // Create new product
  //       await axios.post(`${apiUrl}/products`, payload, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       toast.success("Product created successfully");
  //     }
      
  //     // Refresh the products list
  //     await fetchProducts();
  //     // Close the modal
  //     onOpenChange?.(false);
  //   } catch (error) {
  //     console.error("Error saving product:", error);
  //     toast.error(`Failed to ${values.id ? "update" : "create"} product`);
  //     throw error;
  //   }
  // }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await axios.delete(`${apiUrl}/products/${id}`)
      await fetchProducts()
      toast.success("Product deleted successfully")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    }
  }

  const getImageUrl = (image_url: string | null) => {
    if (!image_url) return "/placeholder.svg";
    // Check if it's already a full URL
    if (image_url.startsWith('http')) return image_url;
    const filename = image_url.split('/').pop();
    return `${apiUrl}/images/products/${filename}`;
  };

  const filteredProducts = products.filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  )

  const productToFormValues = (product: Product): ProductFormValues => ({
    id: product.id,
    name: product.name || '', // Ensure name is not undefined
    description: product.description || '',
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    category_id: product.category?.id || 0,
    image_url: product.image_url ? getImageUrl(product.image_url) : undefined,
})

  const columns = [
    {
      header: "Image",
      accessor: (row: Product) => (
        <img
          src={getImageUrl(row.image_url)}
          alt={row.name}
          className="h-10 w-10 rounded-md object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
      ),
      className: "w-[80px]",
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Price",
      accessor: (row: Product) => `KES ${parseFloat(row.price).toLocaleString()}`,
    },
    {
      header: "Stock",
      accessor: "stock",
    },
    {
      header: "Category",
      accessor: "category.name",
    },
    {
      header: "Actions",
      accessor: (row: Product) => (
        <div className="flex justify-end gap-2">
          <ProductFormModal
            triggerText={<Edit className="h-4 w-4" />}
            initialValues={productToFormValues(row)}
            onSubmit={handleSubmit}
            categories={categories}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right",
    },
  ]

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <ProductFormModal
            triggerText="Add Product"
            onSubmit={handleSubmit}
            categories={categories}
          />
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <DataTable<Product>
          columns={columns}
          data={filteredProducts}
          emptyMessage="No products found"
        />
      </div>
    </div>
  )
}