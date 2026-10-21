import applicationTypes from "@/data/applicationTypes.json";

export interface StoredInstitute {
  id: string;
  universityName: string;
  instituteType: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  pincode: string;
  address?: string;
  aictePermanentId?: string;
}

export interface StoredDocument {
  uni_doc_id: string;
  doc_id: string;
  uni_doc_name: string;
  uni_doc_uri: string;
  status: "NOT_SUBMITTED" | "ASSIGNED" | "APPROVED" | "REJECTED";
  timestamp: string;
  errors: any[];
  extractedTexts?: Record<string, any>;
  messages?: Array<{ message: { id: number; timestamp: string; content: string; category?: string } }>;
  assigned_evaluator?: Array<{ check_type: string; status: string }>;
  document: {
    doc_id: string;
    doc_name: string;
    format_uri: string;
  };
}

export interface StoredApplication {
  uni_application_id: string;
  createdOn: string;
  universityId: string;
  application: {
    application_id: string;
    application_name: string;
    application_description: string;
    documents: any[];
  };
  UniversityDocuments: StoredDocument[];
}

const STORAGE_KEY_INSTITUTE = "aicte_mock_institute";
const STORAGE_KEY_APPLICATIONS = "aicte_mock_applications";
const STORAGE_KEY_EVALUATOR = "aicte_mock_evaluator";

const initialInstitute: StoredInstitute = {
  id: "UNI-98234-DELHI",
  universityName: "Future Bright Academy of Engineering & Technology",
  instituteType: "Private / Self-Financed Engineering Institute",
  email: "registrar@futurebright.edu.in",
  phone: "+91 11 2958 1000",
  state: "Delhi",
  district: "South West Delhi",
  pincode: "110070",
  address: "Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070",
  aictePermanentId: "1-932187654",
};

const sampleErrorHighlights = [
  {
    content: { text: "Missing authorized signatory stamp" },
    position: {
      boundingRect: { x1: 100, y1: 200, x2: 300, y2: 250, width: 200, height: 50, pageNumber: 1 },
      rects: [{ x1: 100, y1: 200, x2: 300, y2: 250 }],
      pageNumber: 1,
    },
    comment: "Signatory seal of the Trust Chairperson is missing on page 1 per AICTE Approval Process Handbook (APH) 2024-27 norms.",
    id: "highlight-1",
  },
  {
    content: { text: "Land carpet area mismatch with master layout" },
    position: {
      boundingRect: { x1: 50, y1: 150, x2: 250, y2: 175, width: 200, height: 25, pageNumber: 2 },
      rects: [{ x1: 50, y1: 150, x2: 250, y2: 175 }],
      pageNumber: 2,
    },
    comment: "The built-up area specified (3,850 sq.m) is below the minimum mandatory threshold of 4,000 sq.m for the proposed engineering intake.",
    id: "highlight-2",
  },
  {
    content: { text: "Missing latest Notary endorsement seal" },
    position: {
      boundingRect: { x1: 200, y1: 100, x2: 350, y2: 150, width: 150, height: 50, pageNumber: 3 },
      rects: [{ x1: 200, y1: 100, x2: 350, y2: 150 }],
      pageNumber: 3,
    },
    comment: "Notarization date must be within 90 days of application submission deadline.",
    id: "highlight-3",
  },
];

