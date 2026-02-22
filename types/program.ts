export interface Program {
  id: string; // Document ID
  slug: string;
  title: string;
  category: "conservation" | "education" | "community" | "medical";
  destinationId: string;
  pricing: {
    twoWeeks: number;
    fourWeeks: number;
  };
  durationOptions: number[]; // e.g. [2, 4]
  shortDescription: string;
  fullDescription: string;
  schedule: Array<{ day: number; activity: string }>;
  included: string[];
  notIncluded: string[];
  requirements: {
    ageRange: string;
    skills: string[];
  };
  accommodation: {
    type: string;
    description: string;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  maxParticipants: number;
  status: "active" | "inactive";
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
