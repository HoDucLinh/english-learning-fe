const API_BASE_URL = 'http://localhost:8080/api';

export const ENDPOINTS = {
  VOCABULARIES: `${API_BASE_URL}/vocabularies`,
} as const;

export default ENDPOINTS;