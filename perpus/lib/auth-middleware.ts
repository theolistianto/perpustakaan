/**
 * Auth Middleware - Checks if user is authenticated
 * Protected routes that require login
 */

export const PROTECTED_ROUTES = [
  "/dashboard/books",
  "/dashboard/borrow",
  "/dashboard/settings",
  "/panduan/meminjam",
];

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  return !!token && !!userRole;
};

/**
 * Check if route is protected
 */
export const isProtectedRoute = (href: string): boolean => {
  return PROTECTED_ROUTES.some((route) => href.startsWith(route));
};

/**
 * Navigate with auth check - redirect to login if not authenticated
 */
export const navigateWithAuth = (href: string, router: any): void => {
  // If route is protected and user is not authenticated, redirect to login
  if (isProtectedRoute(href) && !isAuthenticated()) {
    // Store the intended destination
    sessionStorage.setItem("redirectAfterLogin", href);
    router.push("/auth/login");
    return;
  }
  
  // Otherwise, navigate normally
  router.push(href);
};

/**
 * Get redirect destination after login
 */
export const getRedirectAfterLogin = (): string | null => {
  if (typeof window === "undefined") return null;
  const redirect = sessionStorage.getItem("redirectAfterLogin");
  if (redirect) {
    sessionStorage.removeItem("redirectAfterLogin");
  }
  return redirect;
};
