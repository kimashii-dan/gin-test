import { Link } from "react-router";
import { Button } from "../../../../shared/ui/button";
import { useAuth } from "../../../../shared/core/auth";

export default function Hero() {
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;

  return (
    <section className="h-[75vh]">
      <div className="max-w-11/12 md:max-w-9/12 break-all">
        <div className="">
          <h1 className="text-3xl font-bold">
            {isLoading
              ? "Hello there, loading..."
              : user
              ? `Hello there, ${user.name || user.email}`
              : "Hello there, welcome!"}
          </h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          {user ? (
            <Link to="/profile">
              <Button variant="primary">Go to Profile</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="primary">Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
