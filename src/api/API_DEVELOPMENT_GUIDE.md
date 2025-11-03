# API Development Guide

## Overview

This guide ensures all API calls automatically handle authentication and token refresh. **All APIs MUST use `apiClient`** instead of `fetch` directly to benefit from automatic refresh token logic.

---

## ✅ Correct Way: Using `apiClient`

Always use `apiClient` from `./client` for all API calls. This ensures:
- ✅ Automatic token expiration check before requests
- ✅ Automatic token refresh if expired
- ✅ Automatic retry on 401 errors
- ✅ Request queuing during token refresh
- ✅ Proper error handling

### Basic API Call Pattern

```javascript
import apiClient from './client';
import { API_ENDPOINTS } from './config';

// GET Request
export const getSomething = async () => {
  try {
    const responseData = await apiClient.get(API_ENDPOINTS.GET_SOMETHING);
    
    return {
      success: true,
      data: responseData,
      message: 'Success',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed',
    };
  }
};

// POST Request with JSON body
export const createSomething = async (data) => {
  try {
    const responseData = await apiClient.post(API_ENDPOINTS.CREATE_SOMETHING, {
      name: data.name,
      description: data.description,
    });
    
    return {
      success: true,
      data: responseData,
      message: 'Created successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to create',
    };
  }
};

// PUT Request
export const updateSomething = async (id, data) => {
  try {
    const responseData = await apiClient.put(
      `${API_ENDPOINTS.UPDATE_SOMETHING}/${id}`,
      data
    );
    
    return {
      success: true,
      data: responseData,
      message: 'Updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to update',
    };
  }
};

// DELETE Request
export const deleteSomething = async (id) => {
  try {
    const responseData = await apiClient.delete(
      `${API_ENDPOINTS.DELETE_SOMETHING}/${id}`
    );
    
    return {
      success: true,
      data: responseData,
      message: 'Deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete',
    };
  }
};
```

---

## 📤 File Upload Pattern (FormData)

For file uploads, create `FormData` and pass it directly to `apiClient.post()`. The client automatically detects FormData and handles Content-Type headers.

```javascript
import apiClient from './client';
import { API_ENDPOINTS } from './config';

export const uploadFile = async (fileData) => {
  try {
    // Create FormData
    const formData = new FormData();
    
    formData.append('file', {
      uri: fileData.uri,
      type: fileData.type || 'image/jpeg',
      name: fileData.fileName || 'file.jpg',
    });
    
    // Add other fields if needed
    formData.append('description', fileData.description);
    
    // Use apiClient - it automatically handles FormData
    const responseData = await apiClient.post(
      API_ENDPOINTS.UPLOAD_FILE,
      formData
    );
    
    return {
      success: true,
      data: responseData,
      message: 'File uploaded successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to upload file',
    };
  }
};
```

---

## ❌ Wrong Way: Using `fetch` Directly

**NEVER** use `fetch` directly in API functions. This bypasses automatic refresh token logic.

```javascript
// ❌ WRONG - Don't do this!
export const getSomething = async (token) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_SOMETHING}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  // ... rest of code
};

// ✅ CORRECT - Use apiClient instead
export const getSomething = async () => {
  const responseData = await apiClient.get(API_ENDPOINTS.GET_SOMETHING);
  // ... rest of code
};
```

---

## 🔄 Token Parameter Pattern

**IMPORTANT**: You no longer need to pass `token` parameters to API functions. `apiClient` automatically:
- Gets the access token from Redux state
- Refreshes if expired
- Adds Authorization header

### Before (with token parameter):
```javascript
// ❌ Old pattern - token parameter not needed anymore
export const getProfile = async (token) => {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};
```

### After (no token parameter):
```javascript
// ✅ New pattern - apiClient handles token automatically
export const getProfile = async () => {
  const responseData = await apiClient.get(API_ENDPOINTS.GET_PROFILE);
  // Token is automatically added from Redux state
};
```

**Note**: For backward compatibility, you can keep the `token` parameter but it will be ignored.

---

## 🚫 Special Cases: When NOT to Use `apiClient`

### 1. Refresh Token API Itself
The `refreshAccessToken` function must use `fetch` directly to avoid infinite loops.

