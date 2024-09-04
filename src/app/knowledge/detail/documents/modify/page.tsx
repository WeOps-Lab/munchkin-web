'use client';

import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Breadcrumb, Button, Steps, message } from 'antd';
import LocalFileUpload from './localFileUpload';
import WebLinkForm from './webLinkForm';
import CustomTextForm from './customTextForm';
import PreprocessStep from './preprocessStep';

const { Step } = Steps;

const KnowledgeModifyPage = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isStepValid, setIsStepValid] = useState<boolean>(false);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleValidationChange = useCallback((isValid: boolean) => {
    setIsStepValid(isValid);
  }, []);

  const renderStepContent = () => {
    switch (type) {
      case 'Local File':
        return <LocalFileUpload onFileChange={handleValidationChange} />;
      case 'Web Link':
        return <WebLinkForm onFormChange={handleValidationChange} />;
      case 'Custom Text':
        return <CustomTextForm onFormChange={handleValidationChange} />;
      default:
        return <LocalFileUpload onFileChange={handleValidationChange} />;
    }
  };

  const steps = [
    {
      title: 'Choose',
      content: renderStepContent(),
    },
    {
      title: 'Preprocess',
      content: <PreprocessStep />,
    },
    {
      title: 'Finish',
      content: (
        <div>
          <h2>Finish</h2>
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
          {currentStep > 0 && (
            <Button onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext} disabled={!isStepValid}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeModifyPage;

