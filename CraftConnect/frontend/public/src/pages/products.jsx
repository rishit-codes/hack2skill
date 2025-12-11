'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'
import Image from 'next/image'
import apiService from '@/services/api'
import {
    Grid,
    List,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Heart,
    Package,
    Plus
} from 'lucide-react'

export default function ProductsGallery() {
    const { isDarkMode } = useTheme()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        search: '',
        page: 1,
        pageSize: 12
    })
    const [pagination, setPagination] = useState({
        total: 0,
        hasMore: false
    })

    const categories = [
        'pottery', 'textiles', 'woodwork', 'jewelry',
        'metalwork', 'painting', 'sculpture', 'leather',
        'glasswork', 'other'
    ]

    const statuses = ['public', 'draft', 'private']

    useEffect(() => {
        loadProducts()
    }, [filters.status, filters.category, filters.page])

    const loadProducts = async () => {
        setLoading(true)

        try {
            // TODO: Get auth token from context
            const authToken = null

            const filterParams = {
                status: filters.status || undefined,
                category: filters.category || undefined,
                page: filters.page,
                pageSize: filters.pageSize
            }

            const data = await apiService.listProducts(filterParams, authToken)

            setProducts(data.products || [])
            setPagination({
                total: data.total || 0,
                hasMore: data.has_more || false
            })
        } catch (err) {
            console.error('Failed to load products:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        // TODO: Implement search on backend
        loadProducts()
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page on filter change
        }))
    }

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const ProductCard = ({ product }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Link href={`/product_detail?productId=${product.product_id}`}>
                <Card className={`cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl ${isDarkMode
                        ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700 hover:border-orange-500'
                        : 'bg-white/90 backdrop-blur-sm border-orange-100 hover:border-orange-300'
                    }`}>
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                            <Image
                                src={product.images[0].enhanced_uri || product.images[0].gcs_uri}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                }`}>
                                <Package className={`h-16 w-16 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${product.status === 'public'
                                    ? 'bg-green-500/80 text-white'
                                    : product.status === 'draft'
                                        ? 'bg-yellow-500/80 text-white'
                                        : 'bg-gray-500/80 text-white'
                                }`}>
                                {product.status}
                            </span>
                        </div>

                        {/* Stats Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <div className="flex items-center justify-between text-white text-sm">
                                <span className="flex items-center space-x-1">
                                    <Eye className="h-3 w-3" />
                                    <span>{product.views_count}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <Heart className="h-3 w-3" />
                                    <span>{product.likes_count}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <CardContent className="p-4">
                        <h3 className={`font-semibold text-lg mb-2 line-clamp-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
                            }`}>
                            {product.title}
                        </h3>
                        <p className={`text-sm line-clamp-2 mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'
                                }`}>
                                {product.category}
                            </span>

                            {product.pricing?.final_price && (
                                <span className="text-lg font-bold text-orange-600">
                                    ${product.pricing.final_price}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    )

    return (
        <div className={`min-h-screen p-6 transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
            }`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode
                                    ? 'bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent'
                                    : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
                                }`}>
                                Products Gallery
                            </h1>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Discover beautiful handcrafted items
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard">
                                <Button variant="outline" className={
                                    isDarkMode ? 'border-gray-600 text-orange-400' : ''
                                }>
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <Link href="/upload">
                                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Product
                                </Button>
                            </Link>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className={`${isDarkMode
                            ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                            : 'bg-white/90 backdrop-blur-sm border-orange-100'
                        }`}>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <form onSubmit={handleSearch} className="md:col-span-2">
                                    <div className="relative">
                                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                            }`} />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                }`}
                                            value={filters.search}
                                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                        />
                                    </div>
                                </form>

                                {/* Category Filter */}
                                <select
                                    className={`px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>

                                {/* Status Filter */}
                                <select
                                    className={`px-4 py-2 rounded-lg border transition-colors ${isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-100'
                                            : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    {statuses.map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* View Toggle & Results Count */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {pagination.total} products found
                                </span>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className={viewMode === 'grid' ? 'bg-orange-100 dark:bg-orange-900/30' : ''}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className={viewMode === 'list' ? 'bg-orange-100 dark:bg-orange-900/30' : ''}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Grid/List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, idx) => (
                            <div key={idx} className="animate-pulse">
                                <div className={`aspect-square rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                    }`}></div>
                                <div className={`h-4 rounded mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                <div className={`h-3 rounded w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <Card className={`text-center py-16 ${isDarkMode
                            ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                            : 'bg-white/90 backdrop-blur-sm border-orange-100'
                        }`}>
                        <CardContent>
                            <Package className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'
                                }`} />
                            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                No products found
                            </h3>
                            <p className={`mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Try adjusting your filters or create your first product
                            </p>
                            <Link href="/upload">
                                <Button>Create Product</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1'
                        }`}>
                        {products.map((product) => (
                            <ProductCard key={product.product_id} product={product} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && products.length > 0 && (
                    <div className="mt-8 flex items-center justify-center space-x-4">
                        <Button
                            variant="outline"
                            disabled={filters.page === 1}
                            onClick={() => handlePageChange(filters.page - 1)}
                            className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>

                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Page {filters.page} of {Math.ceil(pagination.total / filters.pageSize)}
                        </span>

                        <Button
                            variant="outline"
                            disabled={!pagination.hasMore}
                            onClick={() => handlePageChange(filters.page + 1)}
                            className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
