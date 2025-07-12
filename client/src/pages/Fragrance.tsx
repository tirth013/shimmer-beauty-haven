import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flower, Leaf, Wind, Sun, Moon, Star, Heart, Sparkles } from "lucide-react";

const Fragrance = () => {
  const fragranceCategories = [
    {
      icon: <Flower className="h-8 w-8" />,
      title: "Floral",
      description: "Romantic and feminine scents",
      notes: ["Rose", "Jasmine", "Peony"],
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Fresh",
      description: "Clean and energizing fragrances",
      notes: ["Citrus", "Green Tea", "Ocean"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Wind className="h-8 w-8" />,
      title: "Woody",
      description: "Warm and sophisticated aromas",
      notes: ["Sandalwood", "Cedar", "Amber"],
      color: "from-amber-600 to-orange-600"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Oriental",
      description: "Rich and exotic compositions",
      notes: ["Vanilla", "Spices", "Musk"],
      color: "from-purple-600 to-indigo-600"
    }
  ];

  const featuredFragrances = [
    {
      id: 1,
      name: "Midnight Rose Elixir",
      description: "A captivating blend of Bulgarian rose and midnight blooms",
      price: 145.00,
      originalPrice: 180.00,
      rating: 4.9,
      reviews: 256,
      badge: "Limited Edition",
      category: "Floral",
      size: "50ml",
      longevity: "8-10 hours"
    },
    {
      id: 2,
      name: "Ocean Breeze Essence",
      description: "Fresh marine notes with crisp bergamot and sea salt",
      price: 89.99,
      rating: 4.7,
      reviews: 189,
      badge: "Best Seller",
      category: "Fresh",
      size: "75ml",
      longevity: "6-8 hours"
    },
    {
      id: 3,
      name: "Amber Woods Luxury",
      description: "Rich amber with warm sandalwood and exotic spices",
      price: 225.00,
      rating: 4.8,
      reviews: 134,
      category: "Woody",
      size: "100ml",
      longevity: "10-12 hours"
    },
    {
      id: 4,
      name: "Vanilla Dreams",
      description: "Creamy vanilla with hints of caramel and white musk",
      price: 95.50,
      rating: 4.8,
      reviews: 423,
      badge: "New",
      category: "Oriental",
      size: "50ml",
      longevity: "8-10 hours"
    }
  ];

  const occasions = [
    {
      icon: <Sun className="h-6 w-6" />,
      title: "Daytime",
      description: "Light, fresh scents perfect for daily wear",
      suggestions: ["Citrus", "Floral", "Green"]
    },
    {
      icon: <Moon className="h-6 w-6" />,
      title: "Evening",
      description: "Rich, bold fragrances for special occasions",
      suggestions: ["Oriental", "Woody", "Amber"]
    }
  ];

  const topNotes = [
    { name: "Bergamot", description: "Bright citrus opening", color: "bg-yellow-200" },
    { name: "Rose Petals", description: "Romantic floral heart", color: "bg-pink-200" },
    { name: "Sandalwood", description: "Warm woody base", color: "bg-amber-200" },
    { name: "Vanilla", description: "Sweet comfort note", color: "bg-orange-200" },
    { name: "Sea Salt", description: "Fresh marine accord", color: "bg-blue-200" },
    { name: "White Musk", description: "Clean, powdery finish", color: "bg-gray-200" }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Your
              <span className="block text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                Signature Scent
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Explore our curated collection of luxury fragrances, each carefully crafted 
              to capture emotions, memories, and moments that define you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6">
                Shop Fragrances
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6">
                Fragrance Quiz
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Fragrance Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Explore Fragrance Families
            </h2>
            <p className="text-xl text-gray-600">
              Find your perfect scent by discovering different fragrance categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fragranceCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {category.notes.map((note, noteIndex) => (
                      <Badge key={noteIndex} variant="outline" className="text-xs">
                        {note}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full">
                    Explore {category.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fragrance Notes Guide */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Understanding Fragrance Notes
            </h2>
            <p className="text-xl text-gray-600">
              Discover the building blocks that create your favorite scents
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {topNotes.map((note, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className={`w-16 h-16 ${note.color} rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg border-4 border-white flex items-center justify-center`}>
                    <Sparkles className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="font-medium text-gray-800 text-sm">{note.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{note.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Learn About Fragrance Notes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fragrances */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Luxury Collection
            </h2>
            <p className="text-xl text-gray-600">
              Premium fragrances for the discerning scent connoisseur
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredFragrances.map((fragrance) => (
              <Card key={fragrance.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <Wind className="h-16 w-16 text-indigo-300" />
                    </div>
                    {fragrance.badge && (
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {fragrance.badge}
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
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-indigo-600 font-medium">{fragrance.category}</div>
                      <div className="text-sm text-gray-500">{fragrance.size}</div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                      {fragrance.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {fragrance.description}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(fragrance.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {fragrance.rating} ({fragrance.reviews})
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Longevity: {fragrance.longevity}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">${fragrance.price}</span>
                      {fragrance.originalPrice && (
                        <span className="text-gray-500 line-through">
                          ${fragrance.originalPrice}
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

      {/* Occasions Guide */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold mb-4">
              Perfect Scent for Every Moment
            </h2>
            <p className="text-xl text-white/90">
              Choose the right fragrance for any occasion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {occasions.map((occasion, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    {occasion.icon}
                  </div>
                  <CardTitle className="text-2xl mb-3">{occasion.title}</CardTitle>
                  <p className="text-white/90 mb-4">{occasion.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {occasion.suggestions.map((suggestion, suggestionIndex) => (
                      <Badge key={suggestionIndex} variant="outline" className="border-white/30 text-white">
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" className="text-white border-white/30 hover:bg-white/20">
                    Shop {occasion.title} Fragrances
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Fragrance
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Take our personalized fragrance quiz and discover scents that match 
            your personality, style, and preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-6">
              Take Fragrance Quiz
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Fragrance;