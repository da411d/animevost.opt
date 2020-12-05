const API_ENDPOINTS = [
  "https://api.aniland.org/v1/",
  "https://api.animevost.org/v1/",
];

let API_ENDPOINT;

const testAndSetApiEndpoint = async () => {
  for (const endpoint of API_ENDPOINTS) {
    try {
      await fetch(endpoint);
      API_ENDPOINT = endpoint;
      break;
    } catch (e) {
    }
  }
};

const apiRequest = async (method, params = {}) => {
  if (!API_ENDPOINT) {
    await testAndSetApiEndpoint();
  }
  
  const endpoint = API_ENDPOINT + method;
  const payload = new URLSearchParams();
  for (const key in params) {
    payload.append(key, params[key]);
  }
  
  return await fetch(endpoint, {
    method: "POST",
    body: payload,
    referrer: endpoint,
  }).then(response => response.json());
};

module.exports = {
  apiRequest,
};
