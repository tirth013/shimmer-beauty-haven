import React, { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Filter, Star, Loader2, X, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import Axios from '@/utils/Axios';
import SummaryApi from '@/common/summaryApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/use-debounce";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

// Interfaces for type safety
interface Product {
  _id: string; name: string; price: number; originalPrice?: number;
  slug: string;
  images: Array<{ url: string }>;
  ratings: { average: number; numOfReviews: number; };
  category: { _id: string; name: string; };
  brand: string; createdAt: string;
}

interface Category {
  _id: string; name: string; productsCount: number;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Filtering and Sorting State
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt-desc');

  const debouncedPriceRange = useDebounce(priceRange, 500);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetching Logic
  const fetchProducts = useCallback(async (page: number, newFilters = false) => {
    if (page === 1) setLoading(true); else setLoadingMore(true);
    setError(null);

    try {
      const [sortField, sortOrder] = sortBy.split('-');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy: sortField,
        sortOrder: sortOrder || 'desc',
        minPrice: debouncedPriceRange[0].toString(),
        maxPrice: debouncedPriceRange[1].toString(),
        isActive: 'true', // Always fetch only active products
      });
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (rating > 0) params.append('minRating', rating.toString());

      const response = await Axios.get(`${SummaryApi.getAllProducts.url}?${params.toString()}`);

      if (response.data.success) {
        const { products: newProducts, pagination } = response.data.data;
        setProducts(prev => newFilters ? newProducts : [...prev, ...newProducts]);
        setTotalProducts(pagination.totalProducts);
        setHasMore(pagination.hasNext);
        setCurrentPage(page);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (err) {
      setError("Could not load products. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, debouncedPriceRange, rating, sortBy]);

  // Effects for data fetching
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Axios.get(SummaryApi.getAllCategories.url);
        if (response.data.success) {
          const allProductsCategory = { _id: 'all', name: 'All Products', productsCount: totalProducts };
          setCategories([allProductsCategory, ...response.data.data]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [totalProducts]);

  useEffect(() => {
    fetchProducts(1, true);
  }, [fetchProducts]);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchProducts(currentPage + 1);
    }
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setPriceRange([0, 500]);
    setRating(0);
    setSortBy('featured-desc');
  };
  
  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-sm">
          <X className="h-4 w-4 mr-1"/> Clear All
        </Button>
      </div>

      <Separator />

      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
          {categories.length > 1 ? (
            categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`w-full text-left p-2 rounded-md transition-colors text-sm ${
                  activeCategory === category._id
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'hover:bg-muted/50'
                }`}
              >
                {category.name}
              </button>
            ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full mt-1" />)
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-medium mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={1000}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <Separator />
      
      <div>
        <h4 className="font-medium mb-4">Rating</h4>
        <div className="flex items-center space-x-1">
          {[5, 4, 3, 2, 1].map(star => (
            <button key={star} onClick={() => setRating(star)}
              className={`flex items-center p-2 rounded-md transition-colors border ${rating === star ? 'bg-amber-100 border-amber-300' : 'hover:bg-muted/50'}`}
            >
              <span className="text-sm">{star}</span>
              <Star className={`h-4 w-4 ml-1 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="relative bg-gradient-to-r from-rose-50 to-pink-50 py-20">
        <div className="container mx-auto px-4 text-center">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Shop Our Collection
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover luxury beauty products crafted with the finest ingredients.
            </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:w-1/4 sticky top-24">
              <div className="bg-card rounded-xl border p-6">
                <FilterContent />
              </div>
            </aside>

            {/* Products Section */}
            <main className="w-full lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-playfair font-bold">
                    {categories.find(c => c._id === activeCategory)?.name || 'Products'}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Showing {products.length} of {totalProducts} products
                  </p>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Mobile Filter Trigger */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden w-full sm:w-auto">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[300px] sm:w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Filter Products</SheetTitle>
                      </SheetHeader>
                      <div className="p-4">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured-desc">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="createdAt-desc">Newest</SelectItem>
                      <SelectItem value="rating-desc">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="space-y-2"><Skeleton className="h-64 w-full" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center text-destructive py-10">{error}</div>
              ) : products.length === 0 ? (
                <div className="text-center text-muted-foreground py-20 rounded-lg bg-muted/50">
                    <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
                    <p>Try adjusting your filters to find what you're looking for.</p>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    const isNew = new Date(product.createdAt) > thirtyDaysAgo;
                    return <ProductCard key={product._id} id={product._id} slug={product.slug} name={product.name} price={product.price} originalPrice={product.originalPrice} image={product.images[0]?.url || ''} rating={product.ratings.average} reviews={product.ratings.numOfReviews} category={product.category.name} isSale={!!(product.originalPrice && product.originalPrice > product.price)} isNew={isNew} />;
                  })}
                </div>
              )}

              {hasMore && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={loadingMore}>
                    {loadingMore ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</> : 'Load More Products'}
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
