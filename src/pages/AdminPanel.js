import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaUsers, 
  FaTshirt, 
  FaExchangeAlt, 
  FaChartBar,
  FaTrash,
  FaCheck,
  FaTimes,
  FaEye,
  FaBan,
  FaUserShield
} from 'react-icons/fa';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalSwaps: 0,
    pendingSwaps: 0
  });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, itemsRes, swapsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/items'),
        axios.get('/api/admin/swaps')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setItems(itemsRes.data);
      setSwaps(swapsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      await axios.put(`/api/admin/users/${userId}/${action}`);
      toast.success(`User ${action} successfully`);
      fetchAdminData();
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleItemAction = async (itemId, action) => {
    try {
      await axios.put(`/api/admin/items/${itemId}/${action}`);
      toast.success(`Item ${action} successfully`);
      fetchAdminData();
    } catch (error) {
      toast.error(`Failed to ${action} item`);
    }
  };

  const handleSwapAction = async (swapId, action) => {
    try {
      await axios.put(`/api/admin/swaps/${swapId}/${action}`);
      toast.success(`Swap ${action} successfully`);
      fetchAdminData();
    } catch (error) {
      toast.error(`Failed to ${action} swap`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-6">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-green-100">Manage users, items, and swaps</p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
                { id: 'users', label: 'Users', icon: FaUsers },
                { id: 'items', label: 'Items', icon: FaTshirt },
                { id: 'swaps', label: 'Swaps', icon: FaExchangeAlt }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <FaUsers className="text-3xl text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Users</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <FaTshirt className="text-3xl text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Total Items</p>
                        <p className="text-2xl font-bold text-green-900">{stats.totalItems}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <FaExchangeAlt className="text-3xl text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Total Swaps</p>
                        <p className="text-2xl font-bold text-purple-900">{stats.totalSwaps}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <FaExchangeAlt className="text-3xl text-orange-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-orange-600">Pending Swaps</p>
                        <p className="text-2xl font-bold text-orange-900">{stats.pendingSwaps}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {swaps.slice(0, 5).map((swap) => (
                      <div key={swap._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium">
                            {swap.requester.name} requested swap with {swap.owner.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {swap.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                  <FaUserShield className="text-green-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => handleUserAction(user._id, 'ban')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FaBan />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction(user._id, 'activate')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <FaCheck />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'items' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Item Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {item.images && item.images.length > 0 ? (
                                  <img
                                    src={`/uploads/${item.images[0]}`}
                                    alt={item.title}
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <FaTshirt className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                <div className="text-sm text-gray-500">{item.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.owner.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleItemAction(item._id, 'approve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleItemAction(item._id, 'reject')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'swaps' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Swap Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Swap Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Requester
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {swaps.map((swap) => (
                        <tr key={swap._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {swap.requestedItem.title} ↔ {swap.offeredItem.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(swap.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {swap.requester.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {swap.owner.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {swap.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {swap.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleSwapAction(swap._id, 'approve')}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <FaCheck />
                                  </button>
                                  <button
                                    onClick={() => handleSwapAction(swap._id, 'reject')}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FaTimes />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 