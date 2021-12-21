import { ValidationFunction } from './validationFunction';

export interface ValidationRule<T> {
  warningRules: ValidationFunction<T>[];
  errorRules: ValidationFunction<T>[];
}
