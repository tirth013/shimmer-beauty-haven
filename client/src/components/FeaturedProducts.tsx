// import { Button } from "@/components/ui/button";
// import ProductCard from "./ProductCard";

// const FeaturedProducts = () => {
//   // Mock product data - in real app this would come from API
//   const featuredProducts = [
//     {
//       id: "1",
//       name: "Radiant Glow Vitamin C Serum",
//       price: 89,
//       originalPrice: 119,
//       image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
//       rating: 4.8,
//       reviews: 324,
//       category: "Skincare",
//       isNew: true,
//       isSale: true,
//     },
//     {
//       id: "2",
//       name: "Luxury Rose Gold Lipstick Set",
//       price: 65,
//       image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
//       rating: 4.9,
//       reviews: 156,
//       category: "Makeup",
//       isNew: true,
//     },
//     {
//       id: "3",
//       name: "Hydrating Botanical Face Mask",
//       price: 45,
//       image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400",
//       rating: 4.7,
//       reviews: 89,
//       category: "Skincare",
//     },
//     {
//       id: "4",
//       name: "Professional Makeup Brush Set",
//       price: 125,
//       originalPrice: 165,
//       image: "https://images.unsplash.com/photo-1503236024-ef0502c2fdb6?w=400",
//       rating: 4.6,
//       reviews: 203,
//       category: "Tools",
//       isSale: true,
//     },
//   ];

//   return (
//     <section className="py-16 bg-background">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
//             Featured Products
//           </h2>
//           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
//             Discover our handpicked selection of premium beauty products, 
//             crafted with the finest ingredients for exceptional results.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {featuredProducts.map((product) => (
//             <ProductCard key={product.id} {...product} />
//           ))}
//         </div>

//         <div className="text-center">
//           <Button size="lg" variant="outline" className="px-8">
//             View All Products
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import ProductCard from "./ProductCard";
import Axios from '../utils/Axios';
import SummaryApi from '../common/summaryApi';
import { Skeleton } from "./ui/skeleton";
import { Link } from "react-router-dom";

// Define the Product interface to match the structure of the data from the backend.
// This ensures type safety and helps with autocompletion.
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
  isFeatured?: boolean; // This property is used to filter featured products.
}

const FeaturedProducts = () => {
  // State to store the array of products fetched from the API.
  const [products, setProducts] = useState<Product[]>([]);
  // State to manage the loading status while fetching data.
  const [loading, setLoading] = useState(true);
  // State to store any error messages that occur during the fetch.
  const [error, setError] = useState<string | null>(null);

  /**
   * useEffect hook to fetch featured products when the component mounts.
   * It sets the loading state, makes an API call, and handles success or error cases.
   */
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using a centralized API summary for maintainability.
        const response = await Axios.get(SummaryApi.getFeaturedProducts.url);
        if (response.data.success) {
          // Update the state with the fetched products.
          setProducts(response.data.data);
        } else {
          // If the API returns a success: false, throw an error.
          throw new Error("Failed to fetch featured products");
        }
      } catch (err) {
        // Catch any network or other errors and update the error state.
        setError("Could not load products. Please try again later.");
        console.error("Error fetching featured products:", err);
      } finally {
        // Ensure loading is set to false after the fetch completes.
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium beauty products,
            crafted with the finest ingredients for exceptional results.
          </p>
        </div>

        {/* Conditional rendering based on the loading and error states. */}
        {loading ? (
          // Display skeleton loaders while the data is being fetched.
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          // Display an error message if the fetch failed.
          <div className="text-center text-destructive py-10">{error}</div>
        ) : (
          // Render the product cards once the data is successfully fetched.
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                // Use the first image from the images array, with a fallback.
                image={product.images[0]?.url || ''}
                rating={product.ratings.average}
                reviews={product.ratings.numOfReviews}
                category={product.category.name}
                // Determine if the product is on sale by comparing prices.
                isSale={product.originalPrice && product.originalPrice > product.price}
              />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/shop">
            <Button size="lg" variant="outline" className="px-8">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
