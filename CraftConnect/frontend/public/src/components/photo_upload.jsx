'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { Upload, Camera, Image as ImageIcon, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import api from '@/services/api'

export default function PhotoUpload() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const { user, isAuthenticated } = useAuth()

  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [creatingProduct, setCreatingProduct] = useState(false)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setSelectedFile({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    })
    setError(null)
    setAnalysis(null)

    // Automatically analyze the image
    await analyzeImage(file)
  }

  const analyzeImage = async (file) => {
    setAnalyzing(true)
    setError(null)

    try {
      // Call backend API to analyze image
      const result = await api.analyzeImage(file)

      setAnalysis(result)

      // Check if image was rejected
      if (result.status === 'rejected') {
        setError('Image quality too low. Please upload a clearer photo.')
      }
    } catch (err) {
      console.error('Image analysis failed:', err)
      setError('Failed to analyze image. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleCreateProduct = async () => {
    if (!analysis || analysis.status === 'rejected') {
      return
    }

    // Check if user is logged in
    if (!user) {
      setError('Please log in to create a product.')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return
    }

    setCreatingProduct(true)

    try {
      // Prepare product data from AI analysis
      const productData = {
        title: analysis.suggested_title || 'Untitled Product',
        description: `Beautiful handcrafted item. ${analysis.suggested_materials?.join(', ') || ''}`,
        category: mapCategory(analysis),
        materials: analysis.suggested_materials || [],
        colors: analysis.primary_colors || [],
        tags: [...(analysis.seo_tags || [])].slice(0, 10),
        images: [{
          gcs_uri: analysis.gcs_uri,
          enhanced_uri: analysis.enhanced_uri || null,
          is_primary: true
        }],
        dimensions: analysis.estimated_dimensions_cm ? {
          length_cm: parseFloat(analysis.estimated_dimensions_cm.split('x')[0]) || null
        } : null,
        status: 'draft'
      }

      // Create product
      const product = await api.createProduct(productData)

      // Navigate to product detail or edit page
      router.push(`/products/${product.product_id}/edit`)

    } catch (err) {
      console.error('Failed to create product:', err)
      if (err.message && err.message.includes('401')) {
        setError('Session expired. Please log in again.')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError('Failed to create product. Please try again.')
      }
    } finally {
      setCreatingProduct(false)
    }
  }

  const mapCategory = (analysis) => {
    // Simple mapping logic - can be enhanced
    const materials = (analysis.suggested_materials || []).join(' ').toLowerCase()

    if (materials.includes('clay') || materials.includes('ceramic')) return 'pottery'
    if (materials.includes('wood')) return 'woodwork'
    if (materials.includes('fabric') || materials.includes('textile')) return 'textiles'
    if (materials.includes('metal')) return 'metalwork'
    if (materials.includes('glass')) return 'glasswork'
    if (materials.includes('leather')) return 'leather'

    return 'other'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'auto_accepted':
        return 'bg-green-500'
      case 'needs_confirmation':
        return 'bg-yellow-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
      }`}>
      {/* Navigation */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <motion.button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${isDarkMode
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
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${isDarkMode
            ? 'bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
            }`}>Upload & Analyze</h1>
          <p className={`text-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Upload your craft photo for AI analysis and product creation</p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`mb-8 shadow-xl transition-all duration-300 ${isDarkMode
            ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700'
            : 'bg-white/80 backdrop-blur-sm border-orange-100'
            }`}>
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${dragActive
                  ? isDarkMode
                    ? 'border-orange-400 bg-orange-900/20'
                    : 'border-orange-500 bg-orange-50'
                  : isDarkMode
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Upload className="h-8 w-8 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                      Drop your craft photo here
                    </h3>
                    <p className={`mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Or click to browse your files
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
                          onClick={(e) => {
                            e.preventDefault()
                            document.getElementById('file-upload').click()
                          }}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Choose Photo
                        </Button>
                      </motion.div>
                    </label>
                  </div>
                  <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                    Supports JPG, PNG, WEBP up to 10MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analysis Progress */}
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`mb-8 transition-all duration-300 ${isDarkMode
              ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700'
              : 'bg-white/80 backdrop-blur-sm border-orange-100'
              }`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                  <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Analyzing your image with AI...</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysis && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Image Preview */}
            <Card className={`${isDarkMode
              ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
              : 'bg-white/90 backdrop-blur-sm border-orange-100'
              }`}>
              <CardHeader>
                <CardTitle className={`flex items-center justify-between ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                  <span>Uploaded Image</span>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(analysis.status)} text-white`}>
                    {analysis.status.replace('_', ' ')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedFile && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={selectedFile.preview}
                      alt="Uploaded craft"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Analysis Results */}
            {analysis.status !== 'rejected' && (
              <Card className={`${isDarkMode
                ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                : 'bg-white/90 backdrop-blur-sm border-orange-100'
                }`}>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>
                    <Sparkles className="h-5 w-5 text-orange-500" />
                    <span>AI Analysis Results</span>
                  </CardTitle>
                  <CardDescription className={
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }>
                    Confidence Score: {(analysis.confidence_score * 100).toFixed(0)}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.suggested_title && (
                    <div>
                      <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Suggested Title</label>
                      <p className={`mt-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {analysis.suggested_title}
                      </p>
                    </div>
                  )}

                  {analysis.suggested_materials && analysis.suggested_materials.length > 0 && (
                    <div>
                      <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Materials Detected</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {analysis.suggested_materials.map((material, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm ${isDarkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                              }`}
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.primary_colors && analysis.primary_colors.length > 0 && (
                    <div>
                      <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Primary Colors</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {analysis.primary_colors.map((color, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm ${isDarkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                              }`}
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.seo_tags && analysis.seo_tags.length > 0 && (
                    <div>
                      <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>SEO Tags</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {analysis.seo_tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs ${isDarkMode
                              ? 'bg-orange-900/30 text-orange-300'
                              : 'bg-orange-100 text-orange-700'
                              }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Create Product Button */}
                  <div className="pt-4 border-t dark:border-gray-700">
                    <Button
                      onClick={handleCreateProduct}
                      disabled={creatingProduct}
                      className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                    >
                      {creatingProduct ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Product...
                        </>
                      ) : (
                        <>
                          Create Product
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <p className={`mt-2 text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                      This will create a draft product that you can edit
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}