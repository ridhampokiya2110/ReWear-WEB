import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaLeaf, 
  FaPlus, 
  FaSearch, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaHeart,
  FaExchangeAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [userItems, setUserItems] = useState([]);
  const [userSwaps, setUserSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [itemsResponse, swapsResponse] = await Promise.all([
        axios.get('/api/items/user/me'),
        axios.get('/api/swaps/me')
      ]);
      
      setUserItems(itemsResponse.data);
      setUserSwaps(swapsResponse.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setEditingProfile(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/items/${itemId}`);
        setUserItems(userItems.filter(item => item.id !== itemId));
        toast.success('Item deleted successfully');
      } catch (error) {
        console.error('Failed to delete item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const getSwapStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'accepted': return 'badge-info';
      case 'completed': return 'badge-success';
      case 'rejected': return 'badge-error';
      default: return 'badge-info';
    }
  };

  const getSwapStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-sm" />;
      case 'accepted': return <FaCheckCircle className="text-sm" />;
      case 'completed': return <FaCheckCircle className="text-sm" />;
      case 'rejected': return <FaTimesCircle className="text-sm" />;
      default: return <FaClock className="text-sm" />;
    }
  };

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
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your items, track your swaps, and continue your sustainable fashion journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-2xl text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FaLeaf className="text-primary-600" />
                    <span className="font-medium text-gray-900">Points Balance</span>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">{user?.points}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-accent-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FaHeart className="text-accent-600" />
                    <span className="font-medium text-gray-900">Items Listed</span>
                  </div>
                  <span className="text-2xl font-bold text-accent-600">{userItems.length}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FaExchangeAlt className="text-blue-600" />
                    <span className="font-medium text-gray-900">Active Swaps</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {userSwaps.filter(swap => swap.status === 'pending' || swap.status === 'accepted').length}
                  </span>
                </div>
              </div>

              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="btn-primary flex-1">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="btn-secondary w-full mt-6 flex items-center justify-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* My Items */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">My Items</h3>
                <Link to="/add-item" className="btn-primary flex items-center space-x-2">
                  <FaPlus />
                  <span>Add Item</span>
                </Link>
              </div>

              {userItems.length === 0 ? (
                <div className="text-center py-8">
                  <FaLeaf className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't listed any items yet.</p>
                  <Link to="/add-item" className="btn-primary">
                    List Your First Item
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center space-x-2">
                            <span className="badge badge-success">{item.condition}</span>
                            <span className="text-sm text-primary-600 font-medium">
                              {item.points} points
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Swaps */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">My Swaps</h3>

              {userSwaps.length === 0 ? (
                <div className="text-center py-8">
                  <FaExchangeAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No swap activity yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSwaps.map((swap) => (
                    <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`badge ${getSwapStatusColor(swap.status)} flex items-center space-x-1`}>
                              {getSwapStatusIcon(swap.status)}
                              <span className="capitalize">{swap.status}</span>
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(swap.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {swap.type === 'direct_swap' ? 'Direct Swap Request' : 'Points Redemption'}
                          </p>
                          {swap.message && (
                            <p className="text-sm text-gray-500 mt-1">"{swap.message}"</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 