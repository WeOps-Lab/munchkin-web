export interface Studio {
  id: number;
  name: string;
  introduction: string;
  created_by: string;
  team: string[];
  team_name: string[];
  online: boolean;
  [key: string]: any;
}

export interface ModifyStudioModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (values: Studio) => void;
  initialValues?: Studio | null;
}

interface ChannelConfig {
  [key: string]: any;
}

export interface ChannelProps {
  id: string;
  name: string;
  enabled: boolean;
  icon: string;
  channel_config: ChannelConfig;
}
  