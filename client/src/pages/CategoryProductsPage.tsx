import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import Axios from '@/utils/Axios';
import SummaryApi from '@/common/summaryApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Define the Product interface for type safety
interface Product {
  _id: string;
  name: string;
  slug: string; // Added slug
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
  createdAt: string;
}

const CategoryProductsPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProductsByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await Axios.get(`${SummaryApi.getProductsByCategory.url}/${categoryId}`);
        if (response.data.success) {
          setProducts(response.data.data.products);
          setCategoryName(response.data.data.category.name);
        } else {
          throw new Error('Failed to fetch products for this category.');
        }
      } catch (err) {
        setError('Could not load products. Please try again later.');
        console.error('Error fetching products by category:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <section className="py-12 bg-rose-50/50">
          <div className="container mx-auto px-4">
            <Link to="/#categories" className="inline-block mb-6">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Button>
            </Link>
            {loading ? (
              <Skeleton className="h-12 w-1/3" />
            ) : (
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900">
                {categoryName}
              </h1>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-10">{error}</div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  const isNew = new Date(product.createdAt) > thirtyDaysAgo;

                  return (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      slug={product.slug} // Passing the slug
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.images[0]?.url || ''}
                      rating={product.ratings.average}
                      reviews={product.ratings.numOfReviews}
                      category={product.category.name}
                      isSale={!!(product.originalPrice && product.originalPrice > product.price)}
                      isNew={isNew}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-20">
                <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
                <p>There are currently no products available in this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryProductsPage;
