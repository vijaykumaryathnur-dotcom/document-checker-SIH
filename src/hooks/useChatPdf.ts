import { useState, useEffect, useCallback, useRef } from "react";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

const ERROR_SOLUTIONS: Array<{ keywords: string[]; solution: string }> = [
  {
    keywords: ["signature", "sign", "stamp", "seal", "notary"],
    answer:
      "Per AICTE Handbook guidelines for Affidavit-1 & Affidavit-2: The document must be executed on Non-Judicial stamp paper of minimum Rs. 100/- and duly attested by a First Class Judicial Magistrate or Public Notary with their official registration number, stamp, and seal dated within 90 days of submission.",
  },
  {
    keywords: ["date", "format", "dd/mm/yyyy"],
    answer:
      "The date format should strictly follow DD/MM/YYYY. Ensure the date of resolution by the Trust/Society matches the date referenced in the affidavit preamble.",
  },
  {
    keywords: ["area", "carpet", "mismatch", "sq.m"],
    answer:
      "AICTE norm requires minimum 4,000 sq.m total built-up area for the sanctioned intake. The instructional area must be certified by an approved Architect registered with Council of Architecture (CoA) using AICTE Certificate-1 format.",
  },
  {
    keywords: ["spelling", "name", "trust", "organization"],
    answer:
      "The institution and trust name must match character-by-character with the Registration Certificate issued by the Registrar of Societies / Charity Commissioner.",
  },
];

export function useChatPdf(url: string, pdfUrl: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      content:
        "Hello! I am your AICTE Document Compliance Assistant. I can help explain highlighted errors in this document and guide you on rectifying them to pass scrutiny.",
    },
  ]);
  const [isConnected, setIsConnected] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    try {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.content) {
            setMessages((prev) => [
              ...prev,
              { id: Date.now(), role: "ai", content: data.content },
            ]);
          }
        } catch {
          // ignore
        }
      };

      socket.onclose = () => {
        // Keep active for in-app fallback assistant
        setIsConnected(true);
      };

      socket.onerror = () => {
        setIsConnected(true);
      };

      socketRef.current = socket;
    } catch {
      setIsConnected(true);
    }
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const newUserMessage: Message = { id: Date.now(), role: "user", content };
    setMessages((prev) => [...prev, newUserMessage]);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: content, pdf_url: pdfUrl }));
    } else {
      setTimeout(() => {
        const lower = content.toLowerCase();
        const matched = ERROR_SOLUTIONS.find((s) =>
          s.keywords.some((k) => lower.includes(k))
        );

        const reply = matched
          ? matched.answer
          : `For "${content}": Verify that this section strictly complies with AICTE Approval Process Handbook (APH) 2024-27 norms. You can use the editor below to rectify the text or upload an updated signed PDF.`;

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "ai", content: reply },
        ]);
      }, 500);
    }
  }, [pdfUrl]);

  return { messages, sendMessage, isConnected };
}
