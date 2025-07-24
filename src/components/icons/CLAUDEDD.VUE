<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HMAC API Tester</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.global.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background: #f5f5f5;
      }
      .container {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .form-group {
        margin-bottom: 20px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #333;
      }
      input,
      select,
      textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
      }
      textarea {
        min-height: 100px;
        font-family: 'Courier New', monospace;
      }
      .button-group {
        display: flex;
        gap: 10px;
        margin: 20px 0;
      }
      button {
        padding: 12px 24px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
      }
      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-primary:hover {
        background: #0056b3;
      }
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
      .btn-secondary:hover {
        background: #545b62;
      }
      .debug-section {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 5px;
        margin-top: 20px;
      }
      .debug-item {
        margin: 10px 0;
        padding: 10px;
        background: white;
        border-radius: 3px;
        border-left: 4px solid #007bff;
      }
      .debug-item strong {
        color: #007bff;
      }
      .response-section {
        margin-top: 20px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 5px;
      }
      .response-success {
        border-left: 4px solid #28a745;
      }
      .response-error {
        border-left: 4px solid #dc3545;
      }
      .code-block {
        background: #2d3748;
        color: #e2e8f0;
        padding: 15px;
        border-radius: 5px;
        font-family: 'Courier New', monospace;
        overflow-x: auto;
        white-space: pre;
        font-size: 12px;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      @media (max-width: 768px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div class="container">
        <h1>🔐 HMAC API Tester</h1>

        <div class="grid">
          <div>
            <div class="form-group">
              <label>API URL:</label>
              <input
                v-model="apiUrl"
                type="text"
                placeholder="https://sandbox-api.mekari.com/v2/esign-hmac/v1/profile"
              />
            </div>

            <div class="form-group">
              <label>HTTP Method:</label>
              <select v-model="method">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div class="form-group">
              <label>Client ID:</label>
              <input v-model="clientId" type="text" placeholder="Your client ID" />
            </div>

            <div class="form-group">
              <label>Client Secret:</label>
              <input v-model="clientSecret" type="password" placeholder="Your client secret" />
            </div>
          </div>

          <div>
            <div class="form-group">
              <label>Request Body (JSON):</label>
              <textarea v-model="requestBody" placeholder='{"key": "value"}'></textarea>
            </div>

            <div class="form-group">
              <label>Additional Headers:</label>
              <textarea
                v-model="additionalHeaders"
                placeholder='{"Content-Type": "application/json"}'
              ></textarea>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button @click="generateSignature" class="btn-primary">🔐 Generate HMAC Signature</button>
          <button @click="sendRequest" class="btn-secondary">🚀 Send Request</button>
          <button @click="clearAll" class="btn-secondary">🗑️ Clear All</button>
        </div>

        <div v-if="debugInfo" class="debug-section">
          <h3>🔍 Debug Information</h3>
          <div class="debug-item"><strong>Generated Date:</strong> {{ debugInfo.date }}</div>
          <div class="debug-item"><strong>Request Line:</strong> {{ debugInfo.requestLine }}</div>
          <div class="debug-item">
            <strong>String to Sign:</strong>
            <div class="code-block">{{ debugInfo.stringToSign }}</div>
          </div>
          <div class="debug-item">
            <strong>String to Sign (JSON):</strong>
            <div class="code-block">{{ debugInfo.stringToSignJson }}</div>
          </div>
          <div class="debug-item">
            <strong>Generated Signature:</strong> {{ debugInfo.signature }}
          </div>
          <div class="debug-item"><strong>Body Digest:</strong> {{ debugInfo.bodyDigest }}</div>
          <div class="debug-item">
            <strong>Authorization Header:</strong>
            <div class="code-block">{{ debugInfo.authHeader }}</div>
          </div>
        </div>

        <div
          v-if="response"
          class="response-section"
          :class="response.success ? 'response-success' : 'response-error'"
        >
          <h3>📡 API Response</h3>
          <div class="debug-item"><strong>Status:</strong> {{ response.status }}</div>
          <div class="debug-item">
            <strong>Response:</strong>
            <div class="code-block">{{ response.data }}</div>
          </div>
          <div v-if="response.headers" class="debug-item">
            <strong>Response Headers:</strong>
            <div class="code-block">{{ response.headers }}</div>
          </div>
        </div>
      </div>
    </div>

    <script>
      const { createApp } = Vue

      createApp({
        data() {
          return {
            apiUrl: 'https://sandbox-api.mekari.com/v2/esign-hmac/v1/profile',
            method: 'GET',
            clientId: '',
            clientSecret: '',
            requestBody: '',
            additionalHeaders: '{"Content-Type": "application/json"}',
            debugInfo: null,
            response: null,
          }
        },

        mounted() {
          // Load saved credentials from localStorage
          this.clientId = localStorage.getItem('hmac_client_id') || ''
          this.clientSecret = localStorage.getItem('hmac_client_secret') || ''
        },

        watch: {
          // Save credentials to localStorage when they change
          clientId(newVal) {
            localStorage.setItem('hmac_client_id', newVal)
          },
          clientSecret(newVal) {
            localStorage.setItem('hmac_client_secret', newVal)
          },
        },
        methods: {
          generateSignature() {
            try {
              // Parse URL
              const url = new URL(this.apiUrl)
              const pathWithQuery = url.pathname + url.search

              // Generate current date
              const now = new Date()
              const formattedDate = now.toUTCString()

              // Create request line
              const requestLine = `${this.method} ${pathWithQuery} HTTP/1.1`

              // Create string to sign
              const stringToSign = `date: ${formattedDate}\nrequest-line: ${requestLine}`

              // Calculate body digest
              const body = this.requestBody || ''
              const bodyHash = CryptoJS.SHA256(body)
              const bodyDigest = CryptoJS.enc.Base64.stringify(bodyHash)

              // Calculate HMAC signature
              const signature = CryptoJS.HmacSHA256(stringToSign, this.clientSecret)
              const base64Signature = CryptoJS.enc.Base64.stringify(signature)

              // Create authorization header
              const authHeader = `hmac username="${this.clientId}", algorithm="hmac-sha256", headers="date request-line", signature="${base64Signature}"`

              // Store debug info
              this.debugInfo = {
                date: formattedDate,
                requestLine: requestLine,
                stringToSign: stringToSign,
                stringToSignJson: JSON.stringify(stringToSign),
                signature: base64Signature,
                bodyDigest: bodyDigest,
                authHeader: authHeader,
              }
            } catch (error) {
              alert('Error generating signature: ' + error.message)
            }
          },

          async sendRequest() {
            if (!this.debugInfo) {
              this.generateSignature()
            }

            try {
              // Parse additional headers
              let headers = {}
              if (this.additionalHeaders) {
                headers = JSON.parse(this.additionalHeaders)
              }

              // Add required headers
              headers['Date'] = this.debugInfo.date
              headers['Authorization'] = this.debugInfo.authHeader

              // Add digest header if we have a body
              if (
                this.requestBody &&
                (this.method === 'POST' ||
                  this.method === 'PUT' ||
                  this.method === 'PATCH' ||
                  this.method === 'DELETE')
              ) {
                headers['Digest'] = `SHA-256=${this.debugInfo.bodyDigest}`
              }

              // Prepare request options
              const requestOptions = {
                method: this.method,
                headers: headers,
                mode: 'cors',
              }

              // Add body if present
              if (this.requestBody && this.method !== 'GET') {
                requestOptions.body = this.requestBody
              }

              // Send request
              const response = await fetch(this.apiUrl, requestOptions)
              const responseText = await response.text()

              // Parse response
              let responseData
              try {
                responseData = JSON.parse(responseText)
              } catch {
                responseData = responseText
              }

              // Store response
              this.response = {
                success: response.ok,
                status: `${response.status} ${response.statusText}`,
                data: JSON.stringify(responseData, null, 2),
                headers: JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2),
              }
            } catch (error) {
              this.response = {
                success: false,
                status: 'Error',
                data: error.message,
                headers: null,
              }
            }
          },

          clearAll() {
            this.clientId = ''
            this.clientSecret = ''
            this.requestBody = ''
            this.debugInfo = null
            this.response = null
          },
        },
      }).mount('#app')
    </script>
  </body>
</html>
