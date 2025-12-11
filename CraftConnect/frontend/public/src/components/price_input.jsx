'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { DollarSign, TrendingUp, Calculator, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'

export default function PriceInput() {
  const { isDarkMode } = useTheme()
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    materials: '',
    timeSpent: '',
    materialCost: '',
    skillLevel: 'intermediate',
    uniqueness: 'moderate',
    marketDemand: 'moderate'
  })
  const [suggestedPrice, setSuggestedPrice] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const categories = [
    'Pottery & Ceramics',
    'Textiles & Fabric',
    'Woodworking',
    'Jewelry & Accessories',
    'Glass Art',
    'Metalwork',
    'Paper Crafts',
    'Leatherwork',
    'Other'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculatePrice = async () => {
    setIsCalculating(true)
    
    // Simulate AI price calculation
    setTimeout(() => {
      const baseCost = parseFloat(formData.materialCost) || 0
      const hourlyRate = formData.skillLevel === 'beginner' ? 15 : 
                        formData.skillLevel === 'intermediate' ? 25 : 35
      const timeMultiplier = parseFloat(formData.timeSpent) || 0
      const uniquenessMultiplier = formData.uniqueness === 'low' ? 1.1 : 
                                 formData.uniqueness === 'moderate' ? 1.3 : 1.6
      const demandMultiplier = formData.marketDemand === 'low' ? 0.9 : 
                              formData.marketDemand === 'moderate' ? 1.0 : 1.2

      const laborCost = hourlyRate * timeMultiplier
      const totalCost = (baseCost + laborCost) * uniquenessMultiplier * demandMultiplier
      const profit = totalCost * 0.3 // 30% profit margin
      const finalPrice = totalCost + profit

      setSuggestedPrice({
        recommended: Math.round(finalPrice),
        range: {
          min: Math.round(finalPrice * 0.8),
          max: Math.round(finalPrice * 1.2)
        },
        breakdown: {
          materialCost: baseCost,
          laborCost: Math.round(laborCost),
          profit: Math.round(profit),
          total: Math.round(finalPrice)
        },
        confidence: Math.random() > 0.3 ? 'high' : 'moderate'
      })
      setIsCalculating(false)
    }, 3000)
  }

  const isFormValid = formData.productName && formData.category && formData.materials && 
                     formData.timeSpent && formData.materialCost

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
          className="mb-8 text-center"
        >
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
          }`}>Price with Confidence</h1>
          <p className={`text-lg transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>AI-powered fair pricing for your artwork</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Product Details</span>
                </CardTitle>
                <CardDescription>
                  Tell us about your creation for accurate pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => handleInputChange('productName', e.target.value)}
                    placeholder="e.g., Hand-thrown Ceramic Mug"
                    className={`w-full px-3 py-2 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Materials Used
                  </label>
                  <textarea
                    value={formData.materials}
                    onChange={(e) => handleInputChange('materials', e.target.value)}
                    rows={3}
                    placeholder="List the main materials and techniques used"
                    className={`w-full px-3 py-2 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Time Spent (hours)
                    </label>
                    <input
                      type="number"
                      value={formData.timeSpent}
                      onChange={(e) => handleInputChange('timeSpent', e.target.value)}
                      placeholder="8"
                      min="0"
                      step="0.5"
                      className={`w-full px-3 py-2 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Material Cost ($)
                    </label>
                    <input
                      type="number"
                      value={formData.materialCost}
                      onChange={(e) => handleInputChange('materialCost', e.target.value)}
                      placeholder="25.00"
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Skill Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['beginner', 'intermediate', 'expert'].map(level => (
                      <button
                        key={level}
                        onClick={() => handleInputChange('skillLevel', level)}
                        className={`p-2 text-sm rounded-md border transition-all duration-300 ${
                          formData.skillLevel === level
                            ? isDarkMode
                              ? 'border-orange-500 bg-orange-900/20 text-orange-400'
                              : 'border-orange-500 bg-orange-50 text-orange-700'
                            : isDarkMode
                              ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Uniqueness Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['low', 'moderate', 'high'].map(level => (
                      <button
                        key={level}
                        onClick={() => handleInputChange('uniqueness', level)}
                        className={`p-2 text-sm rounded-md border transition-all duration-300 ${
                          formData.uniqueness === level
                            ? isDarkMode
                              ? 'border-orange-500 bg-orange-900/20 text-orange-400'
                              : 'border-orange-500 bg-orange-50 text-orange-700'
                            : isDarkMode
                              ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Market Demand
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['low', 'moderate', 'high'].map(level => (
                      <button
                        key={level}
                        onClick={() => handleInputChange('marketDemand', level)}
                        className={`p-2 text-sm rounded-md border transition-all duration-300 ${
                          formData.marketDemand === level
                            ? isDarkMode
                              ? 'border-orange-500 bg-orange-900/20 text-orange-400'
                              : 'border-orange-500 bg-orange-50 text-orange-700'
                            : isDarkMode
                              ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={calculatePrice}
                  disabled={isCalculating || !isFormValid}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {isCalculating ? (
                    <>
                      <Calculator className="mr-2 h-4 w-4 animate-pulse" />
                      Calculating Price...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Calculate Fair Price
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Price Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Pricing Recommendation</span>
                </CardTitle>
                <CardDescription>
                  AI-generated pricing based on your inputs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isCalculating ? (
                  <div className="space-y-6">
                    <div className="animate-pulse">
                      <div className={`h-20 rounded-lg mb-4 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-3/4 mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-1/2 mb-4 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-32 rounded-lg transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    <p className={`text-sm text-center transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Analyzing market data and calculating optimal price...
                    </p>
                  </div>
                ) : suggestedPrice ? (
                  <div className="space-y-6">
                    {/* Recommended Price */}
                    <div className={`text-center p-6 rounded-lg border transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-orange-900/20 to-yellow-900/20 border-orange-700/30' 
                        : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200'
                    }`}>
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        ${suggestedPrice.recommended}
                      </div>
                      <p className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Recommended Price</p>
                      <div className="flex items-center justify-center mt-2">
                        {suggestedPrice.confidence === 'high' ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">High Confidence</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Moderate Confidence</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className={`p-4 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <h4 className={`font-medium mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>Suggested Range</h4>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Min: ${suggestedPrice.range.min}</span>
                        <span className={`text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Max: ${suggestedPrice.range.max}</span>
                      </div>
                      <div className={`w-full rounded-full h-2 mt-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div>
                      <h4 className={`font-medium mb-3 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>Price Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>Material Cost:</span>
                          <span className={`font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>${suggestedPrice.breakdown.materialCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>Labor Cost:</span>
                          <span className={`font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>${suggestedPrice.breakdown.laborCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>Profit Margin:</span>
                          <span className={`font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>${suggestedPrice.breakdown.profit}</span>
                        </div>
                        <div className={`border-t pt-2 flex justify-between font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'border-gray-600 text-gray-100' : 'border-gray-200 text-gray-900'
                        }`}>
                          <span>Total:</span>
                          <span>${suggestedPrice.breakdown.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className={`p-4 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50'
                    }`}>
                      <h4 className={`font-medium mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-blue-300' : 'text-blue-900'
                      }`}>Pricing Tips</h4>
                      <ul className={`text-sm space-y-1 transition-colors duration-300 ${
                        isDarkMode ? 'text-blue-200' : 'text-blue-800'
                      }`}>
                        <li>• Consider your local market conditions</li>
                        <li>• Research similar products in your area</li>
                        <li>• Don't undervalue your time and skill</li>
                        <li>• Factor in your unique selling points</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <DollarSign className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-300'
                    }`} />
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Fill in the product details and click "Calculate Fair Price" to get your recommendation
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}