import { useTranslation } from "react-i18next";
import type { SetURLSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

type SearchProps = {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
};

export default function Search({ searchParams, setSearchParams }: SearchProps) {
  const searchQuery = searchParams.get("query") || "";
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(searchQuery);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        if (location.pathname === "/search") {
          setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.delete("category");
            newParams.set("query", inputValue);
            newParams.set("page", "1");
            return newParams;
          });
        } else {
          navigate(`/search?query=${encodeURIComponent(inputValue)}&page=1`);
        }
      } else if (location.pathname === "/search") {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.delete("query");
          return newParams;
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, location.pathname, navigate, setSearchParams]);

  return (
    <input
      type="text"
      className="w-full md:w-1/2"
      placeholder={t("search.placeholder")}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
}
