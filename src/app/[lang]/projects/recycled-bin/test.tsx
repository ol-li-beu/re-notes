"use client";

import { useToast } from "@/hooks/useToast";
import { useMessage } from "@/hooks/useMessage"; // adjust path if needed
import Message from "@/components/ui/Message/Message";
import { useEffect } from "react";

export default function TestToastButton() {
  const { showToast } = useToast();
  const { message, showMessage, clearMessage } = useMessage();
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  return ( <>
    <div style={{ padding: 20 }}>
      <h2>Toast Test</h2>
      <button onClick={() => showToast("This is a SUCCESS toast!", "success")}>
        Show Success
      </button>

      <button onClick={() => showToast("This is an ERROR toast!", "error")}>
        Show Error
      </button>
    </div>

    <div style={{ padding: 20 }}>
      <h2>Message Test</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => showMessage("success", "This is a SUCCESS message!")}>
          Show Success
        </button>

        <button onClick={() => showMessage("error", "This is an ERROR message!")}>
          Show Error
        </button>

        <button onClick={() => showMessage("info", "This is an INFO message!")}>
          Show Info
        </button>
      </div>

      {message && (
        <Message type={message.type} onClose={clearMessage}>
          {message.text}
        </Message>
      )}
    </div>
    </>
  );
}