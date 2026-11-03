export interface Review {
  id: number;
  fish_id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Fish {
  id: number;
  name: string;
  scientific_name: string;
  category: string;
  water_type: string;
  price: number;
  discount_price?: number | null;
  image_url: string;
  temp_min: number;
  temp_max: number;
  ph_min: number;
  ph_max: number;
  min_tank_liters: number;
  temperament: string;
  care_level: string;
  diet: string;
  description: string;
  care_tips?: string | null;
  origin?: string | null;
  badge?: string | null;
  in_stock: boolean;
  stock_count: number;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  reviews?: Review[];
}

export interface CompatibilityIssue {
  type: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface CompatibilityResponse {
  is_compatible: boolean;
  status: string;
  score: number;
  recommendation: string;
  temp_range: string;
  ph_range: string;
  min_tank_liters: number;
  issues: CompatibilityIssue[];
  fishes: Fish[];
}

export interface CartItem {
  fish: Fish;
  quantity: number;
}

export interface OrderItemPayload {
  fish_id: number;
  quantity: number;
}

export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_method?: string;
  delivery_date?: string;
  notes?: string;
  items: OrderItemPayload[];
}

export interface OrderResponse {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_method: string;
  delivery_date?: string;
  total_amount: number;
  status: string;
  notes?: string;
  created_at: string;
}

export interface FilterParams {
  category?: string;
  water_type?: string;
  care_level?: string;
  temperament?: string;
  search?: string;
  sort_by?: string;
  in_stock_only?: boolean;
}
