import { Fish, FilterParams, CompatibilityResponse, OrderPayload, OrderResponse, Review } from '../types/fish';

const API_BASE = '/api';

export const api = {
  async getFishes(params: FilterParams = {}): Promise<Fish[]> {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.water_type && params.water_type !== 'All') query.append('water_type', params.water_type);
    if (params.care_level && params.care_level !== 'All') query.append('care_level', params.care_level);
    if (params.temperament && params.temperament !== 'All') query.append('temperament', params.temperament);
    if (params.search) query.append('search', params.search);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.in_stock_only) query.append('in_stock_only', 'true');

    const res = await fetch(`${API_BASE}/fish?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load fishes catalog');
    return res.json();
  },

  async getFishById(id: number): Promise<Fish> {
    const res = await fetch(`${API_BASE}/fish/${id}`);
    if (!res.ok) throw new Error('Failed to load fish details');
    return res.json();
  },

  async getCategories(): Promise<any> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  },

  async checkCompatibility(fishIds: number[]): Promise<CompatibilityResponse> {
    const res = await fetch(`${API_BASE}/compatibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fish_ids: fishIds }),
    });
    if (!res.ok) throw new Error('Failed to analyze compatibility');
    return res.json();
  },

  async createOrder(orderData: OrderPayload): Promise<OrderResponse> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create order' }));
      throw new Error(err.detail || 'Failed to create order');
    }
    return res.json();
  },

  async addReview(fishId: number, reviewData: { author_name: string; rating: number; comment: string }): Promise<Review> {
    const res = await fetch(`${API_BASE}/fish/${fishId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to add review' }));
      throw new Error(err.detail || 'Failed to add review');
    }
    return res.json();
  },
};
