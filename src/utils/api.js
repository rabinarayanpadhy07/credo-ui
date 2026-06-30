const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');

export const getApiUrl = (endpoint = '') => `${BASE_URL}${endpoint}`;

let token = '';

export const setToken = (newToken) => {
  token = newToken;
};

export const getToken = () => token;

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    ...options.headers,
  };

  // Only set Content-Type to JSON if it's not a FormData or buffer request
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ensure credentials are sent for HttpOnly cookies
  const config = {
    ...options,
    headers,
    credentials: options.credentials || 'include',
  };

  const url = getApiUrl(endpoint);
  let response = await fetch(url, config);

  if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        token = refreshData.data.accessToken;
        
        // Retry original request
        headers['Authorization'] = `Bearer ${token}`;
        response = await fetch(url, {
          ...config,
          headers,
        });
      } else {
        token = '';
      }
    } catch {
      token = '';
    }
  }

  // Check if response is a file download (like excel)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('spreadsheetml')) {
    return response;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
