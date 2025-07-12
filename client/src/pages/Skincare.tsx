import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Leaf, Shield, Sparkles, Star, Heart } from "lucide-react";

const Skincare = () => {
  const benefits = [
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "Deep Hydration",
      description: "Advanced moisture-locking formulas that keep your skin hydrated all day long."
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Natural Ingredients",
      description: "99% natural and organic ingredients sourced from sustainable farms worldwide."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Anti-Aging Protection",
      description: "Powerful antioxidants and peptides that combat signs of aging effectively."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Radiant Glow",
      description: "Restore your skin's natural luminosity and achieve that coveted healthy glow."
    }
  ];

  const products = [
    {
      id: 1,
      name: "Vitamin C Brightening Serum",
      description: "Powerful vitamin C serum that brightens and evens skin tone",
      price: 89.99,
      rating: 4.9,
      reviews: 234,
      badge: "Best Seller",
      category: "Serums"
    },
    {
      id: 2,
      name: "Hydrating Rose Water Toner",
      description: "Gentle toner infused with organic rose water and hyaluronic acid",
      price: 45.50,
      rating: 4.7,
      reviews: 156,
      badge: "New",
      category: "Toners"
    },
    {
      id: 3,
      name: "Retinol Renewal Night Cream",
      description: "Anti-aging night cream with encapsulated retinol for sensitive skin",
      price: 125.00,
      rating: 4.8,
      reviews: 189,
      category: "Moisturizers"
    },
    {
      id: 4,
      name: "Gentle Foam Cleanser",
      description: "Sulfate-free cleanser that removes impurities without stripping skin",
      price: 32.99,
      rating: 4.6,
      reviews: 298,
      category: "Cleansers"
    }
  ];

  const skinTypes = [
    { name: "Dry Skin", description: "Nourishing formulas for intense hydration", color: "bg-blue-100 text-blue-800" },
    { name: "Oily Skin", description: "Oil-control products for balanced complexion", color: "bg-green-100 text-green-800" },
    { name: "Sensitive Skin", description: "Gentle, hypoallergenic skincare solutions", color: "bg-pink-100 text-pink-800" },
    { name: "Combination Skin", description: "Balanced care for mixed skin concerns", color: "bg-purple-100 text-purple-800" }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Skin with
              <span className="block text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                Science & Nature
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover our clinically-proven skincare collection featuring botanical ingredients 
              and cutting-edge formulations for healthy, radiant skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6">
                Shop Skincare
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6">
                Take Skin Quiz
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Skincare?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each product is carefully formulated with clinically-proven ingredients 
              to deliver visible results you can trust.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow group">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-emerald-600">
                      {benefit.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-3">{benefit.title}</CardTitle>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skin Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Match
            </h2>
            <p className="text-xl text-gray-600">
              Personalized skincare solutions for every skin type and concern
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skinTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Badge className={`mb-4 ${type.color}`} variant="secondary">
                    {type.name}
                  </Badge>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                    {type.description}
                  </p>
                  <Button variant="ghost" className="mt-4 w-full">
                    Explore Products
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Bestselling Skincare
            </h2>
            <p className="text-xl text-gray-600">
              Customer favorites that deliver proven results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="w-full h-64 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <Droplets className="h-16 w-16 text-emerald-300" />
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
                    <div className="text-sm text-emerald-600 font-medium">{product.category}</div>
                    <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
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
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">${product.price}</span>
                      <Button size="sm">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl font-bold mb-4">
            Start Your Skincare Journey Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get personalized product recommendations and expert skincare advice 
            tailored to your unique needs and concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-emerald-600 hover:bg-gray-100">
              Free Skin Consultation
            </Button>
            <Button size="lg" variant="ghost" className="text-white border-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Skincare;