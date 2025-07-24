<template>
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
      <div class="debug-item"><strong>Generated Signature:</strong> {{ debugInfo.signature }}</div>
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
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import CryptoJS from 'crypto-js'

const apiUrl = ref('https://sandbox-api.mekari.com/v2/esign-hmac/v1/profile')
const method = ref('GET')
const clientId = ref('')
const clientSecret = ref('')
const requestBody = ref('')
const additionalHeaders = ref('{"Content-Type": "application/json"}')
const debugInfo = ref(null)
const response = ref(null)

onMounted(() => {
  clientId.value = localStorage.getItem('hmac_client_id') || ''
  clientSecret.value = localStorage.getItem('hmac_client_secret') || ''
})

watch(clientId, (val) => localStorage.setItem('hmac_client_id', val))
watch(clientSecret, (val) => localStorage.setItem('hmac_client_secret', val))

function generateSignature() {
  try {
    const url = new URL(apiUrl.value)
    const pathWithQuery = url.pathname + url.search
    const now = new Date()
    const formattedDate = now.toUTCString()
    const requestLine = `${method.value} ${pathWithQuery} HTTP/1.1`
    const stringToSign = `date: ${formattedDate}\nrequest-line: ${requestLine}`
    const bodyHash = CryptoJS.SHA256(requestBody.value || '')
    const bodyDigest = CryptoJS.enc.Base64.stringify(bodyHash)
    const signature = CryptoJS.HmacSHA256(stringToSign, clientSecret.value)
    const base64Signature = CryptoJS.enc.Base64.stringify(signature)
    const authHeader = `hmac username=\"${clientId.value}\", algorithm=\"hmac-sha256\", headers=\"date request-line\", signature=\"${base64Signature}\"`

    debugInfo.value = {
      date: formattedDate,
      requestLine,
      stringToSign,
      stringToSignJson: JSON.stringify(stringToSign),
      signature: base64Signature,
      bodyDigest,
      authHeader,
    }
  } catch (e) {
    alert('Error generating signature: ' + e.message)
  }
}

async function sendRequest() {
  if (!debugInfo.value) generateSignature()

  try {
    let headers = {}
    if (additionalHeaders.value) {
      headers = JSON.parse(additionalHeaders.value)
    }

    headers['Date'] = debugInfo.value.date
    headers['Authorization'] = debugInfo.value.authHeader

    if (requestBody.value && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.value)) {
      headers['Digest'] = `SHA-256=${debugInfo.value.bodyDigest}`
    }

    const requestOptions = {
      method: method.value,
      headers,
      mode: 'cors',
    }

    if (requestBody.value && method.value !== 'GET') {
      requestOptions.body = requestBody.value
    }

    const res = await fetch(apiUrl.value, requestOptions)
    const text = await res.text()
    let parsedData
    try {
      parsedData = JSON.parse(text)
    } catch {
      parsedData = text
    }

    response.value = {
      success: res.ok,
      status: `${res.status} ${res.statusText}`,
      data: JSON.stringify(parsedData, null, 2),
      headers: JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2),
    }
  } catch (err) {
    response.value = {
      success: false,
      status: 'Error',
      data: err.message,
      headers: null,
    }
  }
}

function clearAll() {
  clientId.value = ''
  clientSecret.value = ''
  requestBody.value = ''
  debugInfo.value = null
  response.value = null
}
</script>

<style scoped>
/* Insert your CSS from <style> tag here if needed */
</style>
