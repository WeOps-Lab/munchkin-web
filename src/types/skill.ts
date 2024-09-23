export interface Skill {
    id: number;
    skillName: string;
    description: string;
    owner: string;
    group: string;
    avatar: string;
  }

  export interface ModifySkillModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: (values: KnowledgeValues) => void;
    initialValues?: KnowledgeValues | null;
  }
  