"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/UseAuth"
import { ProductFormModal } from "@/components/ProductFormModal"
import { ProductFormValues } from "@/schema/product"
import { toast } from "sonner"
import { Product } from "@/lib/types"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  // const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (!user || !user.roles?.includes("admin")) {
      navigate("/login")
      return
    }
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products`)
        setProducts(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    // const fetchCategories = async () => {
    //   try {
    //     const response = await axios.get(`${apiUrl}/categories`)
    //     setCategories(response.data.data)
    //     setLoading(false)
    //   } catch (error) {
    //     console.error("Error fetching Categories", error)
    //     setLoading(false)
    //   }
    // }

    fetchProducts()
    // fetchCategories()
  }, [user, navigate, apiUrl])


  const handleSubmit = async (values: ProductFormValues & { imageFile?: File }) => {
    try {
      const formData = new FormData();
      
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'imageFile' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
  
      if (values.imageFile) {
        formData.append('image_url', values.imageFile);
      }
  
      const response = await axios.post(`${apiUrl}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setProducts(prev => [...prev, response.data.data]);
      navigate("/admin/products");
      // toast.success("Product created successfully");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await axios.delete(`${apiUrl}/products/${id}`)
      setProducts(prev => prev.filter((product) => product.id !== id))
      toast.success("Product deleted successfully")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    }
  }

  const getImageUrl = (image_url: string | null) => {
    if (!image_url) return "/placeholder.svg"
    const filename = image_url.split('/').pop()
    return `${apiUrl}/images/products/${filename}`
  }

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const productToFormValues = (product: Product): ProductFormValues => ({
    ...product,
    price: Number(product.price),
    image_url: product.image_url ?? undefined,
  });

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
          triggerText={<Edit className="h-4 w-4"/>}
          initialValues={productToFormValues(row)}
          onSubmit={handleSubmit}
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