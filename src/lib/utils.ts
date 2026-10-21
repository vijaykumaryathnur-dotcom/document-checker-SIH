import { SERVER_URL } from "@/constants/API";
import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  getMockInstitute,
  saveMockInstitute,
  getMockApplications,
  addMockApplication,
  getEvaluatorData,
  actionOnDoc,
} from "./mockBackend";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const api = axios.create({ baseURL: SERVER_URL });

// In-app mock router to ensure the entire application works seamlessly without external local server
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();
  const data = typeof config.data === "string" ? JSON.parse(config.data || "{}") : config.data || {};

  // Custom mock response creator
  const createMockResponse = (responseData: any, status = 200): AxiosResponse => ({
    data: responseData,
    status,
    statusText: "OK",
    headers: {},
    config,
  });

  // Institute Auth Routes
  if (url.includes("/institute/auth/login")) {
    const inst = getMockInstitute();
    config.adapter = async () => createMockResponse({
      success: true,
      token: inst.id,
      message: "Login successful",
      institute: inst,
    });
    return config;
  }

  if (url.includes("/institute/auth/register")) {
    const instituteData = data.institute_data || {};
    const newInst = {
      ...getMockInstitute(),
      ...instituteData,
      id: instituteData.aictePermanentId || `UNI-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    saveMockInstitute(newInst);
    config.adapter = async () => createMockResponse({
      success: true,
      token: newInst.id,
      message: "Registered successfully",
    });
    return config;
  }

  if (url.includes("/institute/auth/institute_exists")) {
    config.adapter = async () => createMockResponse({ exists: true, success: true });
    return config;
  }

  if (url.includes("/institute/auth/forgot")) {
    config.adapter = async () => createMockResponse({ success: true, message: "Password reset link sent." });
    return config;
  }

  if (url.includes("/otp") || url.includes("/verify_otp")) {
    config.adapter = async () => createMockResponse({
      success: true,
      otp: "123456",
      message: "OTP sent and verified successfully. Your OTP code is 123456",
    });
    return config;
  }


  // Institute Data Routes
  if (url.includes("/institute/data/new_application")) {
    const app = data.application || {};
    const instId = data.institute_id || getMockInstitute().id;
    const created = addMockApplication(app, instId);
    config.adapter = async () => createMockResponse({
      id: created.uni_application_id,
      status: "success",
      success: true,
      message: `Successfully created application ${created.uni_application_id}`,
      token: instId,
    });
    return config;
  }

  if (url.includes("/institute/data/get_applications") || url.includes("/institute/data/application")) {
    const applications = getMockApplications();
    config.adapter = async () => createMockResponse({
      applications,
      data: applications,
      status: "success",
      message: "Applications fetched successfully",
    });
    return config;
  }

  if (url.includes("/institute/data/get_documents")) {
    const applications = getMockApplications();
    const urlParams = new URLSearchParams(url.split("?")[1] || "");
    const appId = urlParams.get("application_id");
    const targetApp = applications.find((a) => a.uni_application_id === appId) || applications[0];
    config.adapter = async () => createMockResponse({
      applications: targetApp?.UniversityDocuments || [],
      data: targetApp?.UniversityDocuments || [],
      status: "success",
    });
    return config;
  }

  if (url.includes("/institute/data/document_analysis")) {
    const applications = getMockApplications();
    const targetApp = applications[0];
    const doc = targetApp.UniversityDocuments[0];
    config.adapter = async () => createMockResponse({
      success: true,
      data: {
        currentUniDoc: doc,
      },
    });
    return config;
  }

  if (url.includes("/institute/data/validate_image") || url.includes("/institute/data/validate_blueprint")) {
    config.adapter = async () => createMockResponse({
      success: true,
      verified: true,
      score: 95,
      message: "Infrastructure features verified: laboratory setup, safety compliance, and geo-location match registered university coordinates within 15 meters.",
      detected_elements: ["Emergency Exits", "Fire Extinguisher", "Workstations", "Universal Access Ramp"],
    });
    return config;
  }


  if (url.includes("/institute/data")) {
    const inst = getMockInstitute();
    config.adapter = async () => createMockResponse({
      success: true,
      data: inst,
    });
    return config;
  }

  // Evaluator Routes
  if (url.includes("/evaluator/auth/login")) {
    config.adapter = async () => createMockResponse({
      success: true,
      token: "evaluator_token_8842",
      role: "evaluator",
    });
    return config;
  }

  if (url.includes("/evaluator/data/action_on_doc")) {
    actionOnDoc(data.uni_doc_id, data.status, data.messages);
    config.adapter = async () => createMockResponse({
      success: true,
      status: 200,
      message: "Action recorded successfully",
    });
    return config;
  }

  if (url.includes("/evaluator/data/data") || url.includes("/evaluator/data")) {
    const evalData = getEvaluatorData();
    config.adapter = async () => createMockResponse(evalData);
    return config;
  }

  return config;
});
