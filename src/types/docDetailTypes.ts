// Top-level response
export interface DocumentDetailResponse {
  data: DocumentDetail
}

// The document structure
export interface DocumentDetail {
  id: string
  type: string
  attributes: DocumentAttributes
}

// Attributes inside the document
export interface DocumentAttributes {
  filename: string
  category: string
  doc_url: string
  signing_status: 'success' | 'in_progress' | 'failed' | string
  stamping_status: 'success' | 'failed' | 'none' | string
  created_at: string
  updated_at: string
  signers: Signer[]
  invalided?: Invalided // optional because not all documents may be voided
}

// Signers
export interface Signer {
  name: string
  email: string
  order: number
  signing_status: 'completed' | 'your_turn' | 'awaiting' | string
}

// Voided/invalided info
export interface Invalided {
  type_of: 'voided' | 'rejected' | string
  reason: string
  invalid_by: {
    full_name: string
    email: string
  }
  invalid_at: string
}
