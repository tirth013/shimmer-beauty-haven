import React, { useState, useRef, useEffect } from 'react';
import Axios from '@/utils/Axios';
import { Input } from './input';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';

interface SearchDropdownProps {
  open: boolean;
  onClose: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ categories: any[]; products: any[] }>({ categories: [], products: [] });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setQuery('');
      setResults({ categories: [], products: [] });
      setError('');
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ categories: [], products: [] });
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          Axios.get(`/api/category/search?q=${encodeURIComponent(query)}`),
          Axios.get(`/api/product/search?q=${encodeURIComponent(query)}&limit=10`),
        ]);
        setResults({
          categories: catRes.data.data || [],
          products: prodRes.data.data?.products || [],
        });
      } catch (err: any) {
        setError('Search failed.');
      } finally {
        setLoading(false);
      }
    }, 350);
    // Cleanup
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query]);

  const handleResultClick = (type: 'category' | 'product', slug: string) => {
    onClose();
    if (type === 'category') {
      navigate(`/category/${slug}`);
    } else {
      navigate(`/product/${slug}`);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 z-50 w-96 max-w-[95vw] rounded-xl bg-card shadow-elegant border border-border animate-fade-in"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for products or categories..."
          className="flex-1 bg-background border-none focus:ring-0 text-base"
        />
        <button
          onClick={onClose}
          className="ml-2 text-muted-foreground hover:text-primary text-lg font-bold"
          aria-label="Close search"
        >
          ×
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto px-2 py-2">
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="animate-spin h-6 w-6 text-primary" />
          </div>
        )}
        {!loading && error && (
          <div className="text-destructive text-center py-4 text-sm">{error}</div>
        )}
        {!loading && !error && query && (
          <>
            <div>
              <div className="text-xs font-semibold text-muted-foreground px-2 mb-1">Categories</div>
              {results.categories.length === 0 ? (
                <div className="text-muted-foreground text-sm px-2 pb-2">No categories found.</div>
              ) : (
                results.categories.map((cat) => (
                  <button
                    key={cat._id}
                    className="w-full text-left px-2 py-2 rounded-lg hover:bg-primary/10 transition-colors text-base"
                    onClick={() => handleResultClick('category', cat.slug)}
                  >
                    {cat.name}
                  </button>
                ))
              )}
            </div>
            <div className="mt-3">
              <div className="text-xs font-semibold text-muted-foreground px-2 mb-1">Products</div>
              {results.products.length === 0 ? (
                <div className="text-muted-foreground text-sm px-2 pb-2">No products found.</div>
              ) : (
                results.products.map((prod) => (
                  <button
                    key={prod._id}
                    className="w-full text-left px-2 py-2 rounded-lg hover:bg-primary/10 transition-colors text-base"
                    onClick={() => handleResultClick('product', prod.slug)}
                  >
                    {prod.name} <span className="text-xs text-muted-foreground">({prod.brand})</span>
                  </button>
                ))
              )}
            </div>
          </>
        )}
        {!loading && !error && !query && (
          <div className="text-muted-foreground text-center py-6 text-sm">Type to search for products or categories.</div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;
