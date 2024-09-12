export interface KnowledgeValues {
  name: string;
  team: string[];
  introduction: string;
}

export interface Card {
  id: number;
  name: string;
  introduction: string;
  created_by: string;
  team_name?: string;
  team?: string[];
}
  
export interface ModifyKnowledgeModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (values: KnowledgeValues) => void;
  initialValues?: KnowledgeValues | undefined;
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
}

export interface PreprocessStepProps {
  onConfigChange: (config: any) => void;
  knowledgeSourceType: string | null;
  knowledgeDocumentIds: number[];
  initialConfig: any;
}