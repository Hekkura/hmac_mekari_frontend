import { HmacCryptoService } from './hmacCryptoService'
import type { ApiConfig, debugInfoType } from '@/types/hmacAPITypes'

export class HmacAuthService {
  // Generate HMAC Auth header and populate debug info
  static async generateSignature(config: ApiConfig): Promise<debugInfoType> {
    try {
      // Create request line
      const requestLine = `${config.apiMethod.toUpperCase()} ${config.apiEndpoint} HTTP/1.1`

      // Generate date format (RFC7231 Format)
      const now = new Date()
      const formattedDate = now.toUTCString()

      // Convert String To Sign

      //old
      // const stringToSign = `date: ${formattedDate}\nrequest-line:${requestLine}`
      const stringToSign = `date: ${formattedDate}\n${requestLine}`

      // Generate body digest and HMAC signature
      const body = config.requestBody || ''

      const bodyDigest = await HmacCryptoService.generateBodyDigest(body)
      const signature = await HmacCryptoService.generateHmacSignature(
        stringToSign,
        config.clientSecret,
      )

      // Create authorization header
      const authHeader = `hmac username="${config.clientId}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`

      return {
        dateFormat: formattedDate,
        requestLine,
        stringToSign,
        stringToSignJson: JSON.stringify(stringToSign),
        signature,
        bodyDigest,
        authHeader,
        // hasBody,
      }
    } catch (error: any) {
      throw new Error(`Error generating signature: ${error.message}`)
    }
  }
}
