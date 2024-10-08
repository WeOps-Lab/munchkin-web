import React from 'react';
import { Modal, Spin } from 'antd';
import Icon from '@/components/icon';
import styles from './index.module.less';
import { useTranslation } from '@/utils/i18n';
import { KnowledgeBase } from '@/types/skill';

interface OperateModalProps {
  visible: boolean;
  okText: string;
  cancelText: string;
  onOk: () => void;
  onCancel: () => void;
  knowledgeBases: KnowledgeBase[];
  selectedKnowledgeBases: number[];
  handleKnowledgeBaseSelect: (id: number) => void;
}

const iconTypes = ['zhishiku', 'zhishiku-red', 'zhishiku-blue', 'zhishiku-yellow', 'zhishiku-green'];

const getIconTypeByIndex = (index: number) => iconTypes[index % iconTypes.length];

const OperateModal: React.FC<OperateModalProps> = ({
  visible, okText, cancelText, onOk, onCancel, knowledgeBases, selectedKnowledgeBases, handleKnowledgeBaseSelect
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('skill.selectKnowledgeBase')}
      visible={visible}
      okText={okText}
      cancelText={cancelText}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Spin spinning={false}>
        <div className="grid grid-cols-3 gap-4 py-4">
          {knowledgeBases.map((base, index) => (
            <div
              key={base.id}
              className={`flex p-4 border rounded-md cursor-pointer ${selectedKnowledgeBases.includes(base.id) ? styles.selectedKnowledge : ''}`}
              onClick={() => handleKnowledgeBaseSelect(base.id)}
            >
              <Icon type={getIconTypeByIndex(index)} className="text-2xl mr-[8px]" />
              {base.name}
            </div>
          ))}
        </div>
        <div className="pt-4">
          {t('skill.selectedCount')}: {selectedKnowledgeBases.length}
        </div>
      </Spin>
    </Modal>
  );
};

export default OperateModal;