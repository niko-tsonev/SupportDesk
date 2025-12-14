export default function ReplyList({ replies }) {
  if (!replies.length) {
    return <p className="text-sm text-gray-500">No replies yet.</p>;
  }

  return (
    <div className="space-y-4">
      {replies.map((r) => (
        <div
          key={r.id}
          className={`p-4 rounded border ${
            r.isInternal
              ? "bg-yellow-50 border-yellow-300"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {r.message}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {r.isInternal ? "Internal note" : "Public reply"} ·{" "}
            {new Date(r.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
