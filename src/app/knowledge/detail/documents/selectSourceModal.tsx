import React, { useState } from 'react';
import { Radio, Button } from 'antd';
import OperateModal from '@/components/operate-modal';
import styles from './index.module.less'; // 确保路径正确

interface SelectSourceModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (selectedType: string) => void;
}

const radioOptions = [
  {
    value: 'Local File',
    title: 'Local File',
    subTitle: 'Upload local files (such as PDF, DOCX, TXT) as a knowledge source.',
  },
  {
    value: 'Web Link',
    title: 'Web Link',
    subTitle: 'Use web links as a knowledge source.',
  },
  {
    value: 'Custom Text',
    title: 'Custom Text',
    subTitle: 'Enter custom text as a knowledge source.',
  },
];

const SelectSourceModal: React.FC<SelectSourceModalProps> = ({ visible, onCancel, onConfirm }) => {
  const [selectedType, setSelectedType] = useState<string>('');

  const handleConfirm = () => {
    onConfirm(selectedType);
  };

  return (
    <OperateModal
      title="Select Source"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm} disabled={!selectedType}>
          Confirm
        </Button>,
      ]}
    >
      <Radio.Group onChange={e => setSelectedType(e.target.value)} value={selectedType}>
        {radioOptions.map(option => (
          <Radio
            key={option.value}
            value={option.value}
            className={`${styles['radioItem']} ${selectedType === option.value ? styles['radioItemSelected'] : ''}`}
          >
            <div>
              <h3 className="text-base">{option.title}</h3>
              <p>{option.subTitle}</p>
            </div>
          </Radio>
        ))}
      </Radio.Group>
    </OperateModal>
  );
};

export default SelectSourceModal;