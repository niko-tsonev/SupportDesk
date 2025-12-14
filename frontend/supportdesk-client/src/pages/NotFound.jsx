import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 16 }}>
      <h1>404 - Not Found</h1>
      <Link to="/">Go to Catalog</Link>
    </div>
  );
}
