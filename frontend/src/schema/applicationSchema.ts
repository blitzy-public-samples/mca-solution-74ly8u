import { z } from 'zod';

const ApplicationStatus = z.enum(['PENDING', 'PROCESSING', 'APPROVED', 'REJECTED', 'REVIEW_REQUIRED']);
const DocumentType = z.enum(['ISO_APPLICATION', 'BANK_STATEMENT', 'VOIDED_CHECK']);

const MerchantSchema = z.object({
  legal_name: z.string(),
  dba_name: z.string(),
  federal_tax_id: z.string(),
  address: z.string(),
  industry: z.string(),
  annual_revenue: z.number().positive(),
});

const OwnerSchema = z.object({
  name: z.string(),
  ssn: z.string(),
  address: z.string(),
  date_of_birth: z.date(),
  ownership_percentage: z.number().min(0).max(100),
});

const FundingDetailsSchema = z.object({
  amount_requested: z.number().positive(),
  use_of_funds: z.string(),
});

const DocumentSchema = z.object({
  id: z.string().uuid(),
  document_type: DocumentType,
  storage_url: z.string().url(),
  uploaded_at: z.date(),
});

const ApplicationSchema = z.object({
  id: z.string().uuid(),
  email_id: z.string().uuid(),
  received_at: z.date(),
  status: ApplicationStatus,
  processed_by: z.string().uuid().optional(),
  merchant: MerchantSchema,
  owners: z.array(OwnerSchema),
  funding_details: FundingDetailsSchema,
  documents: z.array(DocumentSchema),
});

export {
  ApplicationSchema,
  MerchantSchema,
  OwnerSchema,
  FundingDetailsSchema,
  DocumentSchema,
  ApplicationStatus,
  DocumentType,
};