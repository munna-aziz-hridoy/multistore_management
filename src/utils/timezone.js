export function convertToLocalDate(dateString) {
  // Create a Date object from the provided string
  const date = new Date(dateString);

  // Convert to local date and time string
  const localDateString = date.toLocaleString();

  return localDateString;
}
