import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-beauty.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beauty products with natural elements"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Discover Your
          <span className="block bg-gradient-luxury bg-clip-text text-transparent">
            Natural Glow
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in">
          Premium skincare and cosmetics crafted with the finest natural ingredients 
          to enhance your unique beauty.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button size="lg" variant="luxury" className="px-8 py-6 text-lg">
            Shop Collection
          </Button>
          <Button size="lg" variant="hero" className="px-8 py-6 text-lg">
            Discover More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
          <div className="text-center">
            <div className="text-3xl font-bold font-playfair">100+</div>
            <div className="text-white/80">Premium Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold font-playfair">50K+</div>
            <div className="text-white/80">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold font-playfair">99%</div>
            <div className="text-white/80">Natural Ingredients</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;