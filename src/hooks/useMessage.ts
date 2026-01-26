"use client";

import { useState } from "react";

type MessageType = "error" | "success" | "info";

interface MessageState {
  type: MessageType;
  text: string;
}

export function useMessage() {
  const [message, setMessage] = useState<MessageState | null>(null);

  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text });
  };

  const clearMessage = () => setMessage(null);

  return {
    message,
    showMessage,
    clearMessage,
  };
}