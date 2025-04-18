"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Header } from "@/components/layout/header"
import { ProductGrid } from "@/components/ui/product-grid"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/user-cart-hook"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  description: string
  category_id: number
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL ;
        const [featuredRes, newArrivalsRes] = await Promise.all([
          axios.get(`${apiUrl}/products`),
          axios.get(`${apiUrl}/products`),
        ])

        setFeaturedProducts(featuredRes.data.data)
        setNewArrivals(newArrivalsRes.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (id: number) => {
    const product = [...featuredProducts, ...newArrivals].find((p) => p.id === id)
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
      })
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="">
      <Header />

      {/* Hero Section */}
      <section className="bg-muted py-12 md:py-24">
        <div className=" grid gap-6 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              The Latest Tech at Your Fingertips
            </h1>
            <p className="max-w-[1600px] text-muted-foreground md:text-xl">
              Discover the newest phones, laptops, and accessories at competitive prices.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/products/deals">View Deals</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Latest Electronics"
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
            <Button variant="link" asChild>
              <Link to="/products/featured">View all</Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts} onAddToCart={handleAddToCart} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-muted/50">
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">New Arrivals</h2>
            <Button variant="link" asChild>
              <Link to="/products?sort=newest">View all</Link>
            </Button>
          </div>
          {/* <ProductGrid products={newArrivals} onAddToCart={handleAddToCart} /> */}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Shop by Category</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Link to="/products/phones" className="group relative overflow-hidden rounded-lg">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Phones"
                className="h-[200px] w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Phones</h3>
              </div>
            </Link>
            <Link to="/products/laptops" className="group relative overflow-hidden rounded-lg">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Laptops"
                className="h-[200px] w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Laptops</h3>
              </div>
            </Link>
            <Link to="/products/accessories" className="group relative overflow-hidden rounded-lg">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Accessories"
                className="h-[200px] w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Accessories</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
