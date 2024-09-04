'use client';

import React, { useState } from 'react';
import { Input, Switch, Slider, Button, Radio, InputNumber, Select } from 'antd';
import styles from './index.module.less';

const { TextArea } = Input;
const { Option } = Select;

const modelOptions = ['Model A', 'Model B', 'Model C'];
const rerankModelOptions = ['Rerank Model A', 'Rerank Model B', 'Rerank Model C'];

const TestingPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedSearchType, setSelectedSearchType] = useState<string | null>(null);
  const [rerankModel, setRerankModel] = useState<boolean>(false);
  const [selectedRerankModel, setSelectedRerankModel] = useState<string | null>(null);
  const [weight, setWeight] = useState<number>(0.5);
  const [quantity, setQuantity] = useState<number>(10);
  const [candidate, setCandidate] = useState<number>(10);

  return (
    <div className="flex p-4">
      <div className="w-1/2 pr-4">
        <div className="mb-4 p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2">Text</h2>
          <TextArea
            placeholder="Enter text to search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            rows={4}
          />
        </div>
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2">Config</h2>
          <div className="mb-4 flex items-center">
            <label className="block text-sm font-medium mb-1 w-32">Embedding Model</label>
            <Select className="flex-1" placeholder="Select model">
              {modelOptions.map((model) => (
                <Option key={model} value={model}>
                  {model}
                </Option>
              ))}
            </Select>
          </div>
          <div className={`mb-4 flex ${styles.configTxt}`}>
            <label className="block text-sm font-medium mb-1 w-32">Retrieval setting</label>
            <div className="flex-1">
              <div className="p-4 border rounded-md mb-4">
                <div className="flex items-center mb-2 justify-between">
                  <h3 className="text-base font-semibold">Text Search</h3>
                  <Radio
                    checked={selectedSearchType === 'textSearch'}
                    onChange={() => setSelectedSearchType('textSearch')}
                  />
                </div>
                <p className="text-sm mb-4">
                  Based on keyword search technology, it searches and extracts relevant documents from large volumes of text data.
                </p>
                {selectedSearchType === 'textSearch' && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm w-32">Rerank Model</label>
                      <Switch
                        size="small"
                        checked={rerankModel}
                        onChange={(checked) => {
                          setRerankModel(checked);
                          if (!checked) {
                            setSelectedRerankModel(null);
                          }
                        }}
                      />
                    </div>
                    {rerankModel && (
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm w-32">Select Model</label>
                        <Select
                          className="flex-1"
                          placeholder="Select rerank model"
                          value={selectedRerankModel}
                          onChange={setSelectedRerankModel}
                        >
                          {rerankModelOptions.map((model) => (
                            <Option key={model} value={model}>
                              {model}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm w-32">Weight</label>
                      <Slider
                        className="flex-1 mx-2"
                        min={0}
                        max={1}
                        step={0.01}
                        value={weight}
                        onChange={setWeight}
                      />
                      <Input className="w-14" value={weight.toFixed(2)} readOnly />
                    </div>
                  </>
                )}
              </div>
              <div className="p-4 border rounded-md mb-4">
                <div className="flex items-center mb-2 justify-between">
                  <h3 className="text-base font-semibold">Vector Search</h3>
                  <Radio
                    checked={selectedSearchType === 'vectorSearch'}
                    onChange={() => setSelectedSearchType('vectorSearch')}
                  />
                </div>
                <p className="text-sm mb-4">
                  Utilizing vector space models, it finds the best-matching data by calculating the similarity between vectors in high-dimensional space.
                </p>
                {selectedSearchType === 'vectorSearch' && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm w-32">Rerank Model</label>
                      <Switch
                        size="small"
                        checked={rerankModel}
                        onChange={(checked) => {
                          setRerankModel(checked);
                          if (!checked) {
                            setSelectedRerankModel(null);
                          }
                        }}
                      />
                    </div>
                    {rerankModel && (
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm w-32">Select Model</label>
                        <Select
                          className="flex-1"
                          placeholder="Select rerank model"
                          value={selectedRerankModel}
                          onChange={setSelectedRerankModel}
                        >
                          {rerankModelOptions.map((model) => (
                            <Option key={model} value={model}>
                              {model}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm w-32">Weight</label>
                      <Slider
                        className="flex-1 mx-2"
                        min={0}
                        max={1}
                        step={0.01}
                        value={weight}
                        onChange={setWeight}
                      />
                      <Input className="w-14" value={weight.toFixed(2)} readOnly />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm w-32">Return Quantity</label>
                      <InputNumber
                        min={1} 
                        value={quantity}
                        onChange={(value) => {
                          if (value !== null) {
                            setQuantity(value);
                          }
                        }}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm w-32">Candidate Quantity</label>
                      <InputNumber 
                        min={1}
                        value={candidate}
                        onChange={(value) => {
                          if (value !== null) {
                            setCandidate(value);
                          }
                        }}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </>
                )}
              </div>
              <Button type="primary">Apply Config</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 pl-4">
        <h2 className="text-lg font-semibold mb-2">Results</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={`p-4 border rounded-md ${styles.resultsItem}`}>
              <div className="flex justify-between mb-2">
                <div>
                  <span className="text-blue-500"># {index + 1}</span>
                  <span className="ml-2 text-sm text-gray-500">| 分类名称</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>相关性: 0.8388</span>
                  <span>类型: 文本</span>
                  <span>更新时间: 0.057天</span>
                </div>
              </div>
              <p className="text-gray-800">WeOps工程流程自动化</p>
              <p className="text-gray-600">WeOps工程流程自动化旨在提高工程团队的工作效率和项目交付的准确性。</p>
              <p className="text-blue-500">WeOps工程流程自动化-AD.docx</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestingPage;