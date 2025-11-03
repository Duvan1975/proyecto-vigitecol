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
    localStorage.clear();
    window.location.href = "https://proyecto-vigitecol-dsa7.vercel.app/";

    return Promise.reject(new Error("Sesión expirada"));
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
export const authPost = async (url, data) => {
  const res = await authFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // Procesar respuesta
  const contentType = res.headers.get("Content-Type");
  const responseBody = contentType && contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    // Lanzar el error para que el catch en UserForm lo maneje
    // eslint-disable-next-line
    throw {
      status: res.status,
      message: responseBody?.error || responseBody || "Error desconocido",
    };
  }

  return responseBody;
};

// PUT
export const authPut = async (url, data) => {
  const res = await authFetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("Content-Type");
  const responseBody = contentType && contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    // eslint-disable-next-line
    throw {
      status: res.status,
      message: responseBody?.error || responseBody || "Error desconocido",
    };
  }

  return responseBody;
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


/*export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    // Evitamos continuar el flujo normal
    await Swal.fire({
      icon: "warning",
      title: "Sesión expirada",
      text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    // Limpiamos y redirigimos
    localStorage.clear();
    window.location.href = "http://localhost:3000/"; // o navigate("/") si usas react-router

    // Devolvemos una promesa rechazada para cortar el flujo
    return Promise.reject(new Error("Sesión expirada"));
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
};*/