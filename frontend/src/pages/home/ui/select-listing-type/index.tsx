import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

type SelectListingTypeProps = {
  options: string[];
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  isOpen: boolean;
  setListingType: (value: React.SetStateAction<string>) => void;
  listingType: string;
};

export default function SelectListingType({
  options,
  setIsOpen,
  isOpen,
  listingType,
  setListingType,
}: SelectListingTypeProps) {
  const handleTypeChange = (value: string) => {
    setListingType(value);
    setIsOpen(false);
  };

  return (
    <div className="w-30">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full shadow-base flex items-center justify-between px-4 py-2 bg-muted rounded-md"
        >
          <span>{listingType}</span>
          <ChevronDownIcon
            className={`size-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute flex flex-col gap-2 shadow-base top-full mt-2 w-full p-2 rounded-lg border border-border z-10 overflow-hidden bg-card">
            {options.map((option) => (
              <button
                onClick={() => handleTypeChange(option)}
                className={`w-full px-4 py-2 text-left flex items-center justify-between rounded-md hover:bg-muted ${
                  listingType === option && "inset-shadow-medium"
                }`}
              >
                <span>{option}</span>
                {listingType === option && <CheckIcon className="size-5" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
