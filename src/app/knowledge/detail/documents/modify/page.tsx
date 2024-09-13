'use client';

import React, { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumb, Button, Steps, message } from 'antd';
import LocalFileUpload from './localFileUpload';
import WebLinkForm from './webLinkForm';
import CustomTextForm from './customTextForm';
import PreprocessStep from './preprocessStep';
import useApiClient from '@/utils/request';
import useSaveConfig from '@/hooks/useSaveConfig';

const { Step } = Steps;

const KnowledgeModifyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const desc = searchParams.get('desc');
  const { post } = useApiClient();
  const { saveConfig } = useSaveConfig();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isStepValid, setIsStepValid] = useState<boolean>(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [documentIds, setDocumentIds] = useState<number[]>([]);
  const [preprocessConfig, setPreprocessConfig] = useState<any>(null);
  const [webLinkData, setWebLinkData] = useState<{ name: string, link: string, deep: number }>({ name: '', link: '', deep: 1 });
  const [manualData, setManualData] = useState<{ name: string, content: string }>({ name: '', content: '' });
  const [loading, setLoading] = useState<boolean>(false);

  const handleNext = async () => {
    setLoading(true);
    if (currentStep === 0 && type === 'file') {
      try {
        const formData = new FormData();
        formData.append('knowledge_base_id', id as string);
        fileList.forEach(file => formData.append('files', file));
        const data = await post('/knowledge_mgmt/file_knowledge/create_file_knowledge/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setDocumentIds(data);
        message.success('Files uploaded successfully');
      } catch (error) {
        message.error('Failed to upload files');
        setLoading(false);
        return;
      }
    } else if (currentStep === 0 && type === 'web_page') {
      try {
        const data = await post('/knowledge_mgmt/web_page_knowledge/create_web_page_knowledge/', {
          knowledge_base_id: id,
          name: webLinkData.name,
          url: webLinkData.link,
          max_depth: webLinkData.deep,
        });
        setDocumentIds([data]);
        message.success('Web link data saved successfully');
      } catch (error) {
        message.error('Failed to save web link data');
        setLoading(false);
        return;
      }
    } else if (currentStep === 0 && type === 'manual') {
      try {
        const data = await post('/knowledge_mgmt/manual_knowledge/create_manual_knowledge/', {
          knowledge_base_id: id,
          name: manualData.name,
          content: manualData.content,
        });
        setDocumentIds([data]);
        message.success('Manual data saved successfully');
      } catch (error) {
        message.error('Failed to save manual data');
        setLoading(false);
        return;
      }
    } else if (currentStep === 1) {
      const success = await saveConfig(preprocessConfig);
      if (!success) {
        setLoading(false);
        return;
      }
    }
    setCurrentStep(currentStep + 1);
    setLoading(false);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleValidationChange = useCallback((isValid: boolean) => {
    setIsStepValid(isValid);
  }, []);

  const handleFileChange = useCallback((files: File[]) => {
    setFileList(files);
    setIsStepValid(files.length > 0);
  }, []);

  const handlePreprocessConfigChange = useCallback((config: any) => {
    console.log('configconfig~~~', config);
    setPreprocessConfig(config);
    setIsStepValid(true);
  }, []);

  const handleWebLinkDataChange = useCallback((data: { name: string, link: string, deep: number }) => {
    setWebLinkData(data);
  }, []);

  const handleManualDataChange = useCallback((data: { name: string, content: string }) => {
    setManualData(data);
  }, []);

  const handleDone = () => {
    router.push(`/knowledge/detail/documents?id=${id}&name=${name}&desc=${desc}`);
  };

  const renderStepContent = () => {
    switch (type) {
      case 'file':
        return <LocalFileUpload onFileChange={handleFileChange} />;
      case 'web_page':
        return <WebLinkForm onFormChange={handleValidationChange} onFormDataChange={handleWebLinkDataChange} />;
      case 'manual':
        return <CustomTextForm onFormChange={handleValidationChange} onFormDataChange={handleManualDataChange} />;
      default:
        return <LocalFileUpload onFileChange={handleFileChange} />;
    }
  };

  const steps = [
    {
      title: 'Choose',
      content: renderStepContent(),
    },
    {
      title: 'Preprocess',
      content: <PreprocessStep 
        knowledgeSourceType={type} 
        knowledgeDocumentIds={documentIds}
        onConfigChange={handlePreprocessConfigChange}
        initialConfig={{}} />,
    },
    {
      title: 'Finish',
      content: (
        <div className="flex flex-col items-center">
          <Image src="/finish.png" alt="Finish" width={150} height={40} />
          <p>All files uploaded will be added to the training queue. Please check the training progress on the left side.</p>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>Knowledge</Breadcrumb.Item>
        <Breadcrumb.Item>{type}</Breadcrumb.Item>
        <Breadcrumb.Item>Create</Breadcrumb.Item>
      </Breadcrumb>
      <div className="px-7 py-5">
        <Steps className="px-16 py-8" current={currentStep}>
          {steps.map((step, index) => (
            <Step key={index} title={step.title} />
          ))}
        </Steps>
        <div className="steps-content" style={{ marginTop: 24 }}>
          {steps[currentStep].content}
        </div>
        <div className="fixed bottom-10 right-20 z-50 flex space-x-2">
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <Button onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext} disabled={!isStepValid} loading={loading}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={handleDone}>
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeModifyPage;