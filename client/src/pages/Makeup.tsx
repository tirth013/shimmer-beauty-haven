import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Eye, Lips, Sparkles, Star, Heart, Play } from "lucide-react";

const Makeup = () => {
  const categories = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Eyes",
      description: "Eyeshadows, liners, and mascaras",
      products: 45,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Lips className="h-8 w-8" />,
      title: "Lips",
      description: "Lipsticks, glosses, and stains",
      products: 38,
      color: "from-red-500 to-rose-500"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Face",
      description: "Foundations, blushes, and highlighters",
      products: 52,
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Palettes",
      description: "Complete makeup collections",
      products: 23,
      color: "from-teal-500 to-cyan-500"
    }
  ];

  const products = [
    {
      id: 1,
      name: "Velvet Matte Lipstick Collection",
      description: "Long-lasting matte formula in 12 stunning shades",
      price: 28.99,
      originalPrice: 35.99,
      rating: 4.9,
      reviews: 892,
      badge: "Best Seller",
      category: "Lips"
    },
    {
      id: 2,
      name: "Sunset Eyeshadow Palette",
      description: "18 warm-toned shades for endless eye looks",
      price: 65.00,
      rating: 4.8,
      reviews: 543,
      badge: "New",
      category: "Eyes"
    },
    {
      id: 3,
      name: "Liquid Highlighter Drops",
      description: "Customizable glow for face and body",
      price: 42.50,
      rating: 4.7,
      reviews: 367,
      category: "Face"
    },
    {
      id: 4,
      name: "Precision Eyeliner Pen",
      description: "Waterproof liner with ultra-fine tip",
      price: 19.99,
      rating: 4.9,
      reviews: 1205,
      badge: "Award Winner",
      category: "Eyes"
    }
  ];

  const tutorials = [
    {
      title: "Everyday Natural Look",
      duration: "8 min",
      difficulty: "Beginner",
      views: "125K"
    },
    {
      title: "Bold Evening Glam",
      duration: "15 min", 
      difficulty: "Intermediate",
      views: "89K"
    },
    {
      title: "Perfect Winged Eyeliner",
      duration: "6 min",
      difficulty: "Advanced",
      views: "234K"
    }
  ];

  const shades = [
    { name: "Classic Red", color: "bg-red-500", popular: true },
    { name: "Rose Pink", color: "bg-pink-500", popular: false },
    { name: "Berry Purple", color: "bg-purple-600", popular: true },
    { name: "Coral Sunset", color: "bg-orange-400", popular: false },
    { name: "Nude Beige", color: "bg-amber-200", popular: true },
    { name: "Deep Plum", color: "bg-purple-800", popular: false }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Express Yourself with
              <span className="block text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                Bold Beauty
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              From subtle everyday looks to glamorous statement styles, discover makeup 
              that celebrates your unique beauty and creativity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6">
                Shop Makeup
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6">
                Watch Tutorials
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect products for every look and occasion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                  <p className="text-gray-600 mb-3">{category.description}</p>
                  <p className="text-sm text-gray-500">{category.products} products</p>
                  <Button variant="ghost" className="mt-4 w-full group-hover:bg-gradient-to-r group-hover:from-purple-50 group-hover:to-pink-50">
                    Explore {category.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shade Selector */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Shade
            </h2>
            <p className="text-xl text-gray-600">
              Explore our extensive range of colors for every skin tone
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {shades.map((shade, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className={`w-16 h-16 ${shade.color} rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg border-4 border-white`}>
                  </div>
                  <p className="font-medium text-gray-800">{shade.name}</p>
                  {shade.popular && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                View All Shades
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Trending Now
            </h2>
            <p className="text-xl text-gray-600">
              Must-have makeup essentials loved by beauty enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Palette className="h-16 w-16 text-purple-300" />
                    </div>
                    {product.badge && (
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {product.badge}
                      </Badge>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-sm text-purple-600 font-medium">{product.category}</div>
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
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
                    <Button className="w-full mt-4">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold mb-4">
              Learn with Our Experts
            </h2>
            <p className="text-xl text-white/90">
              Step-by-step tutorials to master any look
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl mb-2">{tutorial.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
                    <span>{tutorial.duration}</span>
                    <span>•</span>
                    <span>{tutorial.difficulty}</span>
                    <span>•</span>
                    <span>{tutorial.views} views</span>
                  </div>
                  <Button variant="ghost" className="w-full text-white border-white/30 hover:bg-white/20">
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-gray-100">
              View All Tutorials
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Makeup;