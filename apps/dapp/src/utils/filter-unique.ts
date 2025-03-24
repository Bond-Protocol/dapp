export default function filterArrayByUniqueKey<T, K extends keyof T>(
  inputArray: T[],
  key: K
): T[] {
  // Use reduce to create an object with unique keys as keys
  const uniqueKeysObject: Record<string, T> = inputArray.reduce((acc, obj) => {
    const keyValue = obj[key];
    if (!acc[keyValue]) {
      acc[keyValue] = obj;
    }
    return acc;
  }, {} as any);

  // Convert the object back into an array
  const uniqueKeysArray: T[] = Object.values(uniqueKeysObject);

  return uniqueKeysArray;
}
