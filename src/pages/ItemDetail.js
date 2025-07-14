import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaHeart, 
  FaShare, 
  FaUser, 
  FaCalendar, 
  FaTag, 
  FaExchangeAlt,
  FaArrowLeft,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
        setItem(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load item');
        toast.error('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSwapRequest = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to request a swap');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/api/swaps/request`, {
        itemId: id,
        requesterId: user.id
      });
      toast.success('Swap request sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send swap request');
    }
  };

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact the owner');
      navigate('/login');
      return;
    }
    // Implement contact functionality
    toast.success('Contact feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Item Not Found</h2>
          <button
            onClick={() => navigate('/browse')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={`/uploads/${item.images[currentImageIndex]}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {item.images && item.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-green-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={`/uploads/${image}`}
                        alt={`${item.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </div>

              {/* Item Info */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FaTag className="mr-3 text-green-500" />
                  <span className="font-medium">Category:</span>
                  <span className="ml-2">{item.category}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FaCalendar className="mr-3 text-green-500" />
                  <span className="font-medium">Condition:</span>
                  <span className="ml-2 capitalize">{item.condition}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-3 text-green-500" />
                  <span className="font-medium">Owner:</span>
                  <span className="ml-2">{item.owner.name}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FaCalendar className="mr-3 text-green-500" />
                  <span className="font-medium">Listed:</span>
                  <span className="ml-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Size and Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-1">Size</h3>
                  <p className="text-gray-600">{item.size}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-1">Brand</h3>
                  <p className="text-gray-600">{item.brand || 'Unknown'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {user && item.owner._id === user.id ? (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-center">This is your item</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleSwapRequest}
                      className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      <FaExchangeAlt className="mr-2" />
                      Request Swap
                    </button>
                    
                    <button
                      onClick={handleContactOwner}
                      className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                    >
                      <FaEnvelope className="mr-2" />
                      Contact Owner
                    </button>
                  </>
                )}
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail; 