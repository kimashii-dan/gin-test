import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { categories } from "../../shared/enums";
import { Card } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <section className="page-layout h-[85vh] items-center justify-start">
        <div className="pt-0 sm:pt-15 md:pt-30 flex">
          <div className="flex justify-center items-center">
            <div className="flex flex-col gap-8 lg:w-200">
              <h1 className="font-nice w-fit italic text-6xl lg:text-8xl text-highlight">
                {t("heroText.title.stroke1")} <br />{" "}
                {t("heroText.title.stroke2")}
              </h1>
              <p className="text-muted-foreground w-full sm:w-2/3 font-medium">
                {t("heroText.description")}
              </p>
              <Button className="w-fit flex gap-2 items-center bg-gradient-to-r from-highlight/80 to-primary/80">
                <span> {t("buttons.getStarted")}</span>
                <ArrowRightIcon className="size-5" />
              </Button>
            </div>
            <div className="hidden lg:block">
              <img src="/images/penguin-student.gif" alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="page-layout">
        <h1 className="page-title">{t("listingForm.category.label")}</h1>
        <div className="cards">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/search?page=1&category=${category.toLowerCase()}`}
            >
              <Card className="flex-col p-10 justify-center items-center gap-8">
                <img
                  src={`/images/categories/${category.toLowerCase()}.png`}
                  className="w-30"
                  alt=""
                />
                <h2 className="text-xl">
                  {t(
                    `listingForm.category.categories.${category.toLowerCase()}`
                  )}
                </h2>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
