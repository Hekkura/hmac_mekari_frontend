export interface ApiConfig {
  apiEndpoint: string
  apiMethod: string
  clientId: string
  clientSecret: string
  requestBody?: string
  // additionalHeaders: string
}

export interface debugInfoType {
  dateFormat: string
  requestLine: string
  stringToSign: string
  stringToSignJson: string
  signature: string
  bodyDigest?: string
  authHeader: string
  hasBody: boolean
}

export interface ApiResponse {
  success: boolean
  status: string
  data: string
  headers: string | null
}
