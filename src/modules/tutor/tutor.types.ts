export interface TutorProfileCreate {
  bio?: string | null;
  experience: string;
  university: string;
  pricePerHour: number; // in whole dollars (Int)
  major: string;
  age?: number | null;
  cgpa: number; // float
  subjectId: string;
}
