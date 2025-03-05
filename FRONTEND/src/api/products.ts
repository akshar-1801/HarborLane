import api from "./api";

export interface Product {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  sub_category?: string;
  barcode: string;
  imageUrl: string;
  is_active: boolean;
  units_sold: number;
  created_at: string;
  updated_at: string;
}

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/product");
  return response.data;
};

// Fetch a product by barcode
export const fetchProductByBarcode = async (barcode: string): Promise<Product> => {
  const response = await api.get<Product>(`/product/barcode/${barcode}`);
  return response.data;
};
