import { Product } from '../types/products.types';

export interface CategoriesInfo {
  [key: string]: {
    count: number;
    subcategories: { [key: string]: number };
  };
}

function getCategoriesInfo(products: Product[]): CategoriesInfo {
  const uniqueCategories: CategoriesInfo = {};

  products.forEach((product) => {
    const levels = product.categories;
    const level1 = levels[0];
    const level2 = levels[1];

    if (!uniqueCategories[level1]) {
      uniqueCategories[level1] = { count: 0, subcategories: {} };
    }

    uniqueCategories[level1].count += 1;

    if (level2) {
      if (!uniqueCategories[level1].subcategories[level2]) {
        uniqueCategories[level1].subcategories[level2] = 0;
      }
      uniqueCategories[level1].subcategories[level2] += 1;
    }
  });

  return uniqueCategories;
}

function getBrandsInfo(products: Product[]): { [key: string]: number } {
  const brandCountMap: { [key: string]: number } = {};

  products.forEach((product) => {
    const { brand } = product;
    if (brand) {
      brandCountMap[brand] = (brandCountMap[brand] || 0) + 1;
    }
  });

  return brandCountMap;
}

function getMinMaxPrice(products: Product[]):{ minPrice: number, maxPrice: number } {
  if (products.length === 0) return { minPrice: 1, maxPrice: 1500 };

  const prices = products.map((product) => product.price);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return { minPrice, maxPrice };
}

function getRatingCount(products: Product[]): Record<number, number> {
  const counts: Record<number, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  products.forEach((product) => {
    const { rating } = product;
    if (rating >= 0 && rating <= 5) {
      counts[rating] += 1;
    }
  });

  return counts;
}

export {
  getCategoriesInfo, getBrandsInfo, getMinMaxPrice, getRatingCount,
};
