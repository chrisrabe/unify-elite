export function notUndefined<TValue>(
  value: TValue | undefined
): value is TValue {
  return value !== undefined;
}

export function notNull<TValue>(value: TValue | null): value is TValue {
  return value !== null;
}

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return notUndefined(value) && notNull(value);
}

export function ensure<T>(
  argument: T | undefined | null,
  message = 'This value was promised to be there.'
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}