const sampleExtractedTexts = {
  "Trust Name & Resolution": {
    value: "Approval Process Handbook 2024-2027\nFORMAT-1: No Objection Certificate & Trust Resolution\nExecutive committee resolution held on 15-Nov-2024 vide agenda item 4.2",
    analysis: {
      is_valid: true,
      confidence: 0.92,
      issues: ["Trust resolution date matches AICTE window, but registration number format requires standard prefix."],
      suggestions: ["Ensure the full trust registration number with State Registrar of Societies is clearly legibly stamped."],
      bbox: [12, 3],
    },
  },
  "Built-up Carpet Area Norms": {
    value: "Total Proposed Built-up Area: 4,250 sq.m (Instructional: 2,600 sq.m, Administrative: 850 sq.m, Amenities: 800 sq.m)",
    analysis: {
      is_valid: true,
      confidence: 0.88,
      issues: ["Instructional area meets AICTE standard for 300 sanctioned student intake."],
      suggestions: ["Attach certified architect stability certificate verifying barrier-free accessibility / ramp provisions."],
      bbox: [45, 12],
    },
  },
  "Fire Safety NOC Status": {
    value: "Fire Safety Certificate No. FSC/2023/8912 issued by Delhi Fire Services, valid up to 31-Dec-2024",
    analysis: {
      is_valid: true,
      confidence: 0.95,
      issues: ["Certificate nearing expiry. Renewal application or valid NOC extension letter required before final scrutiny."],
      suggestions: ["Upload fire safety renewal acknowledgment receipt along with present certificate."],
      bbox: [80, 25],
    },
  },
};

const initialApplications: StoredApplication[] = [
  {
    uni_application_id: "APP-2024-9102",
    createdOn: new Date(Date.now() - 3 * 86400000).toISOString(),
    universityId: initialInstitute.id,
    application: {
      application_id: "eoa",
      application_name: "Extension of Approval (EoA) 2024-25",
      application_description: "Annual Extension of Approval application for existing B.Tech Programmes in Computer Science, Electronics, and Mechanical Engineering.",
      documents: applicationTypes.find((a) => a.id === "eoa")?.documents || [],
    },
    UniversityDocuments: (applicationTypes.find((a) => a.id === "eoa")?.documents || []).map((doc, idx) => ({
      uni_doc_id: `doc-eoa-${idx + 1}`,
      doc_id: doc.id,
      uni_doc_name: doc.name,
      uni_doc_uri: doc.pdfPath || "https://www.aicte-india.org/sites/default/files/FORMAT-1.pdf",
      status: idx === 0 ? "ASSIGNED" : idx === 1 ? "APPROVED" : "NOT_SUBMITTED",
      timestamp: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
      errors: idx === 0 ? sampleErrorHighlights : [],
      extractedTexts: sampleExtractedTexts,
      messages: [
        {
          message: {
            id: 1,
            timestamp: new Date(Date.now() - 86400000).toLocaleString(),
            content: "Scrutiny committee noted that the notary stamp should be clearly legible. Please check the highlighted zone.",
            category: "warning",
          },
        },
      ],
      assigned_evaluator: [
        { check_type: "Document Forgery & Authenticity", status: idx === 0 ? "ASSIGNED" : "APPROVED" },
        { check_type: "AICTE Handbook Norms Compliance", status: idx === 0 ? "ASSIGNED" : "APPROVED" },
      ],
      document: {
        doc_id: doc.id,
        doc_name: doc.name,
        format_uri: doc.pdfPath || "",
      },
    })),
  },
  {
    uni_application_id: "APP-2024-8841",
    createdOn: new Date(Date.now() - 10 * 86400000).toISOString(),
    universityId: initialInstitute.id,
    application: {
      application_id: "new_institute",
      application_name: "New Programme: B.Tech in Artificial Intelligence & Machine Learning",
      application_description: "Application for introducing 60 intake seats for AI & ML under technical education wing.",
      documents: applicationTypes.find((a) => a.id === "new_institute")?.documents || [],
    },
    UniversityDocuments: (applicationTypes.find((a) => a.id === "new_institute")?.documents || []).slice(0, 4).map((doc, idx) => ({
      uni_doc_id: `doc-ni-${idx + 1}`,
      doc_id: doc.id,
      uni_doc_name: doc.name,
      uni_doc_uri: doc.pdfPath || "https://www.aicte-india.org/sites/default/files/FORMAT-1.pdf",
      status: "APPROVED",
      timestamp: new Date(Date.now() - 8 * 86400000).toISOString(),
      errors: [],
      extractedTexts: sampleExtractedTexts,
      messages: [
        {
          message: {
            id: 1,
            timestamp: new Date(Date.now() - 7 * 86400000).toLocaleString(),
            content: "Approved by National Scrutiny Committee for Stage 1 evaluation.",
            category: "success",
          },
        },
      ],
      assigned_evaluator: [
        { check_type: "Document Forgery & Authenticity", status: "APPROVED" },
        { check_type: "Infrastructure Standards", status: "APPROVED" },
      ],
      document: {
        doc_id: doc.id,
        doc_name: doc.name,
        format_uri: doc.pdfPath || "",
      },
    })),
  },
];

