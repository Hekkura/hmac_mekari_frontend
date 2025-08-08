import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  // baseURL: 'https://sandbox-api.mekari.com/v2/esign/v1',
  // baseURL: 'https://cors-anywhere.herokuapp.com/https://sandbox-api.mekari.com/v2/esign/v1',
  // DEVELOPMENT "remove server tag from vite.config.ts after use"
  // baseURL: '/api',
})

export default api
