"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { imageService } from "@/services/imageService"
import { useState, useEffect } from "react"

interface ProductCardProps {
  id: number
  name: string
  price: number
  image_url: string
  description: string
  onAddToCart: (id: number) => void
}

export function ProductCard({ id, name, price, image_url, description, onAddToCart }: ProductCardProps) {
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg")
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)
  
  useEffect(() => {
    // Process the image URL
    const processedUrl = imageService.getProductImageUrl(image_url)
    setImageUrl(processedUrl)
    
  }, [image_url])

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-opacity"
          style={{ opacity: imageLoaded ? 1 : 0 }}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            console.error(`Failed to load image for product: ${name}`)
          }}
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