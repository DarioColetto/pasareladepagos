import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Middleware para validar requests Express usando esquemas Zod
 * 
 * Valida el cuerpo de la request contra un esquema Zod y responde con errores
 * detallados si la validación falla
 * 
 * @param schema - Esquema Zod para validar el cuerpo de la request
 * @returns Middleware de Express
 */
export const validateRequest =
  (schema: ZodSchema) =>
  (request: Request, response: Response, next: NextFunction) => {
    const resultado = schema.safeParse(request.body);

    if (!resultado.success) {
      return response.status(400).json({
        error: "Datos inválidos",
        details: resultado.error.issues.map((issue) => ({
          campo: issue.path.join("."),
          mensaje: issue.message,
        })),
      });
    }

    // Reemplaza el body con los datos validados y parseados
    request.body = resultado.data;
    next();
  };