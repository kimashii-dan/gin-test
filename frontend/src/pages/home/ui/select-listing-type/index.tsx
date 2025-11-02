import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../../shared/ui/button";
import { Card } from "../../../../shared/ui/card";
import styles from "../../styles.module.css";
import { useState } from "react";
type SelectListingTypeProps = {
  setListingType: (value: React.SetStateAction<string>) => void;
  listingType: string;
};

export default function SelectListingType({
  listingType,
  setListingType,
}: SelectListingTypeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["All", "Mine"];

  const handleTypeChange = (value: string) => {
    setListingType(value);
    setIsOpen(false);
  };

  return (
    <div className="w-30">
      <div className="relative">
        <Button
          variant="secondary"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between"
        >
          <span>{listingType}</span>
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
                  listingType === option
                    ? styles.button_active
                    : styles.button_not_active
                }
              >
                <span>{option}</span>
                {listingType === option && <CheckIcon className="size-5" />}
              </button>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
