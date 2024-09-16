import { z } from 'zod';

export const validateEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
};

// HUMAN ASSISTANCE NEEDED
// The confidence level for validateTaxId is below 0.8. Please review and adjust as necessary.
export const validateTaxId = (taxId: string): boolean => {
  const taxIdSchema = z.string().regex(/^\d{2}-\d{7}$/);
  return taxIdSchema.safeParse(taxId).success;
};

// HUMAN ASSISTANCE NEEDED
// The confidence level for validateSSN is below 0.8. Please review and adjust as necessary.
export const validateSSN = (ssn: string): boolean => {
  const ssnSchema = z.string().regex(/^\d{3}-\d{2}-\d{4}$/);
  return ssnSchema.safeParse(ssn).success;
};