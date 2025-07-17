// client/src/pages/Wishlist.tsx

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import Axios from '@/utils/Axios';
import SummaryApi from '@/common/summaryApi';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
    _id: string;
    name: string;
    slug: string;
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

const Wishlist = () => {
    const { isAuthenticated } = useAuth();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchWishlist = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await Axios.get(SummaryApi.getWishlist.url);
                if (response.data.success) {
                    setWishlist(response.data.wishlist);
                } else {
                    throw new Error('Failed to fetch wishlist.');
                }
            } catch (err) {
                setError('Could not load your wishlist. Please try again later.');
                console.error('Error fetching wishlist:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <>
                <Navigation />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-semibold">Please log in to see your wishlist.</h2>
                    <Link to="/login">
                        <Button variant="outline" className="mt-4">Login</Button>
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow">
                <section className="py-12 bg-rose-50/50">
                    <div className="container mx-auto px-4">
                        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 flex items-center gap-4">
                            <Heart className="h-10 w-10 text-rose-500" />
                            My Wishlist
                        </h1>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="space-y-4">
                                        <Skeleton className="h-64 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center text-destructive py-10">{error}</div>
                        ) : wishlist.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {wishlist.map((product) => {
                                    const thirtyDaysAgo = new Date();
                                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                    const isNew = new Date(product.createdAt) > thirtyDaysAgo;

                                    return (
                                        <ProductCard
                                            key={product._id}
                                            id={product._id}
                                            slug={product.slug}
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
                                <h3 className="text-2xl font-semibold mb-2">Your Wishlist is Empty</h3>
                                <p>Start adding products you love!</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Wishlist;