import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jobsetu-aaro.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ----------------------------------------------------
// Public Candidate Endpoints
// ----------------------------------------------------

export async function fetchJobs(params = {}) {
  try {
    const response = await api.get('/jobs', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

export async function submitJobApplication(applicationData) {
  try {
    let payload = applicationData;
    let isMultipart = applicationData instanceof FormData;

    if (!isMultipart && typeof applicationData === 'object' && applicationData !== null) {
      const fd = new FormData();
      let hasFile = false;

      Object.keys(applicationData).forEach((key) => {
        const value = applicationData[key];
        if (value instanceof FileList && value.length > 0) {
          fd.append(key, value[0]);
          hasFile = true;
        } else if (value instanceof File) {
          fd.append(key, value);
          hasFile = true;
        } else if (value !== null && value !== undefined) {
          if (typeof value === 'object' && !(value instanceof Date)) {
            if (value.name) {
              fd.append(key + 'Url', String(value.name));
            }
          } else {
            fd.append(key, String(value));
          }
        }
      });

      if (hasFile) {
        payload = fd;
        isMultipart = true;
      } else {
        const sanitized = {};
        Object.keys(applicationData).forEach((key) => {
          const val = applicationData[key];
          if (val instanceof FileList) {
            sanitized[key] = val.length > 0 ? String(val[0].name) : '';
          } else if (val instanceof File) {
            sanitized[key] = String(val.name);
          } else if (val !== null && val !== undefined) {
            sanitized[key] = typeof val === 'object' ? String(val.name || '') : String(val);
          }
        });
        payload = sanitized;
      }
    }

    const response = await api.post('/applications', payload, {
      headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
    });
    return response;
  } catch (error) {
    console.error('Application submission error:', error);
    throw error;
  }
}

export async function fetchSubscriptionPlans() {
  try {
    const response = await api.get('/payment/plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
}

export async function createRazorpayOrder(paymentData) {
  try {
    const response = await api.post('/payment/create-order', paymentData);
    return response.data;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw error;
  }
}

export async function verifyRazorpayPayment(verificationData) {
  try {
    const response = await api.post('/payment/verify-payment', verificationData);
    return response.data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
}

export async function submitContactForm(contactData) {
  return { status: 200, data: { success: true, message: 'Inquiry submitted' } };
}

export async function submitSupportTicket(supportData) {
  return { status: 200, data: { success: true, message: 'Ticket submitted' } };
}

// ----------------------------------------------------
// Admin Endpoints
// ----------------------------------------------------

export async function loginAdmin(credentials) {
  const response = await api.post('/auth/login', credentials);
  if (response.data?.token) {
    localStorage.setItem('adminToken', response.data.token);
    localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
  }
  return response.data;
}

export async function logoutAdmin() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
}

export async function fetchAdminStats() {
  const response = await api.get('/admin/stats');
  return response.data;
}

export async function fetchAllApplications(params = {}) {
  const response = await api.get('/applications', { params });
  return response.data;
}

export async function fetchApplicationDetails(id) {
  const response = await api.get(`/applications/${id}`);
  return response.data;
}

export async function updateAppStatus(id, status) {
  const response = await api.put(`/applications/${id}/status`, { status });
  return response.data;
}

export async function deleteApplicationRecord(id) {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
}

export async function createNewJob(jobData) {
  const response = await api.post('/jobs', jobData);
  return response.data;
}

export async function updateExistingJob(id, jobData) {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
}

export async function deleteJobPost(id) {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
}

export async function fetchSubscribers() {
  const response = await api.get('/payment/subscribers');
  return response.data;
}

export async function createSubscriptionPlan(planData) {
  const response = await api.post('/payment/plans', planData);
  return response.data;
}

export async function updateSubscriptionPlan(id, planData) {
  const response = await api.put(`/payment/plans/${id}`, planData);
  return response.data;
}

export async function deleteSubscriptionPlan(id) {
  const response = await api.delete(`/payment/plans/${id}`);
  return response.data;
}

export default api;
