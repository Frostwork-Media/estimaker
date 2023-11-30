/**
 * Given a value in the form of a number,
 * or a `number to number`, parse an array
 * of numbers
 *
 * Use a regex to extract numbers
 */
export function parseLinkValue(value: string): number[] {
  const numbers = value.match(/[\d.]+/g);

  if (numbers === null) {
    return [];
  }

  return numbers.map((number) => parseFloat(number));
}
