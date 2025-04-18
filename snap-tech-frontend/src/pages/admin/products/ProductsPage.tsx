"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/UseAuth"
import { ProductFormModal } from "@/components/ProductFormModal"
import { ProductFormValues } from "@/schema/product"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  price: number
  description: string
  image_url: string | null
  category_id: number
  stock: number
  created_at?: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
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
    fetchProducts()
  }, [user, navigate, apiUrl])

  const handleSubmit = async (values: ProductFormValues & { imageFile?: File }) => {
    try {
      const formData = new FormData();
      
      // Append all product data
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'imageFile' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
  
      // Append the image file with the correct field name
      if (values.imageFile) {
        formData.append('image_url', values.imageFile); // Changed from 'image' to 'image_url'
      }
  
      const response = await axios.post(`${apiUrl}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setProducts(prev => [...prev, response.data.data]);
      toast.success("Product created successfully");
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
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  // Helper function to get proper image URL
  const getImageUrl = (image_url: string | null) => {
    if (!image_url) return "/placeholder.svg"
    
    // Extract just the filename from the path
    const filename = image_url.split('/').pop()
    
    // Return the API URL for the image
    return `${apiUrl}/images/products/${filename}`
  }

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={getImageUrl(product.image_url)}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>KES {product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category_id}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}