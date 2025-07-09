import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Categories = () => {
  const categories = [
    {
      name: "Skincare",
      description: "Nourish and protect your skin",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
      href: "/skincare",
    },
    {
      name: "Makeup",
      description: "Express your unique beauty",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600",
      href: "/makeup",
    },
    {
      name: "Fragrance",
      description: "Captivating scents for every mood",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
      href: "/fragrance",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our curated collections designed for your beauty journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card key={category.name} className="group cursor-pointer overflow-hidden hover:shadow-elegant transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-primary opacity-40 group-hover:opacity-30 transition-opacity duration-300" />
                
                <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
                  <div>
                    <h3 className="font-playfair text-3xl font-bold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/90 mb-4">{category.description}</p>
                    <Button variant="hero" className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;