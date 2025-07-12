import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

const ProductCard = ({
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  category,
  isNew,
  isSale,
}: ProductCardProps) => {
  return (
    <Card className="group cursor-pointer hover:shadow-elegant transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-gradient-luxury text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {isSale && (
            <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
              Sale
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white">
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground mb-1">{category}</div>
        <h3 className="font-medium text-foreground mb-2 line-clamp-2">{name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">${price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;