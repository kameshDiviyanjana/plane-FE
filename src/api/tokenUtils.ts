// export const decodeToken = (token: string) => {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch {
//     return null;
//   }
// };

// export const isTokenExpired = (token: string): boolean => {
//   const decoded = decodeToken(token);
//   if (!decoded || !decoded.exp) {
//     return true;
//   }
//   return decoded.exp * 1000 < Date.now();
// };

// export const isTokenValid = (): boolean => {
//   const token = localStorage.getItem("accessToken");
//   if (!token) {
//     return false;
//   }
//   return !isTokenExpired(token);
// };

// export const getAccessToken = (): string | null => {
//   return localStorage.getItem("accessToken");
// };

export interface TokenPayload {
  sub?: string;
  userId?: number;
  username?: string;
  role?: "USER" | "ADMIN";
  exp?: number;
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split(".")[1];

    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(
          (c) =>
            "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) {
    return true;
  }

  return decoded.exp * 1000 < Date.now();
};

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return false;
  }

  return !isTokenExpired(token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// Get logged-in user's role
export const getUserRole = (): "USER" | "ADMIN" | null => {
  const token = getAccessToken();

  if (!token || isTokenExpired(token)) {
    return null;
  }

  const decoded = decodeToken(token);

  return decoded?.role ?? null;
};

// Check role
export const hasRole = (role: "USER" | "ADMIN"): boolean => {
  return getUserRole() === role;
};

// Check admin
export const isAdmin = (): boolean => {
  return getUserRole() === "ADMIN";
};

// Check normal user
export const isUser = (): boolean => {
  return getUserRole() === "USER";
};

