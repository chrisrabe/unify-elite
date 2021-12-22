export type MappingFunction<Input, Output> = (
  input: Input,
  logMessage: (message: string) => void // logs errors we encounter during mapping
) => Output;
