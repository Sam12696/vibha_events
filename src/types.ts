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
  mediaType: 'image' | 'video';
  category: Category;
  title: string;
  description?: string;
  createdAt: any; // Firestore Timestamp or ISO string
  authorUid?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'viewer';
}
