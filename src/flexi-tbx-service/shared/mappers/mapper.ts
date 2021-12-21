import ResponseCollector from '../responseCollector';

abstract class Mapper<Input, Output> {
  protected readonly collector: ResponseCollector;

  constructor(collector: ResponseCollector) {
    this.collector = collector;
  }

  abstract map(input: Input): Output;
}

export default Mapper;
