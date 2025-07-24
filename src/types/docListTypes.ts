export interface DocumentAttributes {
  filename: string
  category: string
  doc_url: string
  signing_status: string
  stamping_status?: string
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
