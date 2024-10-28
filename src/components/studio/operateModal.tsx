import React, { useState, useEffect } from 'react';
import { Modal, Spin, Button, Tooltip } from 'antd';
import styles from './index.module.less';
import Icon from '@/components/icon';
import { useTranslation } from '@/utils/i18n';

interface OperateModalProps {
  visible: boolean;
  okText: string;
  cancelText: string;
  onOk: (selectedItems: number[]) => void;
  onCancel: () => void;
  items: any[];
  selectedItems: number[];
  title: string;
  showEmptyPlaceholder?: boolean;
  iconTypes?: string[];
}

const defaultIconTypes = ['zhishiku', 'zhishiku-red', 'zhishiku-blue', 'zhishiku-yellow', 'zhishiku-green'];

const getIconTypeByIndex = (index: number, iconTypes: string[]) =>
  iconTypes[index % iconTypes.length] || 'zhishiku';

const OperateModal: React.FC<OperateModalProps> = ({
  visible,
  okText,
  cancelText,
  onOk,
  onCancel,
  items,
  selectedItems,
  title,
  showEmptyPlaceholder = false,
  iconTypes = defaultIconTypes
}) => {
  const { t } = useTranslation();
  const [tempSelectedItem, setTempSelectedItem] = useState<number | null>(null);

  useEffect(() => {
    setTempSelectedItem(selectedItems[0] ?? null);
  }, [selectedItems, visible]);

  const handleItemSelect = (id: number) => {
    setTempSelectedItem(id);
  };

  const renderFooter = () => {
    if (showEmptyPlaceholder) {
      return (
        <Button onClick={onCancel}>
          {cancelText}
        </Button>
      );
    }
    return undefined;
  };

  const handleConfirm = () => {
    if (tempSelectedItem !== null) {
      onOk([tempSelectedItem]);
    }
  };

  const handleModalCancel = () => {
    setTempSelectedItem(selectedItems[0] ?? null);
    onCancel();
  };

  const handleClickHere = () => {
    window.open('/skill', '_blank');
  };

  return (
    <Modal
      title={title}
      visible={visible}
      okText={showEmptyPlaceholder ? undefined : okText}
      cancelText={cancelText}
      width={750}
      onOk={showEmptyPlaceholder ? undefined : handleConfirm}
      onCancel={handleModalCancel}
      footer={renderFooter()}
    >
      <Spin spinning={false}>
        {showEmptyPlaceholder ? (
          <div>
            {t('studio.settings.noSkillHasBeenSelected')}
            <a onClick={handleClickHere} style={{ color: 'var(--color-primary)', cursor: 'pointer' }}>
              {t('studio.settings.clickHere')}
            </a>
            {t('studio.settings.toConfigureSkills')}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 py-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex p-4 border rounded-md cursor-pointer ${styles.item} ${tempSelectedItem === item.id ? styles.selectedItem : ''}`}
                  onClick={() => handleItemSelect(item.id)}
                >
                  <Icon type={getIconTypeByIndex(index, iconTypes)} className="text-2xl mr-[8px]" />
                  <Tooltip title={item.name}>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.name}</span>
                  </Tooltip>
                </div>
              ))}
            </div>
            <div className="pt-4">
              {t('skill.selectedCount')}: {tempSelectedItem !== null ? 1 : 0}
            </div>
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default OperateModal;