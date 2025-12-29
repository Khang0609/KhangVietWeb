export interface ProductOptionChoice {
  label: string;
  price_modifier: number;
}

export interface ProductOptionGroup {
  name: string;
  choices: ProductOptionChoice[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  category_id?: string;
  description?: string;
  highlights?: string[];
  options?: ProductOptionGroup[];
  type?: "ready" | "custom";
}
