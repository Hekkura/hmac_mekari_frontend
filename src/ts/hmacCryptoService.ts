// services/hmacCryptoService.ts
// Generate HMAC Body Digest and Header Signature

export class HmacCryptoService {
  //initiate text encoder
  private static encoder = new TextEncoder()

  //Convert raw binary to array of bytes, then turn into string then to base64 (utility function)
  private static toBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    return btoa(String.fromCharCode(...bytes))
  }

  //Generate SHA-256 digest for request body
  //Returns body digest
  static async generateBodyDigest(body: string): Promise<string> {
    const digestData = this.encoder.encode(body)

    const hashBuffer = await crypto.subtle.digest('SHA-256', digestData)
    return this.toBase64(hashBuffer)
  }

  //Generate HMAC-SHA256 signature
  //Returns signature header
  static async generateHmacSignature(stringToSign: string, clientSecret: string): Promise<string> {
    // 1. Import secret key
    const cryptoKey = await crypto.subtle.importKey(
      'raw', // raw key material
      this.encoder.encode(clientSecret), // ArrayBuffer
      { name: 'HMAC', hash: 'SHA-256' }, // algorithm
      false, // not extractable
      ['sign'], // usage
    )

    // 2. Generate HMAC Signature
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, this.encoder.encode(stringToSign))
    return this.toBase64(signature)
  }
}
