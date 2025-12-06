import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import styles from "../../styles.module.css";
import { useState } from "react";
import { Button } from "../../../../shared/ui/button";
import { Card } from "../../../../shared/ui/card";
type SelectSortByProps = {
  setSortBy: (value: string) => void;
  sortBy: string;
};

export default function SelectSortBy({ sortBy, setSortBy }: SelectSortByProps) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    "Title A-Z",
    "Newest first",
    "Oldest first",
    "Low to High",
    "High to Low",
  ];

  const handleTypeChange = (value: string) => {
    setSortBy(value);
    setIsOpen(false);
  };

  return (
    <div className="w-fit">
      <div className="relative">
        <Button
          variant="secondary"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 min-w-fit max-w-40"
        >
          <span>{sortBy}</span>
          <ChevronDownIcon
            className={`size-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {isOpen && (
          <Card className="absolute flex-col gap-2 mt-2 w-full p-2 z-10">
            {options.map((option) => (
              <button
                onClick={() => handleTypeChange(option)}
                className={
                  sortBy === option
                    ? styles.button_active
                    : styles.button_not_active
                }
              >
                <span>{option}</span>
                {sortBy === option && <CheckIcon className="size-5" />}
              </button>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
