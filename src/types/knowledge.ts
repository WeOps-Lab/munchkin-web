export interface KnowledgeValues {
  id: number,
  name: string;
  team: string[];
  introduction: string;
  embed_model: number;
}

export interface Card {
  id: number;
  name: string;
  introduction: string;
  created_by: string;
  team_name?: string;
  team: string[];
  embed_model: number;
}
  
export interface ModifyKnowledgeModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (values: KnowledgeValues) => void;
  initialValues?: KnowledgeValues | null;
}

export interface groupProps {
  id: string,
  name: string,
  path: string
}

export interface PreviewData {
  id: number;
  content: string;
  characters: number;
}

export interface ModelOption {
  id: number;
  name: string;
  enabled: boolean;
}

export interface PreprocessStepProps {
  onConfigChange: (config: any) => void;
  knowledgeSourceType: string | null;
  knowledgeDocumentIds: number[];
  initialConfig: any;
}

export interface TestConfigData {
  selectedSearchTypes: string[];
  rerankModel: boolean;
  selectedRerankModel: string | null;
  textSearchWeight: number;
  vectorSearchWeight: number;
  quantity: number;
  candidate: number;
  selectedEmbedModel: string | null;
}

export interface ResultItem {
  id: number;
  name: string;
  content: string;
  created_at: string;
  created_by: string;
  knowledge_source_type: string;
  rerank_score: number;
  score: number;
}