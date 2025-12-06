import { useNavigate, type SetURLSearchParams } from "react-router";

type SearchProps = {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
};

export default function Search({ searchParams, setSearchParams }: SearchProps) {
  const searchQuery = searchParams.get("search") || "";
  const navigate = useNavigate();

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
    navigate(`/?search=${value}`);
  };

  return (
    <input
      type="text"
      className="w-full xs:hidden block"
      placeholder="Search listings..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}
