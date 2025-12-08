import { useState } from "react";
import { CheckIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { Card } from "../card";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.css";

export default function LangToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    console.log(lang);
    i18n.changeLanguage(lang);
    // console.log(i18n.language);
    setIsOpen(false);
  };

  const languages = ["en", "ru"];

  return (
    <div className="relative">
      <button
        className="p-2 border-border border-1 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <GlobeAltIcon className="size-5" />
      </button>

      {isOpen && (
        <Card className="absolute flex-col gap-2 mt-2 w-fit p-2 z-10">
          {languages.map((lang) => (
            <button
              onClick={() => handleLanguageChange(lang)}
              className={
                i18n.language === lang
                  ? styles.button_active
                  : styles.button_not_active
              }
              key={lang}
            >
              <span>{t(`langs.${lang}`)}</span>
              {i18n.language === lang && <CheckIcon className="size-5" />}
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
