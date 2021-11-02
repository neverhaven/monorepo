export async function fallback<TValue, TResult>(
  provider: (value: TValue) => Promise<TResult>,
  values: TValue[],
): Promise<TResult> {
  let error: unknown;

  for (const value of values) {
    try {
      return await provider(value);
    } catch (e) {
      if (error == null) {
        error = e;
      }
    }
  }

  throw error ?? Error('Unknown fallback error');
}
