import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-light text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-600">401</h1>
        <h2 className="text-4xl mt-4 font-bebas text-purple-400">
          Unauthorized Access
        </h2>
        <p className="my-6 text-lg text-black-muted">
          Sorry, you don&apos;t have permission to view this page.
        </p>
        <Link
          href={"/home"}
          className="mt-8 px-6 py-3 bg-purple-800 text-white rounded-lg hover:bg-purple-600"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}
