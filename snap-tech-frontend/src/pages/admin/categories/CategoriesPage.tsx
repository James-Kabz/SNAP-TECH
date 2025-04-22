"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/UseAuth"
import { toast } from "sonner"
import { Category } from "@/lib/types"
import { CategoryFormValues } from "@/schema/category"
import { CategoryFormModal } from "@/components/CategoriesFormModal"

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
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
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories`)
        setCategories(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setLoading(false)
      }
    }

    fetchCategories()
  }, [user, navigate, apiUrl])


  const handleSubmit = async ( values: CategoryFormValues ) => {
    try {
      const formData = new FormData();
    
  
      const response = await axios.post(`${apiUrl}/categories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setCategories(prev => [...prev, response.data.data]);
      navigate("/admin/categories");
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return
    }

    try {
      await axios.delete(`${apiUrl}/categories/${id}`)
      setCategories(prev => prev.filter((category) => category.id !== id))
      toast.success("Category deleted successfully")
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Failed to delete category")
    }
  }

  const filteredCategories = categories.filter((category) => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Category",
      accessor: "description",
    },
    {
      header: "Actions",
      accessor: (row: Category) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/admin/categories/${row.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
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
          <h1 className="text-2xl font-bold">Manage Categories</h1>
          <CategoryFormModal
            triggerText="Add Category"
            onSubmit={handleSubmit}
          />
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <DataTable<Category>
          columns={columns}
          data={filteredCategories}
          emptyMessage="No categories found"
        />
      </div>
    </div>
  )
}