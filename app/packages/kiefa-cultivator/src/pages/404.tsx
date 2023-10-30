import Link from "next/link";

export default function Custom404() {
  return (
    <div className="pageNotFoundWrapper">
      <div className="pageNotFoundText">
        <h6>
          <b>404! - The requested page was not found.</b>
        </h6>
        <p>
          <Link href="/">Click Here</Link> to return back to the Homepage.
        </p>
      </div>
    </div>
  );
}
