// API configuration and types
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface Service {
  _id: string
  name: string
  description: string
  price: number
  category: string
  status: "active" | "inactive"
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  _id: string
  amount: number
  status: "pending" | "completed" | "failed"
  serviceId: string
  userId: string
  createdAt: string
  updatedAt: string
}

// Services API
export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services/get`)
    if (!response.ok) throw new Error("Failed to fetch services")
    return response.json()
  },

  create: async (service: Omit<Service, "_id" | "createdAt" | "updatedAt">): Promise<Service> => {
    console.log("[v0] Creating service with data:", service)
    console.log("[v0] API URL:", `${API_BASE_URL}/services/create`)

    try {
      const response = await fetch(`${API_BASE_URL}/services/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Error response:", errorText)
        throw new Error(`Failed to create service: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      console.log("[v0] Service created successfully:", result)
      return result
    } catch (error) {
      console.log("[v0] Network error:", error)
      throw error
    }
  },

  update: async (id: string, service: Partial<Service>): Promise<Service> => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    })
    if (!response.ok) throw new Error("Failed to update service")
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete service")
  },
}

// Payments API
export const paymentsApi = {
  getAll: async (): Promise<Payment[]> => {
    const response = await fetch(`${API_BASE_URL}/payment`)
    if (!response.ok) throw new Error("Failed to fetch payments")
    return response.json()
  },

  create: async (payment: Omit<Payment, "_id" | "createdAt" | "updatedAt">): Promise<Payment> => {
    const response = await fetch(`${API_BASE_URL}/payment/create-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    })
    if (!response.ok) throw new Error("Failed to create payment")
    return response.json()
  },
}
