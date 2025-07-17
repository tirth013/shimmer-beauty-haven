import React, { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Grid, List, Star, Loader2, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import Axios from '@/utils/Axios';
import SummaryApi from '@/common/summaryApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/use-debounce";

// Interfaces for type safety
interface Product {
  _id: string; name: string; price: number; originalPrice?: number;
  images: Array<{ url: string }>;
  ratings: { average: number; numOfReviews: number; };
  category: { _id: string; name: string; };
  brand: string; createdAt: string;
}

interface Category {
  _id: string; name: string; productsCount: number;
}

const Shop = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // State for filters and sorting
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured-desc');

  // Debounce the price range to avoid excessive API calls while sliding
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  /**
   * Fetches products based on the current filter and sort states.
   * Can be used for both initial load and subsequent filtered fetches.
   */
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
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, debouncedPriceRange, rating, sortBy]);

  // Fetch categories on initial mount
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

  // Re-fetch products when filters change
  useEffect(() => {
    fetchProducts(1, true);
  }, [fetchProducts]);


  const handleLoadMore = () => {
    if (hasMore) {
      fetchProducts(currentPage + 1);
    }
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setPriceRange([0, 500]);
    setRating(0);
    setSortBy('featured-desc');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="relative bg-gradient-to-r from-rose-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Shop Our Premium Collection
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover luxury beauty products crafted with the finest ingredients.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg border p-6 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <h3 className="font-semibold">Filters</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <X className="h-4 w-4 mr-1"/> Clear
                  </Button>
                </div>
                
                {/* Categories Filter */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Categories</h4>
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                    {categories.length > 1 ? (
                      categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => setActiveCategory(category._id)}
                          className={`w-full text-left p-2 rounded-md transition-colors text-sm ${
                            activeCategory === category._id
                              ? 'bg-rose-100 text-rose-800 font-semibold' 
                              : 'hover:bg-gray-100'
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

                {/* Price Range Filter */}
                <div className="mb-8">
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

                {/* Rating Filter */}
                <div>
                  <h4 className="font-medium mb-4">Rating</h4>
                  <div className="flex items-center space-x-2">
                    {[5, 4, 3, 2, 1].map(star => (
                      <button key={star} onClick={() => setRating(star)}
                        className={`flex items-center p-1 rounded-md transition-colors ${rating === star ? 'bg-amber-100' : 'hover:bg-gray-100'}`}
                      >
                        {star} <Star className={`h-4 w-4 ml-1 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {categories.find(c => c._id === activeCategory)?.name || 'Products'}
                  </h2>
                  <p className="text-gray-600">
                    Showing {products.length} of {totalProducts} products
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
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
                  <div className="flex border rounded-md">
                    <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="space-y-2"><Skeleton className="h-64 w-full" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center text-destructive py-10">{error}</div>
              ) : products.length === 0 ? (
                <div className="text-center text-muted-foreground py-20">
                    <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
                    <p>Try adjusting your filters to find what you're looking for.</p>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map((product) => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    const isNew = new Date(product.createdAt) > thirtyDaysAgo;
                    return <ProductCard key={product._id} id={product._id} name={product.name} price={product.price} originalPrice={product.originalPrice} image={product.images[0]?.url || ''} rating={product.ratings.average} reviews={product.ratings.numOfReviews} category={product.category.name} isSale={!!(product.originalPrice && product.originalPrice > product.price)} isNew={isNew} />;
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
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
