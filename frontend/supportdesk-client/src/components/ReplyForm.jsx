import { useState } from "react";

export default function ReplyForm({ onSubmit }) {
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSubmit({
      message,
      isInternal
    });

    setMessage("");
    setIsInternal(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4 mt-6">
      <textarea
        className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-secondary"
        rows={4}
        placeholder="Write your reply..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            className="mr-2"
            checked={isInternal}
            onChange={(e) => setIsInternal(e.target.checked)}
          />
          Internal note
        </label>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
        >
          Send reply
        </button>
      </div>
    </form>
  );
}
