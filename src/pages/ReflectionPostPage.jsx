import { submitReflection } from "../services/api";
import { useState } from "react";

export default function ReflectionPostPage() {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      const result = await submitReflection({
        content,
        categories: ["general"],
        anonymous_user_id: "web-user-1",
      });

      console.log("SUCCESS:", result);

      // optional: navigate to success page
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Submit Reflection
      </button>
    </div>
  );
}