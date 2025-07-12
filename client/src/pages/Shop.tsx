import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Grid, List, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";

const Shop = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { name: "All Products", count: 120, active: true },
    { name: "Skincare", count: 45 },
    { name: "Makeup", count: 38 },
    { name: "Fragrance", count: 22 },
    { name: "Hair Care", count: 15 },
  ];

  const products = [
    {
      id: 1,
      name: "Radiant Glow Serum",
      category: "Skincare",
      price: 89.99,
      originalPrice: 120.00,
      rating: 4.8,
      reviews: 128,
      image: "/api/placeholder/300/300",
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Luxury Matte Lipstick",
      category: "Makeup",
      price: 34.99,
      rating: 4.9,
      reviews: 89,
      image: "/api/placeholder/300/300",
      badge: "New"
    },
    {
      id: 3,
      name: "Midnight Rose Perfume",
      category: "Fragrance",
      price: 125.00,
      rating: 4.7,
      reviews: 156,
      image: "/api/placeholder/300/300",
      badge: "Limited Edition"
    },
    {
      id: 4,
      name: "Hydrating Face Cream",
      category: "Skincare",
      price: 67.50,
      rating: 4.6,
      reviews: 203,
      image: "/api/placeholder/300/300"
    },
    {
      id: 5,
      name: "Illuminating Foundation",
      category: "Makeup",
      price: 45.99,
      rating: 4.8,
      reviews: 94,
      image: "/api/placeholder/300/300"
    },
    {
      id: 6,
      name: "Botanical Hair Mask",
      category: "Hair Care",
      price: 28.99,
      rating: 4.5,
      reviews: 67,
      image: "/api/placeholder/300/300"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rose-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Shop Our
              <span className="block text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text">
                Premium Collection
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover luxury beauty products crafted with the finest ingredients
              to enhance your natural radiance and confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Main Shopping Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg border p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                
                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        className={`w-full text-left p-2 rounded-md transition-colors ${
                          category.active 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.name}</span>
                          <span className="text-sm text-gray-500">({category.count})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Price Range</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Under $25</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>$25 - $50</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>$50 - $100</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Over $100</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-semibold">All Products</h2>
                  <p className="text-gray-600">Showing {products.length} of 120 products</p>
                </div>
                <div className="flex items-center gap-4">
                  <select className="border rounded-md px-3 py-2">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                    <option>Rating</option>
                  </select>
                  <div className="flex border rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <div className="w-full h-64 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-rose-300" />
                        </div>
                        {product.badge && (
                          <Badge className="absolute top-3 left-3" variant="secondary">
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">{product.category}</div>
                        <CardTitle className="text-lg group-hover:text-rose-600 transition-colors">
                          {product.name}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-gray-500 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;