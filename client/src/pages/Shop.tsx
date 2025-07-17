import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Grid, List, ShoppingBag, Star, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import Axios from '@/utils/Axios';
import SummaryApi from '@/common/summaryApi';

// Define the Product interface to match the data structure from the backend API.
interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: Array<{ url: string }>;
  ratings: {
    average: number;
    numOfReviews: number;
  };
  category: {
    _id: string;
    name: string;
  };
  brand: string;
  isSale?: boolean;
  isNew?: boolean;
  badge?: string;
  createdAt: string;
}

// Define the Category interface for the filter sidebar.
interface Category {
  _id: string;
  name: string;
  productsCount: number;
}

const Shop = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // New state variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  /**
   * Fetches the initial data for the shop page (first page of products and categories).
   */
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products and categories concurrently for better performance.
        const [productsResponse, categoriesResponse] = await Promise.all([
          Axios.get(`${SummaryApi.getAllProducts.url}?page=1`),
          Axios.get(SummaryApi.getAllCategories.url)
        ]);

        // Process products response.
        if (productsResponse.data.success) {
          setProducts(productsResponse.data.data.products);
          setTotalProducts(productsResponse.data.data.pagination.totalProducts);
          setHasMore(productsResponse.data.data.pagination.hasNext);
          setCurrentPage(1);
        } else {
          throw new Error("Failed to fetch products");
        }

        // Process categories response.
        if (categoriesResponse.data.success) {
          const allProductsCategory = {
            _id: 'all',
            name: 'All Products',
            productsCount: productsResponse.data.data.pagination.totalProducts
          };
          setCategories([allProductsCategory, ...categoriesResponse.data.data]);
        } else {
          throw new Error("Failed to fetch categories");
        }

      } catch (err) {
        setError("Could not load shop data. Please try again later.");
        console.error("Error fetching shop data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []); // Empty dependency array ensures this runs only on mount.

  /**
   * Handles the "Load More" button click to fetch the next page of products.
   */
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await Axios.get(`${SummaryApi.getAllProducts.url}?page=${nextPage}`);

      if (response.data.success) {
        // Append new products to the existing list.
        setProducts(prevProducts => [...prevProducts, ...response.data.data.products]);
        setCurrentPage(nextPage);
        setHasMore(response.data.data.pagination.hasNext);
      } else {
        throw new Error("Failed to fetch more products");
      }
    } catch (err) {
      setError("Could not load more products.");
      console.error("Error loading more products:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Filtered products based on the selected category.
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category._id === activeCategory);

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
              <div className="bg-white rounded-lg border p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                
                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Categories</h4>
                  <div className="space-y-2">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                    ) : (
                      categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => setActiveCategory(category._id)}
                          className={`w-full text-left p-2 rounded-md transition-colors ${
                            activeCategory === category._id
                              ? 'bg-rose-100 text-rose-800 font-semibold' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{category.name}</span>
                            <span className="text-sm text-gray-500">({category.productsCount})</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {activeCategory === 'all' ? 'All Products' : categories.find(c => c._id === activeCategory)?.name}
                  </h2>
                  <p className="text-gray-600">
                    Showing {filteredProducts.length} of {totalProducts} products
                  </p>
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

              {/* Product Grid/List */}
              {loading ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-64 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center text-destructive py-10">{error}</div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product) => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    const isNew = new Date(product.createdAt) > thirtyDaysAgo;

                    return (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        image={product.images[0]?.url || '/api/placeholder/300/300'}
                        rating={product.ratings.average}
                        reviews={product.ratings.numOfReviews}
                        category={product.category.name}
                        isSale={!!(product.originalPrice && product.originalPrice > product.price)}
                        isNew={isNew}
                      />
                    );
                  })}
                </div>
              )}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Products'
                    )}
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
