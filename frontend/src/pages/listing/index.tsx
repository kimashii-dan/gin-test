import { useParams } from "react-router";

export default function ListingPage() {
  let { id } = useParams();

  return <div>ListingPage: {id}</div>;
}
