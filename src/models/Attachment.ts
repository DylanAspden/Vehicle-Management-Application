export interface Attachment {
  document_id: number;
  service_id: number;
  format: string;
  file_location: string;
}

export type NewAttachment = Omit<Attachment, "document_id">;