import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

interface LocalFileUploadProps {
  onFileChange: (hasFile: boolean) => void;
}

const LocalFileUpload: React.FC<LocalFileUploadProps> = ({ onFileChange }) => {
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    onFileChange(fileList.length > 0);
  }, [fileList, onFileChange]);

  return (
    <div className="px-16">
      <Dragger
        name="file"
        multiple
        fileList={fileList}
        onChange={(info) => {
          const { status } = info.file;
          setFileList(info.fileList);
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Click or drag files here to upload</p>
        <p className="ant-upload-hint">
          Supports: .rar .zip .doc .docx .pdf .xlsx .txt .csv...
        </p>
      </Dragger>
    </div>
  );
};

export default LocalFileUpload;