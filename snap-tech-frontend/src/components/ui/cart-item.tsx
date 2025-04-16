"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Minus, Plus, Trash2 } from "lucide-react"

interface CartItemProps {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

export function CartItem({ id, name, price, image, quantity, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center space-x-4 py-4">
      <div className="h-16 w-16 overflow-hidden rounded-md">
        <img src={image || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{formatCurrency(price)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(id, quantity - 1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button variant="outline" size="icon" onClick={() => onUpdateQuantity(id, quantity + 1)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-20 text-right font-medium">{formatCurrency(price * quantity)}</div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