```javascript
// ✅ Correct - Refresh token API uses fetch directly
refreshAccessToken: async (refreshToken) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
  // ...
}
```

### 2. Public APIs (No Authentication)
If an API doesn't require authentication, you can still use `apiClient` - it will simply not add the Authorization header if no token is available.

---

## 📝 Adding New API Endpoints

1. **Add endpoint to `config.js`**:
```javascript
export const API_ENDPOINTS = {
  // ... existing endpoints
  GET_NEW_ENDPOINT: '/api/new-endpoint',
  CREATE_NEW_RESOURCE: '/api/new-resource',
};
```

2. **Create API function using `apiClient`**:
```javascript
// In your API file (e.g., authAPI.js, socialAPI.js, etc.)
import apiClient from './client';
import { API_ENDPOINTS } from './config';

export const apiService = {
  // New API function
  getNewData: async () => {
    try {
      const responseData = await apiClient.get(API_ENDPOINTS.GET_NEW_ENDPOINT);
      
      return {
        success: true,
        data: responseData,
        message: 'Data retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve data',
      };
    }
  },
};
```

---

## 🎯 Key Points to Remember

1. **Always use `apiClient`** - Never use `fetch` directly
2. **Don't pass tokens** - `apiClient` handles tokens automatically
3. **Use FormData for uploads** - `apiClient` detects and handles it correctly
4. **Consistent error handling** - Return `{ success, data, error, message }` format
5. **Add endpoints to config** - Keep all endpoints in `API_ENDPOINTS`

---

## 📚 Example: Complete API Service

```javascript
import apiClient from './client';
import { API_ENDPOINTS } from './config';

export const myAPI = {
  // GET request
  getItems: async () => {
    try {
      const responseData = await apiClient.get(API_ENDPOINTS.GET_ITEMS);
      return {
        success: true,
        data: responseData,
        message: 'Items retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve items',
      };
    }
  },

  // POST request with JSON
  createItem: async (itemData) => {
    try {
      const responseData = await apiClient.post(API_ENDPOINTS.CREATE_ITEM, itemData);
      return {
        success: true,
        data: responseData,
        message: 'Item created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create item',
      };
    }
  },

  // PUT request
  updateItem: async (id, itemData) => {
    try {
      const responseData = await apiClient.put(
        `${API_ENDPOINTS.UPDATE_ITEM}/${id}`,
        itemData
      );
      return {
        success: true,
        data: responseData,
        message: 'Item updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update item',
      };
    }
  },

  // DELETE request
  deleteItem: async (id) => {
    try {
      const responseData = await apiClient.delete(
        `${API_ENDPOINTS.DELETE_ITEM}/${id}`
      );
      return {
        success: true,
        data: responseData,
        message: 'Item deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete item',
      };
    }
  },

  // File upload
  uploadFile: async (fileData) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileData.uri,
        type: fileData.type || 'image/jpeg',
        name: fileData.fileName || 'file.jpg',
      });

      const responseData = await apiClient.post(
        API_ENDPOINTS.UPLOAD_FILE,
        formData
      );
      
      return {
        success: true,
        data: responseData,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to upload file',
      };
    }
  },
};
```

---

## 🔍 How It Works Under the Hood

1. **Before Request**:
   - `apiClient` checks if access token is expired
   - If expired, automatically refreshes token
   - Adds Authorization header with valid token

2. **On 401 Error**:
   - Detects 401 Unauthorized response
   - Triggers token refresh automatically
   - Retries original request with new token

3. **Request Queuing**:
   - If multiple requests get 401 simultaneously
   - All wait for single token refresh to complete
   - All retry with new token

---

## ✅ Checklist for New APIs

- [ ] Endpoint added to `API_ENDPOINTS` in `config.js`
- [ ] Using `apiClient` (not `fetch`)
- [ ] No manual token passing
- [ ] Proper error handling with `try/catch`
- [ ] Consistent return format: `{ success, data, error, message }`
- [ ] FormData used for file uploads
- [ ] Code follows patterns in this guide

---

**Last Updated**: 2024
**Maintained by**: Development Team

