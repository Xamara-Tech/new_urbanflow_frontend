const BASE_URL = 'http://127.0.0.1:8000'

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message || 'An error occurred',
        status: response.status,
      }
    } catch (error) {
      return {
        error: 'Network error occurred',
        status: 500,
      }
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<{ access: string; refresh: string; user: any }>('/v1/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: any) {
    return this.request<{ access: string; refresh: string; user: any }>('/v1/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getProfile() {
    return this.request<any>('/v1/auth/profile/')
  }

  // Projects
  async getProjects(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<any>('/v1/suggestions/projects/' + queryString)
  }

  async getProject(uuid: string) {
    return this.request<any>(`/v1/suggestions/projects/${uuid}/`)
  }

  async createProject(projectData: any) {
    return this.request<any>('/v1/suggestions/projects/create/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  }

  async getProjectSentiment(uuid: string) {
    return this.request<any>(`/v1/suggestions/projects/${uuid}/sentiment/`)
  }

  async getProjectDashboard(uuid: string) {
    return this.request<any>(`/v1/suggestions/projects/${uuid}/dashboard/`)
  }

  // Feedback
  async submitFeedback(feedbackData: any) {
    return this.request<any>('/v1/suggestions/feedback/', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    })
  }

  async getProjectFeedback(uuid: string) {
    return this.request<any>(`/v1/suggestions/projects/${uuid}/feedback/`)
  }

  // Buildings
  async getBuildings() {
    return this.request<any>('/v1/buildings/')
  }

  async getBuilding(uuid: string) {
    return this.request<any>(`/v1/buildings/${uuid}/`)
  }

  // Dashboard
  async getDashboard(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.request<any>('/v1/suggestions/dashboard/' + queryString)
  }

  async getStatistics() {
    return this.request<any>('/v1/suggestions/statistics/')
  }

  // Payments
  async getPayments() {
    return this.request<any>('/v1/suggestions/payments/')
  }
}

export const apiClient = new ApiClient(BASE_URL)
