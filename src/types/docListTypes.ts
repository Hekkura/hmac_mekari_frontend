// export interface DocumentAttributes {
//   filename?: string
//   category?: string
//   doc_url?: string
//   signing_status?: string
//   stamping_status?: string
//   signers?: string[]
// }
// export interface Document {
//   id: string
//   type: string
//   attributes: DocumentAttributes
// }

export interface Signer {
  name: string
  email: string
  order: number
  status: string
  signed_at: string | null
  signing_url: string | null
  is_autosign: boolean
}

export interface DocumentAttributes {
  filename: string
  category: string
  doc_url: string
  signing_status: string
  stamping_status: string
  type_of_meterai: string | null
  signers: Signer[]
  created_at: string
  updated_at: string
  template_id: string | null
  is_autosign: boolean
}

export interface Document {
  id: string
  type: string
  attributes: DocumentAttributes
}

export interface DocumentFilters {
  page: number
  limit: number
  category: string
  signing_status: string
  stamping_status: string
}
