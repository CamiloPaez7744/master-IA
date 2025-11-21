import { ValidationError } from './ValidationError';
import { NotFoundError } from './NotFoundError';
import { ConflictError } from './ConflictError';
import { InfraError } from './InfraError';

/**
 * AppError
 * Unión discriminada de todos los errores de aplicación posibles
 */
export type AppError = 
  | ValidationError 
  | NotFoundError 
  | ConflictError 
  | InfraError;

/**
 * Type guards para identificar el tipo de error
 */
export const isValidationError = (error: AppError): error is ValidationError => {
  return error.type === 'ValidationError';
};

export const isNotFoundError = (error: AppError): error is NotFoundError => {
  return error.type === 'NotFoundError';
};

export const isConflictError = (error: AppError): error is ConflictError => {
  return error.type === 'ConflictError';
};

export const isInfraError = (error: AppError): error is InfraError => {
  return error.type === 'InfraError';
};
