export interface ValidationFunctionResponse {
  isValid: boolean;
  messages: string[];
}

export type ValidationFunction<T> = (data: T) => ValidationFunctionResponse;
