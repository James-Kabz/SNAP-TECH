"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface ProductCardProps {
  id: number
  name: string
  price: number
  image: string
  description: string
  onAddToCart: (id: number) => void
}

export function ProductCard({ id, name, price, image, description, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-all hover:scale-105"
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
