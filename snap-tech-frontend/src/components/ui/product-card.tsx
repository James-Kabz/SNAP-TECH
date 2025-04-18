"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"

interface ProductCardProps {
  id: number
  name: string
  price: number
  image_url: string | null
  description: string
  onAddToCart: (id: number) => void
}

export function ProductCard({ id, name, price, image_url, description, onAddToCart }: ProductCardProps) {
  const apiUrl = import.meta.env.VITE_API_URL
  const [imgError, setImgError] = useState(false)
  
  // Helper function to get proper image URL
  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl || imgError) return "/placeholder.svg"
    
    try {
      // Extract just the filename from the path
      const filename = imageUrl.split('/').pop()
      if (!filename) return "/placeholder.svg"
      
      // Return the API URL for the image
      return `${apiUrl}/images/products/${filename}`
    } catch (error) {
      console.error("Error processing image URL:", error)
      return "/placeholder.svg"
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Image failed to load:", image_url)
    setImgError(true)
    e.currentTarget.src = "/placeholder.svg"
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={getImageUrl(image_url)}
          alt={name}
          className="h-full w-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 font-bold">{formatCurrency(price)}</p>
      </CardContent>
      <CardFooter className="p-4">
        <Button onClick={() => onAddToCart(id)} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}