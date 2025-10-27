export const formatDate = (dateString: string | undefined) => {
  const date = new Date(String(dateString));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
