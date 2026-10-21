import { useState, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatHookResult {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => void;
}

const AICTE_HANDBOOK_KNOWLEDGE: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ["land", "area", "acres", "plot"],
    answer:
      "Per AICTE Approval Process Handbook (APH) 2024-27, minimum land requirement for Mega/Metro cities is 1.5 Acres, Urban areas 2.5 Acres, and Rural areas 4.0 Acres for Engineering and Technology institutions. The land must be contiguous with clear ownership or registered long-term lease of at least 30 years.",
  },
  {
    keywords: ["faculty", "ratio", "teacher", "professor"],
    answer:
      "For Undergraduate Engineering & Technology programmes, the mandatory Faculty to Student Ratio (FSR) is 1:15 (or 1:20 in select branches per Chapter 2 norms). The cadre ratio among Professor : Associate Professor : Assistant Professor must be maintained at 1 : 2 : 6. Minimum 80% regular faculty must be appointed.",
  },
  {
    keywords: ["document", "upload", "affidavit", "checklist"],
    answer:
      "Mandatory documents for AICTE approval include: 1) Affidavit-1 on Rs.100 stamp paper duly notarized, 2) Land ownership/lease deed registered with competent state authority, 3) Master Plan & Building Plan approved by Town Planning Authority, 4) Fire Safety Certificate from State Fire Service, 5) Structural Stability Certificate from certified Structural Engineer, 6) Occupancy Certificate, and 7) Joint Fixed Deposit Receipts (FDR).",
  },
  {
    keywords: ["built-up", "carpet", "classroom", "laboratory"],
    answer:
      "Instructional area norms require 66 sq.m for standard classrooms (minimum 0.75 classrooms per division), 66 sq.m to 132 sq.m for laboratories depending on curriculum branch, minimum 400 sq.m for Central Library with reading room, and 150 sq.m for Computer Center with minimum 1:4 student-to-computer ratio.",
  },
  {
    keywords: ["deadline", "date", "timeline", "eoa"],
    answer:
      "Annual Extension of Approval (EoA) portal typically opens in December-January. Applications submitted undergo Level-1 automated OCR and norms verification, followed by Scrutiny Committee review, Standing Hearing Committee (SHC) for any discrepancies, and final Executive Committee approval by April 30th.",
  },
  {
    keywords: ["fire", "safety", "noc"],
    answer:
      "A valid Fire Safety Certificate issued by the Chief Fire Officer / competent state government authority is strictly mandatory. Certificates expiring within 6 months must be accompanied by renewal submission acknowledgment receipts to avoid rejection during scrutiny.",
  },
];

export function useChat(): ChatHookResult {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! I am the AICTE Approval Process Handbook (APH) Assistant. You can ask me about land norms, faculty-to-student ratios, building area requirements, mandatory document formats, or scrutiny guidelines.",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const lower = content.toLowerCase();
      const matched = AICTE_HANDBOOK_KNOWLEDGE.find((item) =>
        item.keywords.some((k) => lower.includes(k))
      );

      const replyContent = matched
        ? matched.answer
        : `Regarding "${content}": Under AICTE Approval Process Handbook (APH) guidelines, all technical institutions must adhere to prescribed infrastructure, academic, and administrative norms. Please consult Appendix 1-17 of the handbook or upload your certificate for automated compliance scanning.`;

      const botMessage: Message = { role: "assistant", content: replyContent };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 450);
  }, []);

  return { messages, isLoading, error, sendMessage };
}
