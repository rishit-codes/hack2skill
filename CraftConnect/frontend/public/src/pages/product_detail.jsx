'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/services/api'
import {
    ArrowLeft,
    Edit,
    Trash, // Changed from Trash2
    Heart,
    Share2,
    Eye,
    Tag,
    Package,
    DollarSign,
    Ruler,
    Calendar,
    User,
    ShoppingCart // Added ShoppingCart
} from 'lucide-react'

export default function ProductDetail() {
    const router = useRouter()
    const { productId } = router.query
    const { isDarkMode } = useTheme()
    const { user, token, isAuthenticated } = useAuth() // Added useAuth

    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true) // Renamed from loading
    const [error, setError] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false) // Added isDeleting
    const [isLiked, setIsLiked] = useState(false) // Added isLiked
    const [likesCount, setLikesCount] = useState(0) // Added likesCount

    useEffect(() => {
        if (productId) {
            fetchProduct() // Renamed from loadProduct
        }
    }, [productId])

    const fetchProduct = async () => { // Renamed from loadProduct
        setIsLoading(true) // Renamed from setLoading
        setError(null)

        try {
            const data = await api.getProduct(productId) // Used api and removed authToken
            setProduct(data)
            setLikesCount(data.likes_count || 0) // Set likesCount

            // Check if current user owns this product
            const isOwner = isAuthenticated && user && user.user_id === data.user_id
            setIsOwner(isOwner)
        } catch (err) {
            console.error('Failed to fetch product:', err) // Updated log message
            setError('Failed to load product details')
        } finally {
            setIsLoading(false) // Renamed from setLoading
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return
        }

        try {
            setIsDeleting(true) // Set isDeleting
            await api.deleteProduct(productId) // Used api and token
            router.push('/products') // Changed path from /dashboard to /products
        } catch (err) {
            console.error('Failed to delete product:', err)
            alert('Failed to delete product')
        } finally {
            setIsDeleting(false) // Reset isDeleting
        }
    }

    const handleLike = async () => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        try {
            const result = await api.toggleProductLike(productId)
            setIsLiked(result.liked)
            setLikesCount(result.likes_count)
        } catch (err) {
            console.error('Failed to toggle like:', err)
        }
    }

    if (isLoading) { // Used isLoading
        return (
            <div className={`min-h-screen p-6 transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
                }`}>
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className={`h-8 rounded w-1/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        <div className={`h-96 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        <div className={`h-64 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className={`min-h-screen p-6 transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
                }`}>
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {error || 'Product not found'}
                    </h1>
                    <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen p-6 transition-all duration-300 ${isDarkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
            }`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
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
                            <span>Back</span>
                        </motion.button>
                    </Link>
                    <ThemeToggle />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <Card className={`overflow-hidden ${isDarkMode
                            ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                            : 'bg-white/90 backdrop-blur-sm border-orange-100'
                            }`}>
                            <CardContent className="p-0">
                                {product.images && product.images.length > 0 ? (
                                    <div className="relative aspect-square">
                                        {/* Use img tag for local files, handle both local and GCS URIs */}
                                        <img
                                            src={
                                                product.images[0].gcs_uri.startsWith('/uploads')
                                                    ? `http://localhost:8000${product.images[0].gcs_uri}`
                                                    : (product.images[0].enhanced_uri || product.images[0].gcs_uri)
                                            }
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className={`aspect-square flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                        }`}>
                                        <Package className={`h-24 w-24 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Thumbnail Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.slice(1, 5).map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                                        <img
                                            src={
                                                img.gcs_uri.startsWith('/uploads')
                                                    ? `http://localhost:8000${img.gcs_uri}`
                                                    : (img.enhanced_uri || img.gcs_uri)
                                            }
                                            alt={`${product.title} ${idx + 2}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Title and Actions */}
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 'public'
                                            ? 'bg-green-100 text-green-800'
                                            : product.status === 'draft'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {product.status}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {product.category}
                                        </span>
                                    </div>
                                    <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
                                        }`}>
                                        {product.title}
                                    </h1>
                                    <div className={`flex items-center space-x-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        <span className="flex items-center space-x-1">
                                            <Eye className="h-4 w-4" />
                                            <span>{product.views_count} views</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Heart className="h-4 w-4" />
                                            <span>{product.likes_count} likes</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                                {isOwner && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/products/${productId}/edit`)}
                                            className={isDarkMode ? 'border-gray-600 text-orange-400' : ''}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDelete}
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLike}
                                    className={isLiked ? 'text-red-500' : ''}
                                >
                                    <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                                    {likesCount}
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        {/* Description */}
                        <Card className={`${isDarkMode
                            ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                            : 'bg-white/90 backdrop-blur-sm border-orange-100'
                            }`}>
                            <CardHeader>
                                <CardTitle className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {product.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Story */}
                        {product.story && (
                            <Card className={`${isDarkMode
                                ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                                : 'bg-white/90 backdrop-blur-sm border-orange-100'
                                }`}>
                                <CardHeader>
                                    <CardTitle className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>
                                        Artisan Story
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className={`leading-relaxed italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {product.story}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Product Details */}
                        <Card className={`${isDarkMode
                            ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                            : 'bg-white/90 backdrop-blur-sm border-orange-100'
                            }`}>
                            <CardHeader>
                                <CardTitle className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>
                                    Product Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Materials */}
                                {product.materials && product.materials.length > 0 && (
                                    <div>
                                        <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>Materials</div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.materials.map((material, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-3 py-1 rounded-full text-xs ${isDarkMode
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

                                {/* Colors */}
                                {product.colors && product.colors.length > 0 && (
                                    <div>
                                        <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>Colors</div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.colors.map((color, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-3 py-1 rounded-full text-xs ${isDarkMode
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

                                {/* Pricing */}
                                {product.pricing && (
                                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="h-5 w-5 text-orange-600" />
                                            <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                                Price
                                            </span>
                                        </div>
                                        <span className="text-2xl font-bold text-orange-600">
                                            ${product.pricing.final_price || product.pricing.suggested_price || 'N/A'}
                                        </span>
                                    </div>
                                )}

                                {/* Dimensions */}
                                {product.dimensions && (
                                    <div>
                                        <div className={`text-sm font-medium mb-2 flex items-center space-x-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            <Ruler className="h-4 w-4" />
                                            <span>Dimensions</span>
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {product.dimensions.length_cm && `${product.dimensions.length_cm}cm × `}
                                            {product.dimensions.width_cm && `${product.dimensions.width_cm}cm × `}
                                            {product.dimensions.height_cm && `${product.dimensions.height_cm}cm`}
                                            {product.dimensions.weight_g && ` • ${product.dimensions.weight_g}g`}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div>
                                        <div className={`text-sm font-medium mb-2 flex items-center space-x-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            <Tag className="h-4 w-4" />
                                            <span>Tags</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-2 py-1 rounded text-xs ${isDarkMode
                                                        ? 'bg-gray-700 text-gray-300'
                                                        : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Metadata */}
                                <div className={`pt-3 border-t text-xs space-y-1 ${isDarkMode
                                    ? 'border-gray-700 text-gray-500'
                                    : 'border-gray-200 text-gray-500'
                                    }`}>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-3 w-3" />
                                        <span>Created {new Date(product.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <User className="h-3 w-3" />
                                        <span>Product ID: {product.product_id}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
