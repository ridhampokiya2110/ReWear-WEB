import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaLeaf, 
  FaRecycle, 
  FaHandshake, 
  FaStar, 
  FaArrowRight,
  FaHeart,
  FaGlobe,
  FaUsers
} from 'react-icons/fa';
import axios from 'axios';

const LandingPage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get('/api/items/featured');
        setFeaturedItems(response.data);
      } catch (error) {
        console.error('Failed to fetch featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const features = [
    {
      icon: <FaRecycle className="text-3xl" />,
      title: "Sustainable Fashion",
      description: "Give your clothes a second life and reduce textile waste through community exchange."
    },
    {
      icon: <FaHandshake className="text-3xl" />,
      title: "Direct Swaps",
      description: "Connect with other users to swap clothing items directly, no money involved."
    },
    {
      icon: <FaStar className="text-3xl" />,
      title: "Point System",
      description: "Earn points by listing items and redeem them for clothing you love."
    },
    {
      icon: <FaHeart className="text-3xl" />,
      title: "Community Driven",
      description: "Join a community of fashion-conscious individuals promoting sustainable practices."
    }
  ];

  const stats = [
    { number: "1000+", label: "Items Exchanged" },
    { number: "500+", label: "Happy Users" },
    { number: "50+", label: "Tons of Waste Saved" },
    { number: "24/7", label: "Community Support" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-green-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-6">
                <FaLeaf className="text-6xl text-primary-600" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to{' '}
                <span className="text-gradient">ReWear</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                The sustainable fashion platform where you can exchange, swap, and discover 
                pre-loved clothing while reducing textile waste and promoting circular fashion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                >
                  <span>Start Swapping</span>
                  <FaArrowRight />
                </Link>
                <Link 
                  to="/browse" 
                  className="btn-secondary text-lg px-8 py-3"
                >
                  Browse Items
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose ReWear?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the sustainable fashion revolution and make a positive impact on the environment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Items
            </h2>
            <p className="text-xl text-gray-600">
              Discover amazing pre-loved clothing from our community
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card group cursor-pointer hover:shadow-lg transition-all duration-300"
                >
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold">
                      {item.points} points
                    </span>
                    <span className="badge badge-success">
                      {item.condition}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/browse" 
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>View All Items</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-primary-100">
              Together, we're making a difference in sustainable fashion
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Sustainable Fashion Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users who are already making a positive impact on the environment 
              through sustainable fashion exchange.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <span>Join ReWear Today</span>
                <FaArrowRight />
              </Link>
              <Link 
                to="/browse" 
                className="btn-secondary text-lg px-8 py-3"
              >
                Explore Items
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 