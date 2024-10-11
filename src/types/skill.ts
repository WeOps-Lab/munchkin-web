export interface Skill {
  id: number;
  name: string;
  introduction: string;
  created_by: string;
  team: string[];
  team_name: string;
}

export interface ModifySkillModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (values: Skill) => void;
  initialValues?: Skill | null;
}

export interface RagScoreThresholdItem {
  knowledge_base: number;
  score: number;
}

export interface KnowledgeBase {
  id: number;
  name: string;
  introduction: string;
}

export interface ChatMessage<T extends Record<string, any> = Record<string, any>> {
  id: string;
  role: 'user' | 'bot';
  content: string;
  createAt?: Date;
  updateAt?: Date;
  [key: string]: any;
}

export interface ProChatMessage extends ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  createAt: Date;
  updateAt: Date;
}
