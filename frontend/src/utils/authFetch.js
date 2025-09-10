// Mantén tu authFetch original como está
export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  return fetch(url, { ...options, headers }).then(async (res) => {
    if (res.status === 401 || res.status === 403) {
      throw new Error("No autorizado");
    }
    return res;
  });
};

// Y crea un authGet que sí parseé JSON
export const authGet = (url) => {
  return authFetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Error HTTP: ${response.status}`);
  });
};

// En tu authFetch.js, agrega:
export const authPost = (url, data) => {
    return authFetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
};

export const authPut = (url, data) => {
    return authFetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
};

export const authPatch = (url, data) => {
    return authFetch(url, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
};