export function getMockInstitute(): StoredInstitute {
  const stored = localStorage.getItem(STORAGE_KEY_INSTITUTE);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_INSTITUTE, JSON.stringify(initialInstitute));
  return initialInstitute;
}

export function saveMockInstitute(inst: StoredInstitute) {
  localStorage.setItem(STORAGE_KEY_INSTITUTE, JSON.stringify(inst));
}

export function getMockApplications(): StoredApplication[] {
  const stored = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(initialApplications));
  return initialApplications;
}

export function saveMockApplications(apps: StoredApplication[]) {
  localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(apps));
}

export function addMockApplication(appData: any, instituteId: string): StoredApplication {
  const apps = getMockApplications();
  const selectedType = applicationTypes.find((t) => t.id === appData.application_id) || applicationTypes[0];

  const newApp: StoredApplication = {
    uni_application_id: appData.uni_application_id || `APP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    createdOn: new Date().toISOString(),
    universityId: instituteId || initialInstitute.id,
    application: {
      application_id: selectedType.id,
      application_name: appData.application_name || selectedType.name,
      application_description: appData.application_description || selectedType.name,
      documents: selectedType.documents || [],
    },
    UniversityDocuments: (selectedType.documents || []).map((doc, idx) => ({
      uni_doc_id: `doc-${Date.now()}-${idx}`,
      doc_id: doc.id,
      uni_doc_name: doc.name,
      uni_doc_uri: doc.pdfPath || "https://www.aicte-india.org/sites/default/files/FORMAT-1.pdf",
      status: "NOT_SUBMITTED",
      timestamp: new Date().toISOString(),
      errors: [],
      extractedTexts: sampleExtractedTexts,
      messages: [],
      assigned_evaluator: [
        { check_type: "Document Forgery & Authenticity", status: "PENDING" },
        { check_type: "AICTE Handbook Norms Compliance", status: "PENDING" },
      ],
      document: {
        doc_id: doc.id,
        doc_name: doc.name,
        format_uri: doc.pdfPath || "",
      },
    })),
  };

  apps.unshift(newApp);
  saveMockApplications(apps);
  return newApp;
}

export function getEvaluatorData() {
  const apps = getMockApplications();
  const allDocs: any[] = [];
  apps.forEach((app) => {
    app.UniversityDocuments.forEach((doc) => {
      allDocs.push({
        ...doc,
        document: {
          ...doc.document,
          timestamp: doc.timestamp,
          uni_doc_id: doc.uni_doc_id,
          application: {
            application_name: app.application.application_name,
            university: {
              universityName: initialInstitute.universityName,
            },
          },
        },
      });
    });
  });

  return {
    evaluator: {
      evaluator_id: "EV-8842",
      name: "Dr. Vipul Sharma",
      email: "vipul.sharma@aicte-india.org",
      role: "NOC Approval Evaluator / Senior Scrutiny Member",
      assigned_document: allDocs,
    },
  };
}

export function actionOnDoc(uni_doc_id: string, status: "APPROVED" | "REJECTED", message?: string) {
  const apps = getMockApplications();
  for (const app of apps) {
    for (const doc of app.UniversityDocuments) {
      if (doc.uni_doc_id === uni_doc_id) {
        doc.status = status;
        if (message) {
          if (!doc.messages) doc.messages = [];
          doc.messages.unshift({
            message: {
              id: Date.now(),
              timestamp: new Date().toLocaleString(),
              content: message,
              category: status === "APPROVED" ? "success" : "warning",
            },
          });
        }
        if (doc.assigned_evaluator) {
          doc.assigned_evaluator.forEach((aev) => {
            aev.status = status;
          });
        }
      }
    }
  }
  saveMockApplications(apps);
}
