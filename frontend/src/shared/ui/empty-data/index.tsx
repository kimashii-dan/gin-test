import { useNavigate } from "react-router";
import { Button } from "../button";

export default function EmptyData({ text }: { text: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-[5  0vh] gap-5 w-full">
      <h2 className="text-3xl font-medium text-center">{text}</h2>
      <Button onClick={() => navigate("/")}>Go to Home</Button>
    </div>
  );
}
