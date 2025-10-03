import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../../../../shared/api";
import { Button } from "../../../../shared/ui/button";

export default function Hero() {
  const { data } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(),
    retry: false,
  });
  return (
    <section className="">
      <div className="max-w-10/12">
        <div className="">
          <h1 className="text-3xl font-bold">
            Hello there, {data?.user.email ?? "user"}
          </h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <Button variant="primary">Get Started</Button>
        </div>
      </div>
    </section>
  );
}
