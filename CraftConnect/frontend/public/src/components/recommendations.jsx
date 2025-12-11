'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Star, TrendingUp, Eye, Heart, ShoppingCart, Filter, RefreshCw, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'

export default function Recommendations() {
  const { isDarkMode } = useTheme()
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'All Recommendations' },
    { id: 'trending', label: 'Trending Now' },
    { id: 'similar', label: 'Similar to Yours' },
    { id: 'price', label: 'Price Optimization' },
    { id: 'market', label: 'Market Insights' }
  ]

  const sampleRecommendations = [
    {
      id: 1,
      type: 'trending',
      title: 'Ceramic Planters are Trending',
      description: 'Indoor plant accessories have seen a 40% increase in demand this month.',
      action: 'Consider creating ceramic planters',
      impact: 'High',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      id: 2,
      type: 'similar',
      title: 'Similar Pottery Priced Higher',
      description: 'Comparable ceramic mugs in your area are selling for 20% more than your current pricing.',
      action: 'Review your pricing strategy',
      impact: 'Medium',
      icon: Star,
      color: 'bg-blue-500'
    },
    {
      id: 3,
      type: 'price',
      title: 'Seasonal Price Adjustment',
      description: 'Holiday season approaching - handmade items typically see 15% price premium.',
      action: 'Consider seasonal pricing',
      impact: 'Medium',
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      type: 'market',
      title: 'Local Art Fair Opportunity',
      description: 'Spring Arts Festival accepting applications until next month.',
      action: 'Submit your portfolio',
      impact: 'High',
      icon: Eye,
      color: 'bg-orange-500'
    },
    {
      id: 5,
      type: 'trending',
      title: 'Sustainable Materials Popular',
      description: 'Products highlighting eco-friendly materials get 35% more engagement.',
      action: 'Emphasize sustainability in descriptions',
      impact: 'Medium',
      icon: Heart,
      color: 'bg-green-600'
    },
    {
      id: 6,
      type: 'similar',
      title: 'Photo Enhancement Suggestion',
      description: 'Items with professional-quality photos sell 60% faster.',
      action: 'Upgrade your product photography',
      impact: 'High',
      icon: Eye,
      color: 'bg-indigo-500'
    }
  ]

  useEffect(() => {
    // Simulate loading recommendations
    setTimeout(() => {
      setRecommendations(sampleRecommendations)
      setIsLoading(false)
    }, 2000)
  }, [])

  const filteredRecommendations = filter === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === filter)

  const refreshRecommendations = () => {
    setIsLoading(true)
    setTimeout(() => {
      // Shuffle recommendations to simulate new data
      const shuffled = [...sampleRecommendations].sort(() => Math.random() - 0.5)
      setRecommendations(shuffled)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <motion.button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-orange-400 hover:bg-gray-800' 
                    : 'text-orange-700 hover:bg-orange-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </motion.button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
              }`}>Recommendations</h1>
              <p className={`text-lg transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Personalized insights to grow your craft business</p>
            </div>
            <Button onClick={refreshRecommendations} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {filters.map((filterItem) => (
                  <Button
                    key={filterItem.id}
                    variant={filter === filterItem.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(filterItem.id)}
                    className={filter === filterItem.id ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    {filterItem.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations Grid */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-64">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mt-4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRecommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 ${recommendation.color} rounded-lg flex items-center justify-center`}>
                        <recommendation.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recommendation.impact === 'High' 
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {recommendation.impact} Impact
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-4">{recommendation.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {recommendation.description}
                    </CardDescription>
                    <Button variant="outline" className="w-full">
                      {recommendation.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRecommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or refresh to see new recommendations
            </p>
            <Button onClick={() => setFilter('all')} variant="outline">
              Show All Recommendations
            </Button>
          </motion.div>
        )}

        {/* Insights Summary */}
        {!isLoading && filteredRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Insights Summary</CardTitle>
                <CardDescription>
                  Key trends and opportunities for your craft business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">3</div>
                    <p className="text-sm text-gray-600">High Impact Opportunities</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">40%</div>
                    <p className="text-sm text-gray-600">Potential Revenue Increase</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">2</div>
                    <p className="text-sm text-gray-600">Market Trends to Watch</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}