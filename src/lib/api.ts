// API configuration and types
import axios from "axios";
import { error } from "console";

import { getSession } from "next-auth/react";
// import { config } from "process";
export const API_BASE_URL = "https://mohab0104-backend.onrender.com/api/v1";

//create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});
//add request interceptor to access token form next-auth session

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `${session.accessToken}`;
    } else {
      console.warn("no token in session");
    }
    return config;
  },
  (error) => Promise.reject(error)
);



export interface Service {
  _id: string;
  serviceTitle: string;
  serviceDescription: string;
  price: number;
  category: string;
  status: "active" | "inactive";
  imagelink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  serviceId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffingNeed {
  _id: string;
  userId: string;
  companyName: string;
  dataStrategyFocusArea: string;
  dataStrategyNotes: string;
  createdAt: string;
  updatedAt: string;
}


//manul try

export async function adminStats() {
  try {
    const response = await api.get("/user/admin-stats");
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function stats() {
  try{
    const res = await api.get('/payment/stats');
    return res.data;
  }catch(error){
    if(error instanceof Error){
      throw new Error('Failed to fetch admin stats')
    }
  }
  
}

//catagory data
export async function categoryStats() {

  try{
    const res= await api.get('/payment/category-stats')
    return res.data;
  }catch(error){
    if(error instanceof Error){
      throw new Error('Failed to fetch admin stats')
    }
  }
}

//Services data call

export async function ServicesData() {
    
    try{
    const res= await api.get('/services/get')
    return res.data;
  }catch(error){
    if(error instanceof Error){
      throw new Error('Failed to fetch admin stats')
    }
  }

}

export async function serviceDelete(id:string) {
  try{
      const respons= await api.delete(`/services/${id}`)
      return respons.data
  }catch(error:any){
    
      throw new Error(error.message ||'Failed to fetch admin stats')
    
  }
  
}














// Services API
export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services/get`);
    if (!response.ok) throw new Error("Failed to fetch services");
    return response.json();
  },

  create: async (serviceData: {
    serviceTitle: string;
    serviceDescription: string;
    price: number;
    category?: string;
    status?: "active" | "inactive";
    image?: File;
  }): Promise<Service> => {
    try {
      const formData = new FormData();
      formData.append("serviceTitle", serviceData.serviceTitle);
      formData.append("serviceDescription", serviceData.serviceDescription);
      formData.append("price", serviceData.price.toString());

      if (serviceData.category) {
        formData.append("category", serviceData.category);
      }
      if (serviceData.status) {
        formData.append("status", serviceData.status);
      }
      if (serviceData.image) {
        formData.append("imagelink", serviceData.image);
      }

      const response = await fetch(`${API_BASE_URL}/services/create`, {
        method: "POST",
        body: formData, // Send as FormData instead of JSON
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create service: ${response.status} ${errorText}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  update: async (id: string, service: Partial<Service>): Promise<Service> => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    if (!response.ok) throw new Error("Failed to update service");
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete service");
  },
};

// Payments API
export const paymentsApi = {
  getAll: async (): Promise<Payment[]> => {
    const response = await fetch(`${API_BASE_URL}/payment`);
    if (!response.ok) throw new Error("Failed to fetch payments");
    return response.json();
  },

  create: async (
    payment: Omit<Payment, "_id" | "createdAt" | "updatedAt">
  ): Promise<Payment> => {
    const response = await fetch(`${API_BASE_URL}/payment/create-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
    if (!response.ok) throw new Error("Failed to create payment");
    return response.json();
  },
};

export const staffingNeedApi = {
  getAll: async (): Promise<StaffingNeed[]> => {
    const response = await fetch(`${API_BASE_URL}/needed-staff/get`);
    if (!response.ok) throw new Error("Failed to fetch staffing needs");
    return response.json();
  },

  getMyStaffingNeeds: async (): Promise<StaffingNeed[]> => {
    const response = await fetch(
      `${API_BASE_URL}/needed-staff/my-needed-staff`
    );
    if (!response.ok) throw new Error("Failed to fetch my staffing needs");
    return response.json();
  },

  create: async (staffingNeedData: {
    companyName: string;
    dataStrategyFocusArea: string;
    dataStrategyNotes: string;
  }): Promise<StaffingNeed> => {
    const response = await fetch(`${API_BASE_URL}/needed-staff/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffingNeedData),
    });
    if (!response.ok) throw new Error("Failed to create staffing need");
    return response.json();
  },

  update: async (
    id: string,
    staffingNeed: Partial<StaffingNeed>
  ): Promise<StaffingNeed> => {
    const response = await fetch(`${API_BASE_URL}/needed-staff/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffingNeed),
    });
    if (!response.ok) throw new Error("Failed to update staffing need");
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/needed-staff/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete staffing need");
  },
};

export const createService = servicesApi.create;
