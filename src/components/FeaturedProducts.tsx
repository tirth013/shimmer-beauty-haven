import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  // Mock product data - in real app this would come from API
  const featuredProducts = [
    {
      id: "1",
      name: "Radiant Glow Vitamin C Serum",
      price: 89,
      originalPrice: 119,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      rating: 4.8,
      reviews: 324,
      category: "Skincare",
      isNew: true,
      isSale: true,
    },
    {
      id: "2",
      name: "Luxury Rose Gold Lipstick Set",
      price: 65,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
      rating: 4.9,
      reviews: 156,
      category: "Makeup",
      isNew: true,
    },
    {
      id: "3",
      name: "Hydrating Botanical Face Mask",
      price: 45,
      image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400",
      rating: 4.7,
      reviews: 89,
      category: "Skincare",
    },
    {
      id: "4",
      name: "Professional Makeup Brush Set",
      price: 125,
      originalPrice: 165,
      image: "https://images.unsplash.com/photo-1503236024-ef0502c2fdb6?w=400",
      rating: 4.6,
      reviews: 203,
      category: "Tools",
      isSale: true,
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium beauty products, 
            crafted with the finest ingredients for exceptional results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="px-8">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;