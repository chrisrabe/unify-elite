import { ValidationRule } from './validationRule';
import { ValidationMessages } from '../../types';

class ValidationModel<T> {
  private readonly validationRules: ValidationRule<T>;

  constructor(validationRules: ValidationRule<T>) {
    this.validationRules = validationRules;
  }

  validate(data: T): ValidationMessages {
    const validationMessages: ValidationMessages = {
      warnings: [],
      errors: [],
    };
    for (const validateRule of this.validationRules.warningRules) {
      const result = validateRule(data);
      if (!result.isValid) {
        result.messages.forEach((message) =>
          validationMessages.warnings.push(message)
        );
      }
    }
    for (const validateRule of this.validationRules.errorRules) {
      const result = validateRule(data);
      if (!result.isValid) {
        result.messages.forEach((message) =>
          validationMessages.errors.push(message)
        );
      }
    }
    return validationMessages;
  }
}

export default ValidationModel;
