import type { SetURLSearchParams } from "react-router";

type SearchProps = {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
};

export default function Search({ searchParams, setSearchParams }: SearchProps) {
  const searchQuery = searchParams.get("search") || "";

  const setSearchQuery = (value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value.trim()) {
        newParams.set("search", value);
      } else {
        newParams.delete("search");
      }
      return newParams;
    });
  };

  return (
    <input
      type="text"
      className="w-full xs:block hidden"
      placeholder="Search listings..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}
