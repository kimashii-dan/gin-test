export function formatDateTime(
  isoString: string,
  useUTC: boolean = false
): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const get = (fn: string): number =>
    useUTC ? (date as any)[`getUTC${fn}`]() : (date as any)[`get${fn}`]();

  const day = get("Date").toString().padStart(2, "0");
  const month = (get("Month") + 1).toString().padStart(2, "0");
  const year = get("FullYear");

  const hours = get("Hours").toString().padStart(2, "0");
  const minutes = get("Minutes").toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
