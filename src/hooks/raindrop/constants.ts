const API_VERSION = 1 as const;
const API_URL = `https://api.raindrop.io/rest/v${API_VERSION}` as const;
const API_TOKEN = import.meta.env.RAINDROP_APP_TOKEN;

export { API_URL, API_VERSION, API_TOKEN };
