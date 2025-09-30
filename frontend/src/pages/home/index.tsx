import { useQuery } from "@tanstack/react-query";
import { getUserData } from "./api";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(),
    retry: false,
  });

  return (
    <main className="hero">
      <div className="hero-content text-center">
        <div className="">
          <h1 className="text-5xl font-bold">
            Hello there, {data?.userEmail ?? "user"}
          </h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </main>
  );
}
