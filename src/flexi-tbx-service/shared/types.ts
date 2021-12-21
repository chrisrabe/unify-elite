export interface ValidationResult {
  id: string;
  errors: string[];
  warnings: string[];
}

export interface ResponseSummary {
  packagesWithErrors: ValidationResult[];
  successfulPackages: string[];
}

export interface ValidationMessages {
  errors: string[];
  warnings: string[];
}
