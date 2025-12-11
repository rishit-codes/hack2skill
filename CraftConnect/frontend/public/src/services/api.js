// API service for CraftConnect frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
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

  // Translation endpoints
  async translateText(text, targetLanguage) {
    return this.request('/translation/translate', {
      method: 'POST',
      body: JSON.stringify({
        text,
        target_language: targetLanguage,
      }),
    })
  }

  async getAvailableLanguages() {
    return this.request('/translation/languages')
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

  // Dashboard data
  async getDashboardData(userId) {
    return this.request(`/dashboard/${userId}`)
  }
}

export default new ApiService()