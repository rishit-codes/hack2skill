'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { FileText, Sparkles, RefreshCw, Copy, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function StoryForm() {
  const [productType, setProductType] = useState('')
  const [inspiration, setInspiration] = useState('')
  const [tone, setTone] = useState('professional')
  const [generatedStory, setGeneratedStory] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { isDarkMode } = useTheme()

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Simulate AI story generation
    setTimeout(() => {
      const sampleStory = `Crafted with love and attention to detail, this beautiful ${productType} represents the perfect blend of traditional artistry and modern appeal. 

Born from ${inspiration}, each piece tells a unique story of dedication and craftsmanship. The careful selection of materials and time-honored techniques ensure that every creation is not just a product, but a piece of art that carries the soul of its maker.

This handcrafted treasure is designed to bring joy and beauty into your space, serving as a testament to the enduring value of authentic, handmade artistry. Whether as a centerpiece for your home or a meaningful gift for someone special, this piece embodies the timeless appeal of genuine craftsmanship.

Experience the difference that comes from supporting local artisans and preserving traditional craft techniques for future generations.`

      setGeneratedStory(sampleStory)
      setIsGenerating(false)
    }, 3000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedStory)
  }

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
    }`}>
      {/* Navigation */}
      <div className="max-w-4xl mx-auto mb-6">
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

      <div className="max-w-4xl mx-auto">
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
          }`}>Tell Your Story</h1>
          <p className={`text-lg transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Generate compelling narratives for your creations</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700' 
                : 'bg-white/90 backdrop-blur-sm border-orange-100'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  <FileText className="h-5 w-5" />
                  <span>Story Details</span>
                </CardTitle>
                <CardDescription className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Tell us about your creation and we'll craft a compelling story
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Product Type
                  </label>
                  <input
                    type="text"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    placeholder="e.g., ceramic bowl, wooden sculpture, woven scarf"
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
                    Inspiration & Materials
                  </label>
                  <textarea
                    value={inspiration}
                    onChange={(e) => setInspiration(e.target.value)}
                    rows={4}
                    placeholder="What inspired this piece? What materials did you use? What techniques?"
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
                    Story Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="professional">Professional</option>
                    <option value="warm">Warm & Personal</option>
                    <option value="artistic">Artistic & Poetic</option>
                    <option value="casual">Casual & Friendly</option>
                  </select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !productType || !inspiration}
                  className={`w-full transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating Story...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Story
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Story */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={`h-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700' 
                : 'bg-white/90 backdrop-blur-sm border-orange-100'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center justify-between transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  <span>Generated Story</span>
                  {generatedStory && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard} className={`transition-colors duration-300 ${
                        isDarkMode 
                          ? 'border-gray-600 text-orange-400 hover:bg-gray-700' 
                          : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                      }`}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className={`transition-colors duration-300 ${
                        isDarkMode 
                          ? 'border-gray-600 text-orange-400 hover:bg-gray-700' 
                          : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                      }`}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Your AI-generated product story will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className={`h-4 rounded w-full mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-5/6 mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-4/6 mb-4 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-full mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-3/4 mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    <p className={`text-sm text-center transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Crafting your unique story...
                    </p>
                  </div>
                ) : generatedStory ? (
                  <div className="prose prose-sm max-w-none">
                    <div className={`p-4 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <p className={`leading-relaxed whitespace-pre-line transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {generatedStory}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-300'
                    }`} />
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Fill in the details above and click "Generate Story" to create your narrative
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