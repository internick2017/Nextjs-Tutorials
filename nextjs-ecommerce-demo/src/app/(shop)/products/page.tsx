'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockProducts: Product[] = [
          {
            id: 1,
            name: 'Wireless Headphones',
            price: 99.99,
            description: 'High-quality wireless headphones with noise cancellation',
            image: '/api/placeholder/300/300',
            category: 'electronics',
            inStock: true,
            rating: 4.5,
            reviews: 128
          },
          {
            id: 2,
            name: 'Smart Watch',
            price: 199.99,
            description: 'Feature-rich smartwatch with health monitoring',
            image: '/api/placeholder/300/300',
            category: 'electronics',
            inStock: true,
            rating: 4.3,
            reviews: 89
          },
          {
            id: 3,
            name: 'Coffee Maker',
            price: 79.99,
            description: 'Programmable coffee maker with thermal carafe',
            image: '/api/placeholder/300/300',
            category: 'home',
            inStock: false,
            rating: 4.7,
            reviews: 203
          },
          {
            id: 4,
            name: 'Running Shoes',
            price: 129.99,
            description: 'Comfortable running shoes with advanced cushioning',
            image: '/api/placeholder/300/300',
            category: 'sports',
            inStock: true,
            rating: 4.6,
            reviews: 156
          },
          {
            id: 5,
            name: 'Laptop Stand',
            price: 49.99,
            description: 'Adjustable aluminum laptop stand for better ergonomics',
            image: '/api/placeholder/300/300',
            category: 'electronics',
            inStock: true,
            rating: 4.4,
            reviews: 67
          },
          {
            id: 6,
            name: 'Yoga Mat',
            price: 29.99,
            description: 'Non-slip yoga mat with carrying strap',
            image: '/api/placeholder/300/300',
            category: 'sports',
            inStock: true,
            rating: 4.2,
            reviews: 94
          }
        ];

        setProducts(mockProducts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to load products: ${err.message}`);
        } else {
          setError('Failed to load products: An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['all', 'electronics', 'home', 'sports'];

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCart = (productId: number) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Check if product already exists in cart
    const existingItem = existingCart.find((item: { id: number }) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const product = products.find(p => p.id === productId);
      if (product) {
        existingCart.push({ ...product, quantity: 1 });
      }
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));

    // Show success message (you could use a toast library here)
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <Link
              href="/cart"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={`star-${product.id}-${i}`}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    <div className="flex space-x-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={!product.inStock}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/*
Route Group: (shop)
This page is now organized under the (shop) route group,
which groups shopping-related pages together without
affecting the URL structure. The URL remains /products.

Next.js E-commerce Features Demonstrated:

1. **Product Listing**: Displays products in a responsive grid
2. **Search and Filtering**: Real-time search and category filtering
3. **Sorting**: Multiple sorting options for products
4. **Loading States**: Shows loading spinner during data fetch
5. **Error Handling**: Graceful error handling with retry option
6. **Local Storage**: Cart management using browser storage
7. **Image Optimization**: Uses Next.js Image component
8. **Responsive Design**: Works on all device sizes
9. **Product Rating**: Visual star rating display
10. **Stock Management**: Shows out-of-stock status
11. **Navigation**: Links to product details and cart
12. **Interactive UI**: Hover effects and transitions

This products page integrates with:
- Product detail pages
- Shopping cart functionality
- Local storage for cart persistence
- Next.js routing and navigation
*/