'use client';

import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTranslation } from '@/utils/i18n';

const { Dragger } = Upload;

interface LocalFileUploadProps {
  onFileChange: (files: File[]) => void;
}

const LocalFileUpload: React.FC<LocalFileUploadProps> = ({ onFileChange }) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    const files = fileList.map(file => file.originFileObj).filter(Boolean) as File[];
    onFileChange(files);
  }, [fileList, onFileChange]);

  const handleBeforeUpload = (file: File) => {
    const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'text/csv'];
    const isAllowedType = allowedTypes.includes(file.type);
    if (!isAllowedType) {
      message.error(`${file.name} ${t('common.fileType')}`);
    }
    return isAllowedType;
  };

  return (
    <div className="px-16">
      <Dragger
        name="file"
        multiple
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        onChange={(info) => {
          setFileList(info.fileList);
        }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">{t('common.uploadText')}</p>
        <p className="ant-upload-hint">
          {t('common.supports')}: .doc .docx .pdf .xlsx .txt .csv...
        </p>
      </Dragger>
    </div>
  );
};

export default LocalFileUpload;