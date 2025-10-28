import { API_CONFIG } from './config';

// Get auth token from storage
const getAuthToken = async () => {
  try {
    // You can implement AsyncStorage or secure storage here
    // For now, returning null
    return null;
  } catch (error) {
    console.log('Error getting auth token:', error);
    return null;
  }
};

// Build full URL
const buildURL = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Build headers with auth token
const buildHeaders = async (customHeaders = {}) => {
  const token = await getAuthToken();
  return {
    ...API_CONFIG.HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };
};

// Handle response
const handleResponse = async (response) => {
  console.log('🔍 handleResponse: Processing response');
  console.log('📡 Response Status:', response.status);
  console.log('📡 Response OK:', response.ok);
  
  if (!response.ok) {
    console.log('❌ Response not OK, getting error data');
    const errorText = await response.text();
    console.log('📄 Error Response Text:', errorText);
    
    let errorData;
    try {
      errorData = JSON.parse(errorText);
      console.log('📊 Parsed Error Data:', errorData);
    } catch (parseError) {
      console.log('❌ Error response is not JSON:', errorText);
      errorData = { message: errorText };
    }
    
    const errorMessage = errorData.message || `HTTP Error: ${response.status}`;
    console.log('💥 Throwing Error:', errorMessage);
    throw new Error(errorMessage);
  }
  
  console.log('✅ Response is OK, parsing JSON');
  return response.json();
};

// Generic request method
const request = async (endpoint, options = {}) => {
  const url = buildURL(endpoint);
  const headers = await buildHeaders(options.headers);
  
  // Remove headers from options to avoid override
  const { headers: _, ...otherOptions } = options;
  
  const config = {
    method: options.method || 'GET',
    headers,
    timeout: API_CONFIG.TIMEOUT,
    ...otherOptions,
  };

  try {
    console.log(`🚀 API Request: ${config.method} ${url}`);
    console.log('📤 Request Body:', config.body);
    console.log('📋 Request Headers:', config.headers);
    
    // Debugger removed for production
    
    const response = await fetch(url, config);
    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    // Log response text before parsing
    const responseText = await response.text();
    console.log('📄 Raw Response Text:', responseText);
    
    // Parse JSON manually for better debugging
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Parsed JSON Response:', data);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.log('📄 Raw Response (not JSON):', responseText);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    console.log(`✅ API Response: ${config.method} ${url}`, data);
    console.log('🔍 Full Response Data:', JSON.stringify(data, null, 2));
    
    // Debugger removed for production
    
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${config.method} ${url}`, error);
    console.error('💥 Error Details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Debugger removed for production
    
    throw error;
  }
};

// HTTP Methods
const get = async (endpoint, options = {}) => {
  return request(endpoint, { ...options, method: 'GET' });
};

const post = async (endpoint, data, options = {}) => {
  return request(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

const put = async (endpoint, data, options = {}) => {
  return request(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

const del = async (endpoint, options = {}) => {
  return request(endpoint, { ...options, method: 'DELETE' });
};

// Export functional API client
export const apiClient = {
  get,
  post,
  put,
  delete: del,
};

export default apiClient;
