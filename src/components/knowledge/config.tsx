import React from 'react';
import { Select, Radio, Switch, Slider, InputNumber, Input } from 'antd';
import styles from './index.module.less';

const { Option } = Select;

const modelOptions = ['Model A', 'Model B', 'Model C'];
const rerankModelOptions = ['Rerank Model A', 'Rerank Model B', 'Rerank Model C'];

interface ConfigProps {
  selectedSearchType: string | null;
  setSelectedSearchType: (value: string) => void;
  rerankModel: boolean;
  setRerankModel: (value: boolean) => void;
  selectedRerankModel: string | null;
  setSelectedRerankModel: (value: string | null) => void;
  weight: number;
  setWeight: (value: number) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  candidate: number;
  setCandidate: (value: number) => void;
}

const ConfigComponent: React.FC<ConfigProps> = ({
  selectedSearchType,
  setSelectedSearchType,
  rerankModel,
  setRerankModel,
  selectedRerankModel,
  setSelectedRerankModel,
  weight,
  setWeight,
  quantity,
  setQuantity,
  candidate,
  setCandidate,
}) => {
  return (
    <>
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
        </div>
      </div>
    </>
  );
};

export default ConfigComponent;