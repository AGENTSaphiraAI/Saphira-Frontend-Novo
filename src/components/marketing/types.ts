
// Interfaces para componentes de marketing
export interface MarketingSection {
  id: string;
  title: string;
  content: string;
  visible: boolean;
}

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface ProblemSectionProps {
  problems: string[];
  title?: string;
}

export interface SolutionSectionProps {
  solutions: string[];
  title?: string;
}

export interface FeaturesSectionProps {
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface CtaSectionProps {
  primaryText?: string;
  secondaryText?: string;
  buttonText?: string;
}
