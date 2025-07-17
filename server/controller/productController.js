// server/controller/productController.js
const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const uploadImageCloudinary = require("../utils/uploadImageCloudinary");

/**
 * Create a new product (Admin only)
 * @route POST /api/product/create
 */
const createProduct = asyncHandler(async (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing request body.",
    });
  }

  const {
    name,
    description,
    shortDescription,
    price,
    originalPrice,
    category,
    brand,
    sku,
    specifications,
    tags,
    isFeatured, // Added isFeatured to destructuring
  } = req.body;

  const images = req.files; // Multiple images

  // Validate required fields
  if (!name || !description || !price || !category || !brand || !sku) {
    return res.status(400).json({
      success: false,
      message: "Required fields: name, description, price, category, brand, sku.",
    });
  }

  if (!images || images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one product image is required.",
    });
  }

  // Check if category exists
  const categoryExists = await CategoryModel.findById(category);
  if (!categoryExists) {
    return res.status(400).json({
      success: false,
      message: "Category not found.",
    });
  }

  // Check if SKU already exists
  const existingProduct = await ProductModel.findOne({ sku });
  if (existingProduct) {
    return res.status(409).json({
      success: false,
      message: "Product with this SKU already exists.",
    });
  }

  // Upload images to Cloudinary
  let uploadedImages = [];
  try {
    for (let image of images) {
      const upload = await uploadImageCloudinary(image);
      uploadedImages.push({
        public_id: upload.public_id,
        url: upload.url,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
      error: err.message,
    });
  }

  // Parse specifications if it's a string
  let parsedSpecifications = specifications;
  if (typeof specifications === 'string') {
    try {
      parsedSpecifications = JSON.parse(specifications);
    } catch (err) {
      parsedSpecifications = {};
    }
  }

  // Parse tags if it's a string
  let parsedTags = tags;
  if (typeof tags === 'string') {
    try {
      parsedTags = JSON.parse(tags);
    } catch (err) {
      parsedTags = tags.split(',').map(tag => tag.trim());
    }
  }

  // Create product
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const productData = {
    name,
    description,
    shortDescription,
    price,
    originalPrice,
    category,
    brand,
    sku: sku.toUpperCase(),
    images: uploadedImages,
    specifications: parsedSpecifications || {},
    tags: parsedTags || [],
    slug,
    isFeatured: isFeatured === 'true', // Correctly handle the isFeatured flag
  };

  const newProduct = new ProductModel(productData);
  await newProduct.save();

  // Populate category details
  await newProduct.populate('category', 'name slug');

  return res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: newProduct,
  });
});

/**
 * Get all products with filtering and pagination
 * @route GET /api/product/all
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    page = 1,
    limit = 12,
    search,
    isActive,
  } = req.query;

  // Build filter object
  let filter = {};

  if (category) filter.category = category;
  if (brand) filter.brand = new RegExp(brand, 'i');
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  // Build sort object
  let sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1; // Default sort by newest
  }

  // Pagination
  const skip = (page - 1) * limit;

  const products = await ProductModel.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const totalProducts = await ProductModel.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);

  return res.json({
    success: true,
    message: "Products retrieved successfully.",
    data: {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
});

/**
 * Get single product by ID or slug
 * @route GET /api/product/:identifier
 */
const getProductById = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  let product;

  // Check if identifier is a valid ObjectId
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    product = await ProductModel.findById(identifier);
  } else {
    // Search by slug
    product = await ProductModel.findOne({ slug: identifier });
  }

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  // Populate category details
  await product.populate('category', 'name slug');

  return res.json({
    success: true,
    message: "Product retrieved successfully.",
    data: product,
  });
});

/**
 * Update product (Admin only)
 * @route PUT /api/product/:id
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    shortDescription,
    price,
    originalPrice,
    category,
    brand,
    sku,
    specifications,
    tags,
    isActive,
    isFeatured, // Added isFeatured to destructuring
  } = req.body;

  const images = req.files; // New images if provided

  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing request body.",
    });
  }

  const product = await ProductModel.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  let updateFields = {};

  // Update basic fields
  if (name) updateFields.name = name;
  if (description) updateFields.description = description;
  if (shortDescription !== undefined) updateFields.shortDescription = shortDescription;
  if (price) updateFields.price = price;
  if (originalPrice !== undefined) updateFields.originalPrice = originalPrice;
  if (brand) updateFields.brand = brand;
  if (isActive !== undefined) updateFields.isActive = isActive === 'true';
  if (isFeatured !== undefined) { // Correctly handle the isFeatured flag
    updateFields.isFeatured = isFeatured === 'true';
  }

  // Update category if provided
  if (category && category !== String(product.category)) {
    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found.",
      });
    }
    updateFields.category = category;
  }

  // Update SKU if provided
  if (sku && sku !== product.sku) {
    const existingProduct = await ProductModel.findOne({ 
      sku: sku.toUpperCase(), 
      _id: { $ne: id } 
    });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product with this SKU already exists.",
      });
    }
    updateFields.sku = sku.toUpperCase();
  }

  // Update specifications
  if (specifications) {
    let parsedSpecifications = specifications;
    if (typeof specifications === 'string') {
      try {
        parsedSpecifications = JSON.parse(specifications);
      } catch (err) {
        parsedSpecifications = {};
      }
    }
    updateFields.specifications = parsedSpecifications;
  }

  // Update tags
  if (tags) {
    let parsedTags = tags;
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (err) {
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }
    updateFields.tags = parsedTags;
  }

  // Update images if provided
  if (images && images.length > 0) {
    try {
      let uploadedImages = [];
      for (let image of images) {
        const upload = await uploadImageCloudinary(image);
        uploadedImages.push({
          public_id: upload.public_id,
          url: upload.url,
        });
      }
      updateFields.images = uploadedImages;
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed.",
        error: err.message,
      });
    }
  }

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid fields provided for update.",
    });
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    id,
    updateFields,
    { new: true, runValidators: true }
  ).populate('category', 'name slug');

  return res.json({
    success: true,
    message: "Product updated successfully.",
    data: updatedProduct,
  });
});

/**
 * Delete product (Admin only)
 * @route DELETE /api/product/:id
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  await ProductModel.findByIdAndDelete(id);

  return res.json({
    success: true,
    message: "Product deleted successfully.",
  });
});

/**
 * Get products by category
 * @route GET /api/product/category/:categoryId
 */
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  }

  const skip = (page - 1) * limit;
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const products = await ProductModel.find({ 
    category: categoryId, 
    isActive: true 
  })
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const totalProducts = await ProductModel.countDocuments({ 
    category: categoryId, 
    isActive: true 
  });
  const totalPages = Math.ceil(totalProducts / limit);

  return res.json({
    success: true,
    message: "Products retrieved successfully.",
    data: {
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
      },
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
});

/**
 * Search products
 * @route GET /api/product/search
 */
const searchProducts = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Search query is required.",
    });
  }

  const skip = (page - 1) * limit;

  const products = await ProductModel.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } },
    ],
    isActive: true,
  })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalProducts = await ProductModel.countDocuments({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } },
    ],
    isActive: true,
  });

  const totalPages = Math.ceil(totalProducts / limit);

  return res.json({
    success: true,
    message: "Search results retrieved successfully.",
    data: {
      products,
      searchQuery: q,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
});

/**
 * Get featured products
 * @route GET /api/product/featured
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await ProductModel.find({ 
    isFeatured: true, 
    isActive: true 
  })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  return res.json({
    success: true,
    message: "Featured products retrieved successfully.",
    data: products,
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
};
