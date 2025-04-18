import { ProductCard } from "@/components/ui/product-card"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  description: string
}

interface ProductGridProps {
  products: Product[]
  onAddToCart: (id: number) => void
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          image_url={product.image_url}
          description={product.description}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
