import { useNavigate } from "react-router";
import { Button } from "../button";
import { useTranslation } from "react-i18next";

export default function EmptyData({ text }: { text: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center h-[50vh] gap-5 w-full">
      <h2 className="text-2xl font-medium text-center">{text}</h2>
      <Button onClick={() => navigate("/")}>{t("buttons.goToHome")}</Button>
    </div>
  );
}
