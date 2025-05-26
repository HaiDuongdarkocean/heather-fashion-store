import { formatNumber, formatDate, parsePrice } from "./util.js";

// ====== DATA ACCESS ======
const {
  productVariants,
  products,
  subcategories,
  productTags,
  tags,
  variantDiscounts,
  discounts,
} = db;

function addProduct(product) {
  if (!product || !product.productId) return false;
  // Kiểm tra xem sản phẩm đã tồn tại chưa
  const existingProduct = products.find(
    (p) => p.productId === product.productId
  );
  if (existingProduct) {
    // Nếu đã tồn tại, cập nhật thông tin sản phẩm
    Object.assign(existingProduct, product);
  } else {
    // Nếu chưa tồn tại, thêm sản phẩm mới
    products.push(product);
  }
  return true;
}

function getProductDetailsById(productId) {
  const product = products.find((p) => p.productId === productId);
  if (!product) return null;

  const variants = productVariants.filter((v) => v.productId === productId);
  const subcategory = subcategories.find(
    (sc) => sc.subcategoryId === product.subcategoryId
  );

  const tagIds = productTags
    .filter((pt) => pt.productId === productId)
    .map((pt) => pt.tagId);
  const productRelatedTags = tags.filter((t) => tagIds.includes(t.tagId));

  const variantIds = variants.map((v) => v.productVariantId);
  const variantDiscountList = variantDiscounts.filter((vd) =>
    variantIds.includes(vd.productVariantId)
  );
  const discountIds = variantDiscountList.map((vd) => vd.discountId);
  const relatedDiscounts = discounts.filter((d) =>
    discountIds.includes(d.discountId)
  );

  const enrichedVariants = variants.map((variant) => {
    const discountLink = variantDiscountList.find(
      (vd) => vd.productVariantId === variant.productVariantId
    );
    const discount = discountLink
      ? relatedDiscounts.find((d) => d.discountId === discountLink.discountId)
      : null;

    const originalPrice = variant.price;
    let priceAfterDiscount = originalPrice;

    if (discount && discount.discountType === "percentage") {
      priceAfterDiscount =
        originalPrice - (originalPrice * discount.value) / 100;
    }

    return {
      ...variant,
      price: formatNumber(originalPrice),
      priceAfterDiscount: formatNumber(priceAfterDiscount),
      discount: discount
        ? {
            ...discount,
            startDate: formatDate(discount.startDate),
            endDate: formatDate(discount.endDate),
            createdAt: formatDate(discount.createdAt),
            updatedAt: formatDate(discount.updatedAt),
          }
        : null,
      createdAt: formatDate(variant.createdAt),
      updatedAt: formatDate(variant.updatedAt),
    };
  });

  return {
    ...product,
    createdAt: formatDate(product.createdAt),
    updatedAt: formatDate(product.updatedAt),
    subcategory: {
      ...subcategory,
      createdAt: formatDate(subcategory.createdAt),
      updatedAt: formatDate(subcategory.updatedAt),
    },
    variants: enrichedVariants,
    tags: productRelatedTags.map((tag) => ({
      ...tag,
      createdAt: formatDate(tag.createdAt),
      updatedAt: formatDate(tag.updatedAt),
    })),
  };
}

function getAllProducts() {
  return products.map((p) => getProductDetailsById(p.productId));
}

function updateProduct(productId, updatedFields) {
  const productIndex = products.findIndex((p) => p.productId === productId);
  if (productIndex === -1) return false;
  // Cập nhật các trường thông tin của sản phẩm
  Object.assign(products[productIndex], updatedFields);
  return true;
}

function deleteProductById(productId) {
  const productIndex = products.findIndex((p) => p.productId === productId);
  if (productIndex === -1) return false;

  // Xóa sản phẩm khỏi mảng products
  products.splice(productIndex, 1);

  // Xóa các biến thể liên quan
  const variantsToDelete = productVariants.filter(
    (v) => v.productId === productId
  );
  variantsToDelete.forEach((variant) => {
    const variantIndex = productVariants.indexOf(variant);
    if (variantIndex !== -1) {
      productVariants.splice(variantIndex, 1);
    }
  });

  // Xóa các liên kết tag
  const tagsToDelete = productTags.filter((pt) => pt.productId === productId);
  tagsToDelete.forEach((tagLink) => {
    const tagIndex = productTags.indexOf(tagLink);
    if (tagIndex !== -1) {
      productTags.splice(tagIndex, 1);
    }
  });

  return true;
}

export { addProduct, getProductDetailsById, getAllProducts, updateProduct, deleteProductById };
