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
import { Category } from "@/lib/types"
import { CategoryFormModal } from "@/components/CategoriesFormModal"
import { CategoryFormValues } from "@/schema/category"

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories`)
      setCategories(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setLoading(false)
    }
  }, [apiUrl])

  useEffect(() => {
    if (!user || !user.roles?.includes("admin")) {
      navigate("/login")
      return
    }
    fetchCategories()
  }, [user, navigate, apiUrl, fetchCategories])

  const handleSubmit = async (values: CategoryFormValues, onOpenChange?: (open: boolean) => void) => {
    try {
      const payload = {
        name: values.name,
        description: values.description || null
      };

      if (values.id) {
        // Update existing category
        await axios.put(`${apiUrl}/categories/${values.id}`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success("Category updated successfully");
      } else {
        // Create new category
        await axios.post(`${apiUrl}/categories`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // toast.success("Category created successfully");
      }
      
      // Refresh the categories list after successful operation
      await fetchCategories();
      // close modal
      onOpenChange?.(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(`Failed to ${values.id ? "update" : "create"} category`);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return
    }
    try {
      await axios.delete(`${apiUrl}/categories/${id}`)
      // Refresh the categories list after deletion
      await fetchCategories();
      toast.success("Category deleted successfully")
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Failed to delete category")
    }
  }

  const filteredCategories = categories.filter(category =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Actions",
      accessor: (row: Category) => (
        <div className="flex justify-end gap-2">
          <CategoryFormModal
            triggerText={<Edit className="h-4 w-4" />}
            initialValues={row}
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