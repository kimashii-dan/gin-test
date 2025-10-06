import { useRouteLoaderData } from "react-router";
import { Button } from "../../../../shared/ui/button";
import type { AuthState } from "../../../../shared/types";

export default function Hero() {
  const { auth } = useRouteLoaderData("root") as { auth: AuthState };

  return (
    <section className="h-[75vh]">
      <div className="max-w-11/12 md:max-w-9/12 break-all">
        <div className="">
          <h1 className="text-3xl font-bold">
            Hello there, {auth.user?.email ?? "user"}
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
