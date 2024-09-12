import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Switch, InputNumber, Select, Form, message, Radio, Button } from 'antd';
import styles from './modify.module.less';
import useApiClient from '@/utils/request';
import { PreviewData, ModelOption, PreprocessStepProps } from '@/types/knowledge';

const { Option } = Select;

const PreprocessStep: React.FC<PreprocessStepProps> = ({ onConfigChange, knowledgeSourceType, knowledgeDocumentIds, initialConfig }) => {
  const [formData, setFormData] = useState({
    chunkParsing: initialConfig?.chunkParsing || false,
    chunkSize: initialConfig?.chunkSize || 256,
    chunkOverlap: initialConfig?.chunkOverlap || 32,
    semanticChunkParsing: initialConfig?.semanticChunkParsing || false,
    semanticModel: initialConfig?.semanticModel || null,
    ocrEnhancement: initialConfig?.ocrEnhancement || false,
    ocrModel: initialConfig?.ocrModel || null,
    excelParsing: initialConfig?.excelParsing || false,
    excelParseOption: initialConfig?.excelParseOption || 'headerRow',
  });

  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [semanticModels, setSemanticModels] = useState<ModelOption[]>([]);
  const [ocrModels, setOcrModels] = useState<ModelOption[]>([]);
  const [loadingSemanticModels, setLoadingSemanticModels] = useState<boolean>(true);
  const [loadingOcrModels, setLoadingOcrModels] = useState<boolean>(true);
  const { get, post } = useApiClient();
  const initialConfigRef = useRef(initialConfig);
  const onConfigChangeRef = useRef(onConfigChange);
  const [isInitialConfigApplied, setIsInitialConfigApplied] = useState(false);

  const generateConfig = (preview: boolean) => ({
    preview,
    knowledge_source_type: knowledgeSourceType,
    knowledge_document_ids: preview ? [knowledgeDocumentIds[0]] : knowledgeDocumentIds,
    enable_general_parse: formData.chunkParsing,
    general_parse_chunk_size: formData.chunkSize,
    general_parse_chunk_overlap: formData.chunkOverlap,
    enable_semantic_chunk_parse: formData.semanticChunkParsing,
    semantic_chunk_parse_embedding_model: formData.semanticModel,
    enable_ocr_parse: formData.ocrEnhancement,
    ocr_model: formData.ocrModel,
    enable_excel_parse: formData.excelParsing,
    excel_header_row_parse: formData.excelParseOption === 'headerRow',
    excel_full_content_parse: formData.excelParseOption === 'fullContent',
  });

  const generateConfigRef = useRef(generateConfig);

  useEffect(() => {
    generateConfigRef.current = generateConfig;
  }, [formData, knowledgeSourceType, knowledgeDocumentIds]);

  useEffect(() => {
    console.log('Fetching models...');
    const fetchModels = async () => {
      try {
        const [semanticData, ocrData] = await Promise.all([
          get('/model_provider_mgmt/rerank_provider/'),
          get('/model_provider_mgmt/ocr_provider/')
        ]);

        setSemanticModels(semanticData);
        setOcrModels(ocrData);
      } catch (error) {
        message.error('Failed to fetch models');
      } finally {
        setLoadingSemanticModels(false);
        setLoadingOcrModels(false);
      }
    };

    fetchModels();
  }, [get]);

  useEffect(() => {
    if (!loadingSemanticModels && !loadingOcrModels && initialConfigRef.current && !isInitialConfigApplied) {
      console.log('Setting initial config...');
      setFormData({
        chunkParsing: initialConfigRef.current.chunkParsing,
        chunkSize: initialConfigRef.current.chunkSize,
        chunkOverlap: initialConfigRef.current.chunkOverlap,
        semanticChunkParsing: initialConfigRef.current.semanticChunkParsing,
        semanticModel: initialConfigRef.current.semanticModel,
        ocrEnhancement: initialConfigRef.current.ocrEnhancement,
        ocrModel: initialConfigRef.current.ocrModel,
        excelParsing: initialConfigRef.current.excelParsing,
        excelParseOption: initialConfigRef.current.excelParseOption,
      });
      setIsInitialConfigApplied(true);
      initialConfigRef.current = null;
    }
  }, [loadingSemanticModels, loadingOcrModels, isInitialConfigApplied]);

  useEffect(() => {
    console.log('changed:');
    if (isInitialConfigApplied && initialConfig) {
      const config = generateConfigRef.current(false);
      console.log('Config changed:', config);
      onConfigChangeRef.current(config);
    }
    if (!initialConfig) {
      const config = generateConfigRef.current(false);
      console.log('Config changed:+++', config);
      onConfigChangeRef.current(config);
    }
  }, [formData, isInitialConfigApplied]);

  const handleChange = (field: string, value: any) => {
    console.log(`Field changed: ${field}, Value: ${value}`);
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handlePreviewClick = async () => {
    if (formData.semanticChunkParsing && !formData.semanticModel) {
      message.error('Please select a semantic model when Semantic Chunk Parsing is enabled.');
      return;
    }
    if (formData.ocrEnhancement && !formData.ocrModel) {
      message.error('Please select an OCR model when OCR Enhancement is enabled.');
      return;
    }
    await fetchPreviewData();
  };

  const fetchPreviewData = useCallback(async () => {
    try {
      const config = generateConfigRef.current(true);
      const data = await post('/knowledge_mgmt/knowledge_document/preprocess/', config);

      if (Array.isArray(data)) {
        setPreviewData(data.map((contxt, index) => ({
          id: index,
          content: contxt,
          characters: contxt.length
        })));
        message.success('Preview data fetched successfully');
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      message.error('Failed to fetch preview data');
    }
  }, [post]);

  return (
    <div className="flex justify-between">
      <div className={`flex-1 px-4 ${styles.config}`}>
        <h2 className="text-lg font-semibold mb-3">General Config</h2>
        <div className={`rounded-md p-4 mb-6 ${styles.configItem}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Chunk Parsing</h3>
            <Switch size="small" checked={formData.chunkParsing} onChange={(checked) => handleChange('chunkParsing', checked)} />
          </div>
          <p className="mb-4 text-sm">The process of dividing large documents into smaller parts or chunks to facilitate more efficient processing, analysis, or storage. This method is applicable to various document formats, including text and images.</p>
          <Form layout="vertical">
            <Form.Item label="Chunk Size">
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                value={formData.chunkSize}
                onChange={(value) => handleChange('chunkSize', value)}
                disabled={!formData.chunkParsing}
                changeOnWheel
              />
            </Form.Item>
            <Form.Item label="Chunk Overlap">
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                value={formData.chunkOverlap}
                onChange={(value) => handleChange('chunkOverlap', value)}
                disabled={!formData.chunkParsing}
                changeOnWheel
              />
            </Form.Item>
          </Form>
        </div>
        <div className={`rounded-md p-4 mb-6 ${styles.configItem}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Semantic Chunk Parsing</h3>
            <Switch size="small" checked={formData.semanticChunkParsing} onChange={(checked) => handleChange('semanticChunkParsing', checked)} />
          </div>
          <p className="mb-4 text-sm">When performing document chunking, this method divides content based on semantic relationships, ensuring that each chunk contains content with complete contextual meaning and logical structure.</p>
          <Form.Item label="Model">
            <Select
              style={{ width: '100%' }}
              disabled={!formData.semanticChunkParsing}
              loading={loadingSemanticModels}
              value={formData.semanticModel}
              onChange={(value) => handleChange('semanticModel', value)}
            >
              {semanticModels.map((model) => (
                <Option key={model.id} value={model.id}>{model.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className={`rounded-md p-4 mb-6 ${styles.configItem}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">OCR Enhancement</h3>
            <Switch size="small" checked={formData.ocrEnhancement} onChange={(checked) => handleChange('ocrEnhancement', checked)} />
          </div>
          <p className="mb-4 text-sm">OCR (Optical Character Recognition) technology is used to recognize and convert characters from images into editable text, improving the accuracy and effectiveness of text recognition.</p>
          <Form.Item label="OCR Model">
            <Select
              style={{ width: '100%' }}
              disabled={!formData.ocrEnhancement}
              loading={loadingOcrModels}
              value={formData.ocrModel}
              onChange={(value) => handleChange('ocrModel', value)}
            >
              {ocrModels.map((model) => (
                <Option key={model.id} value={model.id}>{model.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <h2 className="text-lg font-semibold mb-3">Specific Config</h2>
        <div className={`rounded-md p-4 mb-6 ${styles.configItem}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Excel Parsing</h3>
            <Switch size="small" checked={formData.excelParsing} onChange={(checked) => handleChange('excelParsing', checked)} />
          </div>
          <p className="mb-4 text-sm">This is specialized in handling data from Excel files, enabling the extraction, transformation, and utilization of both structured and unstructured data from Excel, thereby facilitating data analysis and processing.</p>
          <Radio.Group
            onChange={(e) => handleChange('excelParseOption', e.target.value)}
            value={formData.excelParseOption}
            disabled={!formData.excelParsing}
          >
            <Radio value="headerRow">Excel Header + Row Combination Parsing</Radio>
            <Radio value="fullContent">Full Excel Content Parsing</Radio>
          </Radio.Group>
        </div>
      </div>
      <div className="flex-1 px-4">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold mb-3">Preview</h2>
          <Button type="primary" size="small" onClick={handlePreviewClick}>View Chunk</Button>
        </div>
        {previewData.map((item) => (
          <div key={item.id} className={`rounded-md p-4 mb-3 ${styles.previewItem}`}>
            <div className="flex justify-between mb-2">
              <span className={`text-xs ${styles.number}`}>#{item.id.toString().padStart(3, '0')}</span>
              <span className="text-sm">{item.characters} characters</span>
            </div>
            <div>
              <p>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreprocessStep;