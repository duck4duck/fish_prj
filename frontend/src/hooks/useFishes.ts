import { useState, useEffect } from 'react';
import { Fish, FilterParams } from '../types/fish';
import { api } from '../services/api';

export const useFishes = (filters: FilterParams) => {
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [allFishes, setAllFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getFishes()
      .then((data) => setAllFishes(data))
      .catch((err) => console.error(err));
  }, []);

  const loadFishes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFishes(filters);
      setFishes(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load fish catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFishes();
    }, 180);
    return () => clearTimeout(timer);
  }, [
    filters.category,
    filters.water_type,
    filters.care_level,
    filters.search,
    filters.sort_by,
    filters.in_stock_only,
  ]);

  return {
    fishes,
    setFishes,
    allFishes,
    loading,
    error,
    refresh: loadFishes,
  };
};
