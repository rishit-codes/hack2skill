'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'
import api from '@/services/api'
import {
    ArrowLeft,
    Save,
    Eye,
    Package,
    Image as ImageIcon,
    Plus,
    X,
    Sparkles,
    DollarSign,
    Loader
} from 'lucide-react'

export default function ProductEdit() {
    const router = useRouter()
    const { productId } = router.query
    const { isDarkMode } = useTheme()
    const { user, isAuthenticated } = useAuth()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'pottery',
        materials: [],
        colors: [],
        tags: [],
        story: '',
        status: 'draft',
        pricing: {
            materials_cost: 0,
            labor_hours: 0,
            final_price: null
        },
        dimensions: {
            length_cm: null,
            width_cm: null,
            height_cm: null,
            weight_g: null
        }
    })

    const [newMaterial, setNewMaterial] = useState('')
    const [newColor, setNewColor] = useState('')
    const [newTag, setNewTag] = useState('')

    // AI features state
    const [generatingStory, setGeneratingStory] = useState(false)
    const [generatingPrice, setGeneratingPrice] = useState(false)
    const [aiError, setAiError] = useState(null)

    const categories = [
        'pottery', 'textiles', 'woodwork', 'jewelry',
        'metalwork', 'painting', 'sculpture', 'leather',
        'glasswork', 'other'
    ]

    const statuses = ['draft', 'public', 'private']

    useEffect(() => {
        if (productId) {
            loadProduct()
        }
    }, [productId])

    const loadProduct = async () => {
        setLoading(true)
        setError(null)

        try {
            const product = await api.getProduct(productId)

            // Populate form with product data
            setFormData({
                title: product.title || '',
                description: product.description || '',
                category: product.category || 'pottery',
                materials: product.materials || [],
                colors: product.colors || [],
                tags: product.tags || [],
                story: product.story || '',
                status: product.status || 'draft',
                pricing: {
                    materials_cost: product.pricing?.materials_cost || 0,
                    labor_hours: product.pricing?.labor_hours || 0,
                    final_price: product.pricing?.final_price || null
                },
                dimensions: {
                    length_cm: product.dimensions?.length_cm || null,
                    width_cm: product.dimensions?.width_cm || null,
                    height_cm: product.dimensions?.height_cm || null,
                    weight_g: product.dimensions?.weight_g || null
                }
            })
        } catch (err) {
            console.error('Failed to load product:', err)
            setError('Failed to load product')
        } finally {
            setLoading(false)
        }
    }

    // AI Story Generation
    const handleGenerateStory = async () => {
        setGeneratingStory(true)
        setAiError(null)

        try {
            const productData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                materials: formData.materials,
                colors: formData.colors,
                tags: formData.tags
            }

            const result = await api.generateStory(productData)

            // Update story field with AI-generated content
            setFormData(prev => ({
                ...prev,
                story: result.story || result.generated_story || ''
            }))

        } catch (err) {
            console.error('Story generation failed:', err)
            setAiError('Failed to generate story. Please try again.')
        } finally {
            setGeneratingStory(false)
        }
    }

    // AI Pricing Suggestion
    const handleGetPriceSuggestion = async () => {
        setGeneratingPrice(true)
        setAiError(null)

        try {
            const productDetails = {
                title: formData.title,
                category: formData.category,
                materials: formData.materials,
                materials_cost: formData.pricing.materials_cost,
                labor_hours: formData.pricing.labor_hours
            }

            const result = await api.getPriceSuggestion(productDetails)

            // Update pricing with AI suggestion
            setFormData(prev => ({
                ...prev,
                pricing: {
                    ...prev.pricing,
                    suggested_price: result.suggested_price || result.price,
                    final_price: result.suggested_price || result.price
                }
            }))

        } catch (err) {
            console.error('Price suggestion failed:', err)
            setAiError('Failed to get price suggestion. Please try again.')
        } finally {
            setGeneratingPrice(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            // Prepare update data
            const updateData = {
                ...formData,
                pricing: formData.pricing.final_price ? formData.pricing : null,
                dimensions: formData.dimensions.length_cm ? formData.dimensions : null
            }

            await api.updateProduct(productId, updateData)

            // Navigate to product detail
            router.push(`/product_detail?productId=${productId}`)
        } catch (err) {
            console.error('Failed to update product:', err)
            setError('Failed to save product. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }))
    }

    const addItem = (field, value, setNewValue) => {
        if (!value.trim()) return

        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], value.trim()]
        }))
        setNewValue('')
    }

    const removeItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }

    if (loading) {
        return (
            <div className={`min-h-screen p-6 transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
                }`}>
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className={`h-8 rounded w-1/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        <div className={`h-64 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen p-6 transition-all duration-300 ${isDarkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
            }`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <Link href={`/product_detail?productId=${productId}`}>
                        <motion.button
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${isDarkMode
                                ? 'text-orange-400 hover:bg-gray-800'
                                : 'text-orange-700 hover:bg-orange-100'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Cancel</span>
                        </motion.button>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href={`/product_detail?productId=${productId}`}>
                            <Button variant="outline">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className={`text-4xl font-bold mb-2 ${isDarkMode
                        ? 'bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
                        }`}>Edit Product</h1>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Update your product details and settings
                    </p>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                            <CardContent className="p-4 text-red-700 dark:text-red-300">
                                {error}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className={`${isDarkMode
                        ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                        : 'bg-white/90 backdrop-blur-sm border-orange-100'
                        }`}>
                        <CardHeader>
                            <CardTitle className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="e.g., Handcrafted Ceramic Vase"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Description *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="Describe your product..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleChange('category', e.target.value)}
                                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        {statuses.map(status => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Artisan Story
                                    </label>
                                    <Button
                                        type="button"
                                        onClick={handleGenerateStory}
                                        disabled={generatingStory || !formData.title}
                                        variant="outline"
                                        size="sm"
                                        className={`flex items-center space-x-2 ${isDarkMode
                                            ? 'border-orange-500/50 text-orange-400 hover:bg-orange-500/10'
                                            : 'border-orange-500 text-orange-600 hover:bg-orange-50'
                                            }`}
                                    >
                                        {generatingStory ? (
                                            <>
                                                <Loader className="h-4 w-4 animate-spin" />
                                                <span>Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-4 w-4" />
                                                <span>Generate Story</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <textarea
                                    rows={4}
                                    value={formData.story}
                                    onChange={(e) => handleChange('story', e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="Tell the story behind this piece..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Materials, Colors, Tags */}
                    <Card className={`${isDarkMode
                        ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                        : 'bg-white/90 backdrop-blur-sm border-orange-100'
                        }`}>
                        <CardHeader>
                            <CardTitle className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>
                                Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Materials */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Materials
                                </label>
                                <div className="flex space-x-2 mb-2">
                                    <input
                                        type="text"
                                        value={newMaterial}
                                        onChange={(e) => setNewMaterial(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('materials', newMaterial, setNewMaterial))}
                                        className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        placeholder="Add material..."
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => addItem('materials', newMaterial, setNewMaterial)}
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.materials.map((material, idx) => (
                                        <span
                                            key={idx}
                                            className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${isDarkMode
                                                ? 'bg-gray-700 text-gray-300'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <span>{material}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeItem('materials', idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Colors
                                </label>
                                <div className="flex space-x-2 mb-2">
                                    <input
                                        type="text"
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('colors', newColor, setNewColor))}
                                        className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        placeholder="Add color..."
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => addItem('colors', newColor, setNewColor)}
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.colors.map((color, idx) => (
                                        <span
                                            key={idx}
                                            className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${isDarkMode
                                                ? 'bg-gray-700 text-gray-300'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <span>{color}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeItem('colors', idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Tags
                                </label>
                                <div className="flex space-x-2 mb-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('tags', newTag, setNewTag))}
                                        className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        placeholder="Add tag..."
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => addItem('tags', newTag, setNewTag)}
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className={`px-2 py-1 rounded text-xs flex items-center space-x-2 ${isDarkMode
                                                ? 'bg-orange-900/30 text-orange-300'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}
                                        >
                                            <span>#{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeItem('tags', idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card className={`${isDarkMode
                        ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                        : 'bg-white/90 backdrop-blur-sm border-orange-100'
                        }`}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>
                                    Pricing
                                </CardTitle>
                                <Button
                                    type="button"
                                    onClick={handleGetPriceSuggestion}
                                    disabled={generatingPrice || !formData.title || !formData.pricing.materials_cost}
                                    variant="outline"
                                    size="sm"
                                    className={`flex items-center space-x-2 ${isDarkMode
                                        ? 'border-orange-500/50 text-orange-400 hover:bg-orange-500/10'
                                        : 'border-orange-500 text-orange-600 hover:bg-orange-50'
                                        }`}
                                >
                                    {generatingPrice ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin" />
                                            <span>Getting Price...</span>
                                        </>
                                    ) : (
                                        <>
                                            <DollarSign className="h-4 w-4" />
                                            <span>Get AI Price</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Materials Cost ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.pricing.materials_cost}
                                        onChange={(e) => handleNestedChange('pricing', 'materials_cost', parseFloat(e.target.value))}
                                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Labor Hours
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.pricing.labor_hours}
                                        onChange={(e) => handleNestedChange('pricing', 'labor_hours', parseFloat(e.target.value))}
                                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Final Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.pricing.final_price || ''}
                                        onChange={(e) => handleNestedChange('pricing', 'final_price', e.target.value ? parseFloat(e.target.value) : null)}
                                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Link href={`/product_detail?productId=${productId}`}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
