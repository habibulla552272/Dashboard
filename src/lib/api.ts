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
  email: ReactNode;
  staffDescription: ReactNode;
  lastName: any;
  firstName: any;
  businessEmail: ReactNode;
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
  try {
    const res = await api.get("/payment/stats");
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to fetch admin stats");
    }
  }
}

//catagory data
export async function categoryStats() {
  try {
    const res = await api.get("/payment/category-stats");
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to fetch admin stats");
    }
  }
}

//Services data call

// create service
export async function createService(data: any, image?: File) {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (image) {
      formData.append("image", image);
    }
    const res = await api.post("/services/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create service");
  }
}

export async function ServicesData() {
  try {
    const res = await api.get("/services/get");
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to fetch admin stats");
    }
  }
}
export async function ServicesSingleData(id: string) {
  try {
    const res = await api.get(`/services/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to fetch admin stats");
    }
  }
}

export async function serviceDelete(id: string) {
  try {
    const respons = await api.delete(`/services/${id}`);
    return respons.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch admin stats");
  }
}

//service
export async function serviceEdit(id: string, data: any, image?: File) {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (image) {
      formData.append("image", image);
    }
    const res = await api.put(`/services/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch admin stats");
  }
}

//strategy

export async function fetchStrategies(page = 1, limit = 10) {
  try {
    const response = await api.get(`/strategy/get?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch strategies");
  }
}
// Fetch a specific strategy
export async function fetchStrategy(id: string) {
  try {
    const response = await api.get(`/strategy/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch strategy");
  }
}

// Update a specific strategy
export async function updateStrategy(id: string, data: any) {
  try {
    const response = await api.put(`/strategy/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update strategy");
  }
}

// Get user Strategies
export async function fetchUserStrategies(page = 1, limit = 5) {
  try {
    const response = await api.get(
      `/strategy/my-strategy?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch user strategies");
  }
}

export async function deleteStrategy(id: string) {
  try {
    const response = await api.delete(`/strategy/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete strategy");
  }
}

export async function createStrategy(data: any) {
  try {
    const response = await api.post("/strategy/create", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create strategy");
  }
}

// Blog API
export async function fetchBlogs() {
  const response = await api.get(`/blog/get`);
  return response.data;
}

export async function fetchBlog(id: string) {
  try {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch blog");
  }
}

export async function createBlog(data: any, image?: File) {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (image) {
      formData.append("image", image);
    }
    const response = await api.post("/blog/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create blog");
  }
}

export async function updateBlog(id: string, data: any, image?: File) {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (image) {
      formData.append("image", image);
    }
    const response = await api.put(`/blog/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update blog");
  }
}

export async function deleteBlog(id: string) {
  try {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete blog");
  }
}

//solution api

export async function solutionData() {
  try {
    const res = await api.get("/solution/get");
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to Fetch Solution data");
  }
}

export async function updateSolution(id: string, data: any) {
  try {
    const res = await api.put(`/solution/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to Update Solution");
  }
}

// delete solution

export async function delteSolution(id: string) {
  try {
    const respons = await api.delete(`/solution/${id}`);
    return respons.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete solution");
  }
}

//payment api

export async function fetchPayment() {
  try {
    const res = await api.get("/payment");
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch payment");
  }
}

//data Sets

export async function fetchDataSets() {
  try {
    const res = await api.get("/data-set/all");
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch data sets");
  }
}

export async function dataSetUpdate(id: string, data: any) {
  try {
    const res = await api.put(`/data-set/update/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update data set");
  }
}

export async function dataSetCreate(data: any) {
  try {
    const res = await api.post("/data-set/create", data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update data set");
  }
}

// delete 

export async function dataSetDelete(id:string) {

  try{
    const res= await api.delete(`/data-set/delete/${id}`)
    return res.data
  }catch(error:any){
    throw new Error(error.message || 'Failed to Delete data')
  }
  
}

//staffneed 

export async function staffNeed() {
  try {
    const res = await api.get("/needed-staff/get");
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch data sets");
  }
  
}

// Services API
// export const servicesApi = {
//   getAll: async (): Promise<Service[]> => {
//     const response = await fetch(`${API_BASE_URL}/services/get`);
//     if (!response.ok) throw new Error("Failed to fetch services");
//     return response.json();
//   },

//   create: async (serviceData: {
//     serviceTitle: string;
//     serviceDescription: string;
//     price: number;
//     category?: string;
//     status?: "active" | "inactive";
//     image?: File;
//   }): Promise<Service> => {
//     try {
//       const formData = new FormData();
//       formData.append("serviceTitle", serviceData.serviceTitle);
//       formData.append("serviceDescription", serviceData.serviceDescription);
//       formData.append("price", serviceData.price.toString());

//       if (serviceData.category) {
//         formData.append("category", serviceData.category);
//       }
//       if (serviceData.status) {
//         formData.append("status", serviceData.status);
//       }
//       if (serviceData.image) {
//         formData.append("imagelink", serviceData.image);
//       }

//       const response = await fetch(`${API_BASE_URL}/services/create`, {
//         method: "POST",
//         body: formData, // Send as FormData instead of JSON
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Failed to create service: ${response.status} ${errorText}`
//         );
//       }

//       const result = await response.json();
//       return result;
//     } catch (error) {
//       throw error;
//     }
//   },

//   update: async (id: string, service: Partial<Service>): Promise<Service> => {
//     const response = await fetch(`${API_BASE_URL}/services/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(service),
//     });
//     if (!response.ok) throw new Error("Failed to update service");
//     return response.json();
//   },

//   delete: async (id: string): Promise<void> => {
//     const response = await fetch(`${API_BASE_URL}/services/${id}`, {
//       method: "DELETE",
//     });
//     if (!response.ok) throw new Error("Failed to delete service");
//   },
// };

// Payments API
// export const paymentsApi = {
//   getAll: async (): Promise<Payment[]> => {
//     const response = await fetch(`${API_BASE_URL}/payment`);
//     if (!response.ok) throw new Error("Failed to fetch payments");
//     return response.json();
//   },

//   create: async (
//     payment: Omit<Payment, "_id" | "createdAt" | "updatedAt">
//   ): Promise<Payment> => {
//     const response = await fetch(`${API_BASE_URL}/payment/create-payment`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payment),
//     });
//     if (!response.ok) throw new Error("Failed to create payment");
//     return response.json();
//   },
// };

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

// export const createService = servicesApi.create;
