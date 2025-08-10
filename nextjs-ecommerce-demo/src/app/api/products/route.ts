import { NextRequest, NextResponse } from 'next/server';

// Mock products database
const products = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 299.99,
    image: "/next.svg",
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    inStock: true,
    stock: 15
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "/vercel.svg",
    description: "Feature-rich smartwatch with health tracking",
    category: "Electronics",
    inStock: true,
    stock: 8
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 79.99,
    image: "/globe.svg",
    description: "Ergonomic aluminum laptop stand for better posture",
    category: "Accessories",
    inStock: true,
    stock: 25
  },
  {
    id: 4,
    name: "Wireless Mouse",
    price: 49.99,
    image: "/file.svg",
    description: "Precision wireless mouse with ergonomic design",
    category: "Accessories",
    inStock: false,
    stock: 0
  },
  {
    id: 5,
    name: "USB-C Hub",
    price: 89.99,
    image: "/window.svg",
    description: "Multi-port USB-C hub with 4K HDMI output",
    category: "Accessories",
    inStock: true,
    stock: 12
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 129.99,
    image: "/next.svg",
    description: "Portable Bluetooth speaker with premium sound",
    category: "Electronics",
    inStock: true,
    stock: 20
  }
];

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const inStock = searchParams.get('inStock');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    let filteredProducts = [...products];

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by stock status
    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    } else if (inStock === 'false') {
      filteredProducts = filteredProducts.filter(product => !product.inStock);
    }

    // Pagination
    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 10;
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limitNumber);

    // Simulate API delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalProducts,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1
        },
        filters: {
          category,
          search,
          inStock
        }
      },
      message: 'Products retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: 'An error occurred while retrieving products'
      },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (for demonstration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'description', 'category'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields
        },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      name: body.name,
      price: parseFloat(body.price),
      image: body.image || '/next.svg',
      description: body.description,
      category: body.category,
      inStock: body.inStock !== false,
      stock: body.stock || 0
    };

    // Add to products array (in a real app, this would be saved to a database)
    products.push(newProduct);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: 'Product created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
        message: 'An error occurred while creating the product'
      },
      { status: 500 }
    );
  }
}

// PUT /api/products - Update multiple products (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body; // Array of { id, ...updateFields }

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
          message: 'Updates must be an array'
        },
        { status: 400 }
      );
    }

    const updatedProducts = [];
    const errors = [];

    for (const update of updates) {
      const productIndex = products.findIndex(p => p.id === update.id);
      
      if (productIndex === -1) {
        errors.push({ id: update.id, error: 'Product not found' });
        continue;
      }

      // Update product
      products[productIndex] = { ...products[productIndex], ...update };
      updatedProducts.push(products[productIndex]);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return NextResponse.json({
      success: true,
      data: {
        updated: updatedProducts,
        errors
      },
      message: `${updatedProducts.length} products updated successfully`
    });
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update products',
        message: 'An error occurred while updating products'
      },
      { status: 500 }
    );
  }
}