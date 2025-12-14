export default function StatusBadge({ status }) {
  let text = "Unknown";
  let classes = "bg-gray-200 text-gray-800";

  if (status === 0) {
    text = "New";
    classes = "bg-blue-100 text-blue-800";
  } else if (status === 1) {
    text = "In Progress";
    classes = "bg-yellow-100 text-yellow-800";
  } else if (status === 2) {
    text = "Closed";
    classes = "bg-green-100 text-green-800";
  }

  return (
    <span className={`text-xs px-2 py-1 rounded ${classes}`}>
      {text}
    </span>
  );
}
