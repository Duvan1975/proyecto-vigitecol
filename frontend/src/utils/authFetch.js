import Swal from "sweetalert2";

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });

  // Si el token expiró o no es válido
  if (res.status === 401 || res.status === 403) {
    // Eliminamos los datos de sesión
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("admin");
    localStorage.removeItem("estado");

    // Mostramos alerta
    await Swal.fire({
      icon: "warning",
      title: "Sesión expirada",
      text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
      confirmButtonText: "Aceptar",
    });

    // Redirigimos al login
    window.location.href = "/login";

    throw new Error("Sesión expirada o no autorizada");
  }

  return res;
};

// Función GET (devuelve JSON)
export const authGet = (url) => {
  return authFetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Error HTTP: ${response.status}`);
  });
};

// POST
export const authPost = (url, data) => {
  return authFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// PUT
export const authPut = (url, data) => {
  return authFetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// PATCH
export const authPatch = (url, data) => {
  return authFetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
