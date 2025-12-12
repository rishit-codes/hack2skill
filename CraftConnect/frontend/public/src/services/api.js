// API service for CraftConnect frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiService {
  // Get auth token from localStorage
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    // Auto-inject auth token if available
    const token = this.getAuthToken()
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const config = {
      headers,
      ...options,
    }

    try {
      const response = await fetch(url, config)

      // Handle 401 Unauthorized
      if (response.status === 401 && typeof window !== 'undefined') {
        // Clear invalid token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        // Optionally redirect to login
        // window.location.href = '/login'
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `API request failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  // Authentication endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true // Don't include token for login
    })
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true // Don't include token for registration
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // Image analysis endpoints
  async analyzeImage(imageFile) {
    const formData = new FormData()
    formData.append('image_file', imageFile)

    const response = await fetch(`${API_BASE_URL}/copilot/analyze`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Image analysis failed')
    }

    return await response.json()
  }

  async enhanceImage(gcsUri) {
    return this.request('/copilot/enhance', {
      method: 'POST',
      body: JSON.stringify({ gcs_uri: gcsUri }),
    })
  }

  // Story generation endpoints
  async generateStory(productData) {
    return this.request('/storyteller/generate', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  // Pricing endpoints
  async getPriceSuggestion(productDetails) {
    return this.request('/pricing/suggest', {
      method: 'POST',
      body: JSON.stringify(productDetails),
    })
  }

  async getMarketAnalysis(category, location) {
    return this.request(`/pricing/market-analysis?category=${category}&location=${location}`)
  }

  // Product Management endpoints
  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async getProduct(productId) {
    return this.request(`/products/${productId}`)
  }

  async updateProduct(productId, productData) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
    })
  }

  async listProducts(filters = {}) {
    const params = new URLSearchParams()

    if (filters.ownerId) params.append('owner_id', filters.ownerId)
    if (filters.status) params.append('status', filters.status)
    if (filters.category) params.append('category', filters.category)
    if (filters.page) params.append('page', filters.page)
    if (filters.pageSize) params.append('page_size', filters.pageSize)

    const queryString = params.toString()
    return this.request(`/products${queryString ? '?' + queryString : ''}`)
  }

  async searchProducts(query, filters = {}) {
    const params = new URLSearchParams()
    params.append('q', query)

    if (filters.category) params.append('category', filters.category)
    if (filters.page) params.append('page', filters.page)
    if (filters.pageSize) params.append('page_size', filters.pageSize)

    return this.request(`/products/search?${params.toString()}`)
  }

  async toggleProductLike(productId) {
    return this.request(`/products/${productId}/like`, {
      method: 'POST',
    })
  }

  async getUserProductStats(userId) {
    return this.request(`/products/users/${userId}/stats`)
  }

  // Recommendations endpoints
  async getRecommendations(userId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/recommender/suggestions?user_id=${userId}&${queryParams}`)
  }

  async getMarketTrends(category) {
    return this.request(`/recommender/trends?category=${category}`)
  }

  // Sales endpoints
  async recordSale(saleData) {
    return this.request('/sales/record', {
      method: 'POST',
      body: JSON.stringify(saleData),
    })
  }

  async getSalesAnalytics(userId, timeframe = '30d') {
    return this.request(`/sales/analytics?user_id=${userId}&timeframe=${timeframe}`)
  }

  // User profile endpoints
  async getUserProfile(userId) {
    return this.request(`/users/${userId}`)
  }

  async updateUserProfile(userId, profileData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  // User profile endpoints
  async getUserProfile(userId) {
    return this.request(`/users/${userId}`)
  }

  async updateUserProfile(userId, profileData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  // Dashboard data
  async getDashboardData(userId) {
    return this.request(`/dashboard/${userId}`)
  }
}

export default new ApiService()