/**
 * Shared type definitions used by frontend and backend
 */

export type Category =
  | "Decoration & Styling"
  | "Photography"
  | "Videography"
  | "Catering"
  | "Wedding Planning"
  | "Corporate Events"
  | "Entertainment"
  | "Lighting & Sound"
  | "VIP Transportation"
  | "Venue Selection"
  | "Invitations & Stationery"
  | "Gifting & Favors"
  | "Make-up";

export interface PortfolioProject {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  category: Category;
  title: string;
  description?: string;
  createdAt: string; // ISO string
  authorUid?: string;
}

export interface ConsultationRequest {
  id: string;
  fullName: string;
  email: string;
  description?: string;
  createdAt: string;
  status: "pending" | "contacted" | "completed";
}

export interface EventBlueprint {
  eventType: string;
  targetDate: string;
  guestCount: number;
  selectedServices: string[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
