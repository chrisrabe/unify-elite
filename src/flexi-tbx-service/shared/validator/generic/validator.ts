import ValidationModel from './validationModel';
import ResponseCollector from '../../responseCollector';
import { ValidationMessages } from '../../types';

type IDExtractor<T, O> = (data: T, options?: O) => string;

class Validator<DataModel, Options> {
  private readonly validationModel: ValidationModel<DataModel>;
  private readonly collector: ResponseCollector;
  private readonly getItemID: IDExtractor<DataModel, Options>;

  constructor(
    validationModel: ValidationModel<DataModel>,
    collector: ResponseCollector,
    getItemID: IDExtractor<DataModel, Options>
  ) {
    this.validationModel = validationModel;
    this.collector = collector;
    this.getItemID = getItemID;
  }

  public isValid(data: DataModel, options?: Options): boolean {
    const validationMessages = this.validationModel.validate(data);
    const id = this.getItemID(data, options);
    this.logValidationMessages(id, validationMessages);
    return validationMessages.errors.length === 0;
  }

  private logValidationMessages(
    id: string,
    validationMessages: ValidationMessages
  ): void {
    validationMessages.warnings.forEach((message) =>
      this.collector.addWarning(id, message)
    );
    validationMessages.errors.forEach((message) =>
      this.collector.addError(id, message)
    );
  }
}

export default Validator;
