import { ResponseSummary, ValidationMessages, ValidationResult } from './types';

class ResponseCollector {
  private readonly errors: Record<string, string[]>;
  private readonly warnings: Record<string, string[]>;
  private readonly success: Record<string, string>;

  constructor() {
    this.errors = {};
    this.warnings = {};
    this.success = {};
  }

  buildValidationResults(): ValidationResult[] {
    const errors = this.getErrors();
    const warnings = this.getWarnings();
    const results: Record<string, ValidationResult> = {};
    for (const [id, errMessages] of Object.entries(errors)) {
      this.appendMessageToResults('errors', id, results, errMessages);
    }
    for (const [id, warningMessages] of Object.entries(warnings)) {
      this.appendMessageToResults('warnings', id, results, warningMessages);
    }
    return Object.values(results);
  }

  buildSummary(): ResponseSummary {
    return {
      packagesWithErrors: this.buildValidationResults(),
      successfulPackages: this.getSuccess(),
    };
  }

  addSuccess(packageId: string): void {
    if (!this.success[packageId]) {
      this.success[packageId] = packageId;
    }
  }

  addError(packageId: string, errorMessage: string): void {
    if (!this.errors[packageId]) {
      this.errors[packageId] = [];
    }
    this.errors[packageId].push(errorMessage);
  }

  addWarning(packageId: string, warningMessage: string): void {
    if (!this.warnings[packageId]) {
      this.warnings[packageId] = [];
    }
    this.warnings[packageId].push(warningMessage);
  }

  getSuccess(): string[] {
    return Object.keys(this.success);
  }

  getErrors(): Record<string, string[]> {
    return this.errors;
  }

  getWarnings(): Record<string, string[]> {
    return this.warnings;
  }

  private appendMessageToResults(
    type: keyof ValidationMessages,
    id: string,
    results: Record<string, ValidationResult>,
    values: string[]
  ): void {
    if (!results[id]) {
      results[id] = {
        id,
        errors: [],
        warnings: [],
      };
    }
    results[id][type] = values;
  }
}

export default ResponseCollector;
