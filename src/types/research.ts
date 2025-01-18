import { LucideIcon } from 'lucide-react'

export interface AgentMetadata {
  timestamp: string;
  version: string;
  status: 'success' | 'partial_success' | 'error';
}

export interface AgentResult {
  result?: string;
  error?: string;
  status: 'success' | 'error';
  timestamp: string;
}

export interface ResearchResults {
  manager: string;
  market: string;
  consumer: string;
  industry: string;
}

export interface ResearchResponse {
  metadata: AgentMetadata;
  results: ResearchResults;
  errors: Record<string, string>;
}

export interface ResearchRequest {
  product_name: string;
  context?: string;
}

export interface AgentConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
} 