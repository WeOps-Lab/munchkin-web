import React, { useEffect, useState } from 'react';
import { Modal, Spin, Tooltip, Button } from 'antd';
import Icon from '@/components/icon';
import { useTranslation } from '@/utils/i18n';
import { KnowledgeBase } from '@/types/skill';
import styles from './index.module.less';

interface OperateModalProps {
  visible: boolean;
  okText: string;
  cancelText: string;
  onOk: (selected: number[]) => void;
  onCancel: () => void;
  knowledgeBases: KnowledgeBase[];
  selectedKnowledgeBases: number[];
}

const iconTypes = ['zhishiku', 'zhishiku-red', 'zhishiku-blue', 'zhishiku-yellow', 'zhishiku-green'];

const getIconTypeByIndex = (index: number) => iconTypes[index % iconTypes.length];

const OperateModal: React.FC<OperateModalProps> = ({
  visible, okText, cancelText, onOk, onCancel, knowledgeBases, selectedKnowledgeBases
}) => {
  const { t } = useTranslation();
  const [tempSelectedKnowledgeBases, setTempSelectedKnowledgeBases] = useState<number[]>([]);

  useEffect(() => {
    if (visible) {
      setTempSelectedKnowledgeBases(selectedKnowledgeBases);
    }
  }, [visible, selectedKnowledgeBases]);

  const handleKnowledgeBaseSelect = (id: number) => {
    setTempSelectedKnowledgeBases((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOk = () => {
    onOk(tempSelectedKnowledgeBases);
  };

  const handleConfigureKnowledgeBases = () => {
    window.open('/knowledge', '_blank');
  };

  return (
    <Modal
      title={t('skill.selectKnowledgeBase')}
      visible={visible}
      okText={okText}
      cancelText={cancelText}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Spin spinning={false}>
        {knowledgeBases.length === 0 ? (
          <div className="text-center">
            <p>{t('skill.noKnowledgeBase')}</p>
            <Button type="link" onClick={handleConfigureKnowledgeBases}>
              {t('common.clickHere')}
            </Button>
            {t('skill.toConfigureKnowledgeBase')}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 py-4">
              {knowledgeBases.map((base, index) => (
                <div
                  key={base.id}
                  className={`flex items-center p-4 border rounded-md cursor-pointer ${tempSelectedKnowledgeBases.includes(base.id) ? styles.selectedKnowledge : ''}`}
                  onClick={() => handleKnowledgeBaseSelect(base.id)}
                >
                  <div className="w-8 flex-shrink-0">
                    <Icon type={getIconTypeByIndex(index)} className="text-2xl" />
                  </div>
                  <Tooltip title={base.name}>
                    <span className="ml-2 inline-block max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {base.name}
                    </span>
                  </Tooltip>
                </div>
              ))}
            </div>
            <div className="pt-4">
              {t('skill.selectedCount')}: {tempSelectedKnowledgeBases.length}
            </div>
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default OperateModal;