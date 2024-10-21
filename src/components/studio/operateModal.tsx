import React, { useState, useEffect } from 'react';
import { Modal, Spin, Button } from 'antd';
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
  visible, okText, cancelText, onOk, onCancel, items, selectedItems, title, showEmptyPlaceholder = false, iconTypes = defaultIconTypes
}) => {
  const { t } = useTranslation();
  const [tempSelectedItem, setTempSelectedItem] = useState<number | null>(null);

  useEffect(() => {
    setTempSelectedItem(selectedItems[0] ?? null); // 仅支持单选
  }, [selectedItems, visible]);

  const handleItemSelect = (id: number) => {
    setTempSelectedItem(id); // 设置为单选模式
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
    setTempSelectedItem(selectedItems[0] ?? null); // 重置为初始值
    onCancel();
  };

  return (
    <Modal
      title={title}
      visible={visible}
      okText={showEmptyPlaceholder ? undefined : okText}
      cancelText={cancelText}
      onOk={showEmptyPlaceholder ? undefined : handleConfirm}
      onCancel={handleModalCancel}
      footer={renderFooter()}
    >
      <Spin spinning={false}>
        {showEmptyPlaceholder ? (
          <div>
            {t('studio.settings.noChannelHasBeenOpened')}
            <a href="/path/to/channel/config" style={{ 'color': 'var(--color-primary)' }}>
              {t('studio.settings.clickHere')}
            </a>
            {t('studio.settings.toConfigureChannels')}
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
                  {item.name}
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