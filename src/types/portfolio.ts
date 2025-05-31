export type Basics = {
  id: number;
  name: string;
  label: string;
  email: string;
  url: string;
  social_links?: { linkedin?: string; github?: string }; // Add social links
};

export type Work = {
  id: number;
  title: string;
  company?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  responsibilities: { text: string }[];
};

export type Education = {
  id: number;
  institution: string;
  degree: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  description?: string;
};

export type Project = {
  category: string;
  id: number;
  title: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  description: { text: string }[];
  url?: string; // Add URL for projects
};

export type Skill = {
  id: number;
  category: string;
  items: string[];
};

export type Course = {
  id: number;
  title: string;
  institution: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  certificate_url?: string; // Add certificate URL for courses
};