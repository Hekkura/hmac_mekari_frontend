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
      // const stringToSign = `date: ${formattedDate}\nrequest-line:${requestLine}`
      const stringToSign = `date: ${formattedDate}\n${requestLine}`

      //Generate body digest only for API methods with bodies.
      const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE']
      const hasBody = methodsWithBody.includes(config.apiMethod.toUpperCase())

      let bodyDigest = ''
      if (hasBody && config.requestBody) {
        //ensure body is a string (handle objects)
        //if yes return body, if not use json stringify to cast to string
        const bodyString =
          typeof config.requestBody === 'string'
            ? config.requestBody
            : JSON.stringify(config.requestBody)

        bodyDigest = await HmacCryptoService.generateBodyDigest(bodyString)
      }

      //Generate HMAC Signature
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
        hasBody,
      }
    } catch (error: any) {
      throw new Error(`Error generating signature: ${error.message}`)
    }
  }

  static buildRequestHeaders(debugInfo: debugInfoType): Record<string, string> {
    const headers: Record<string, string> = {
      Authorization: debugInfo.authHeader,
      Date: debugInfo.dateFormat,
      'Content-Type': 'application/json',
    }

    //add Digest if body digest exists
    if (debugInfo.bodyDigest) {
      headers['Digest'] = `SHA-256=${debugInfo.bodyDigest}`
    }

    return headers
  }
}
