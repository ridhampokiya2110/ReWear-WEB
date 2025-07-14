import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaLeaf, 
  FaHeart,
  FaExchangeAlt,
  FaStar
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    condition: ''
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.category) params.append('category', filters.category);
      if (filters.size) params.append('size', filters.size);
      if (filters.condition) params.append('condition', filters.condition);

      const response = await axios.get(`/api/items?${params.toString()}`);
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const categories = ['Outerwear', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sustainable py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Items
          </h1>
          <p className="text-gray-600">
            Discover amazing pre-loved clothing from our sustainable community
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="card mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for items..."
                className="input-field pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  value={filters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Sizes</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Conditions</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button type="submit" className="btn-primary flex items-center space-x-2">
                <FaSearch />
                <span>Search</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ category: '', size: '', condition: '' });
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {items.length} items found
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <FaLeaf className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or check back later for new items.
              </p>
              <Link to="/add-item" className="btn-primary">
                List an Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="card group cursor-pointer hover:shadow-lg transition-all duration-300"
                >
                  <Link to={`/item/${item.id}`}>
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                      {item.images && item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                          <FaLeaf className="text-4xl text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="badge badge-success text-xs">
                            {item.condition}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.size}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaStar className="text-accent-500 text-sm" />
                          <span className="text-sm font-medium text-primary-600">
                            {item.points} pts
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-500">
                          {item.category} • {item.type}
                        </span>
                        <div className="flex items-center space-x-1 text-primary-600">
                          <FaExchangeAlt className="text-sm" />
                          <span className="text-xs font-medium">Available</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BrowseItems; 