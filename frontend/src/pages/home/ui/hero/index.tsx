import { useRouteLoaderData } from "react-router";
import { Button } from "../../../../shared/ui/button";
import type { AuthState } from "../../../../shared/types";

export default function Hero() {
  const { auth } = useRouteLoaderData("root") as { auth: AuthState };

  return (
    <section className="">
      <div className="max-w-10/12">
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
