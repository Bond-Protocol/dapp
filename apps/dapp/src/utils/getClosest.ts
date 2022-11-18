/**
 * Gets the closest element to {target} from the {list}
 * @param {list} - the list of elements to search
 * @param {target} - the target value to be compared
 */
export const getClosest = (list: number[], target: number) => {
  return list?.reduce(
    (prev, curr) =>
      Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
    0
  );
};
