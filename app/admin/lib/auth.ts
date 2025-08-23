export function useAdminAuth() {
  const getAuthHeader = () => {
    if (typeof window === 'undefined') return null;
    const credentials = sessionStorage.getItem('admin-auth');
    return credentials ? `Basic ${credentials}` : null;
  };

  const signOut = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/admin/api/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout API error:', err);
    }

    // Clear client-side storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin-auth');
    }

    // Redirect to signin
    window.location.href = '/admin/signin';
  };

  const isAuthenticated = () => {
    // Always return false on server-side to prevent hydration mismatch
    if (typeof window === 'undefined') return false;
    return !!sessionStorage.getItem('admin-auth');
  };

  const checkServerAuth = async () => {
    // Validate server-side auth by pinging auth validator endpoint
    try {
      const response = await fetch('/admin/api/auth', { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  };

  return {
    getAuthHeader,
    signOut,
    isAuthenticated,
    checkServerAuth,
  };
}

// Utility function to make authenticated API calls
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
) {
  if (typeof window === 'undefined') {
    throw new Error('authenticatedFetch can only be used on the client side');
  }

  const credentials = sessionStorage.getItem('admin-auth');
  if (!credentials) {
    throw new Error('No authentication credentials found');
  }

  const headers = {
    ...options.headers,
    Authorization: `Basic ${credentials}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, clear credentials and redirect to signin
  if (response.status === 401) {
    sessionStorage.removeItem('admin-auth');
    window.location.href = '/admin/signin';
    throw new Error('Authentication failed');
  }

  return response;
}
