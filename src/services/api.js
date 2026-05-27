const API_BASE = "https://vw5xfmt0ua.execute-api.us-west-2.amazonaws.com";


export const submitReflection = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (err) {
    console.error("submitReflection error:", err);
    throw err;
  }
};

export const getReflections = async () => {
  const res = await fetch(`${API_BASE}/reflections`);

  const data = await res.json();

  return data; // NOT data.items
}; 

export const getNarrative = async () => {
  const res = await fetch(`${API_BASE}/narrative`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch narrative");
  }

  return data;
};

export const askInquiry = async (question) => {
  const res = await fetch(`${API_BASE}/inquiry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to ask inquiry");
  }

  return data;
};

export const getEcho = async () => {
  const res = await fetch(`${API_BASE}/echo`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch echo");
  }

  return data;
};

export const generateScripture = async (theme) => {
  const res = await fetch(`${API_BASE}/scripture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ theme }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to generate scripture");
  }

  return data;
};
