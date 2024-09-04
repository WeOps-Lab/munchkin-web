import React, { useState } from 'react';
import { Switch, InputNumber, Checkbox, Form } from 'antd';
import styles from './modify.module.less';

interface PreviewData {
  id: number;
  title: string;
  content: string;
  characters: number;
}

const PreprocessStep: React.FC = () => {
  const [chunkParsing, setChunkParsing] = useState<boolean>(false);
  const [semanticChunkParsing, setSemanticChunkParsing] = useState<boolean>(false);
  const [ocrEnhancement, setOcrEnhancement] = useState<boolean>(false);
  const [excelParsing, setExcelParsing] = useState<boolean>(false);

  const previewData: PreviewData[] = [
    { id: 1, title: 'WeOps工程流程自动化', content: 'WeOps工程流程自动化', characters: 12 },
    { id: 2, title: 'MicrosoftActive Directory', content: '—MicrosoftActive Directory', characters: 26 },
    { id: 3, title: '简介', content: '简介', characters: 4 },
    { id: 4, title: '内容', content: '将为WeOps工程的综合自动化体验页面的定制操作引入一种新的方式，实现工具的自动更新，工具管理更加优化执行，人员配备更加合理和个性化。', characters: 70 },
    { id: 5, title: '分享', content: '分享', characters: 4 },
  ];

  return (
    <div className="flex justify-between">
      <div className={`flex-1 px-4 ${styles.config}`}>
        <h2 className="text-lg font-semibold mb-3">General Config</h2>
        <div className={`rounded-md p-4 mb-6 ${styles.configItem}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Chunk Parsing</h3>
            <Switch size="small" checked={chunkParsing} onChange={setChunkParsing} />
          </div>
          <p className="mb-4">The process of dividing large documents into smaller parts or chunks to facilitate more efficient processing, analysis, or storage. This method is applicable to various document formats, including text and images.</p>
          <Form layout="vertical">
            <Form.Item label="Chunk Size">
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                defaultValue={256}
                disabled={!chunkParsing}
                changeOnWheel />
            </Form.Item>
            <Form.Item label="Chunk Overlap">
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                defaultValue={256}
                disabled={!chunkParsing}
                changeOnWheel />
            </Form.Item>
          </Form>
        </div>
        <div className={`rounded-md p-4 mb-6 ${styles.configItem}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Semantic Chunk Parsing</h3>
            <Switch size="small" checked={semanticChunkParsing} onChange={setSemanticChunkParsing} />
          </div>
          <p className="mb-4">When performing document chunking, this method divides content based on semantic relationships, ensuring that each chunk contains content with complete contextual meaning and logical structure.</p>
          <Checkbox.Group options={['模型A', '模型B', '模型C']} disabled={!semanticChunkParsing} />
        </div>
        <div className={`rounded-md p-4 mb-6 ${styles.configItem}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">OCR Enhancement</h3>
            <Switch size="small" checked={ocrEnhancement} onChange={setOcrEnhancement} />
          </div>
          <p className="mb-4">OCR (Optical Character Recognition) technology is used to recognize and convert characters from images into editable text, improving the accuracy and effectiveness of text recognition.</p>
          <Checkbox.Group options={['模型A', '模型B', '模型C']} disabled={!ocrEnhancement} />
        </div>
        <h2 className="text-lg font-semibold mb-3">Specific Config</h2>
        <div className={`rounded-md p-4 mb-6 ${styles.configItem}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Excel Parsing</h3>
            <Switch size="small" checked={excelParsing} onChange={setExcelParsing} />
          </div>
          <p className="mb-4">This is specialized in handling data from Excel files, enabling the extraction, transformation, and utilization of both structured and unstructured data from Excel, thereby facilitating data analysis and processing.</p>
          <Checkbox.Group options={['Excel Header + Row Combination Parsing', 'Full Excel Content Parsing']} disabled={!excelParsing} />
        </div>
      </div>
      <div className="flex-1 px-4">
        <h2 className="text-lg font-semibold mb-3">Preview</h2>
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