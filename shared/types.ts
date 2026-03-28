// Shared types used by both frontend and backend.
// Import in backend: import type { ... } from '../../shared/types.js'
// Import in frontend: import type { ... } from '../../shared/types'

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
  createdAt: string; // ISO 8601
  authorUid?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ConsultationRequest {
  fullName: string;
  email: string;
  description?: string;
  eventType?: string;
  targetDate?: string;
  guestCount?: number;
}
