import { z } from 'zod';

// Definir el esquema de validación con Zod
export const schemaFormCampaign = z.object({
  service: z.string().min(1, "El identificador es obligatorio"),
  extension: z.string().min(1, "La tipificación es obligatoria"),
});

// Define los tipos del formulario basados en el esquema Zod
export type campaignFormInputs = z.infer<typeof schemaFormCampaign>;
