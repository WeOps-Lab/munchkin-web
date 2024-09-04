'use client';

import React from 'react';
import { Input, Switch, Slider, Button, Radio } from 'antd';

const ConfigPage: React.FC = () => {
  return (
    <div className="flex p-4">
      <div className="w-1/2 pr-4">
        <div className="mb-4 p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2">Text</h2>
          <div className="border rounded-md h-40"></div>
        </div>
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2">Config</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Embedding Model</label>
            <Input placeholder="Enter model" />
          </div>
          <div className="p-4 border rounded-md mb-4">
            <h3 className="text-md font-semibold mb-2">Retrieval setting</h3>
            <div className="mb-4">
              <Radio.Group>
                <Radio value="textSearch">Text Search</Radio>
              </Radio.Group>
              <p className="text-sm text-gray-600">Based on keyword search technology, it searches and extracts relevant documents from large volumes of text data.</p>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Rerank Model</label>
                <Switch />
              </div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Weight</label>
                <Slider className="flex-1 mx-2" defaultValue={50} />
                <Input className="w-12" value="0.5" readOnly />
              </div>
            </div>
            <div className="mb-4">
              <Radio.Group>
                <Radio value="vectorSearch">Vector Search</Radio>
              </Radio.Group>
              <p className="text-sm text-gray-600">Utilizing vector space models, it finds the best-matching data by calculating the similarity between vectors in high-dimensional space.</p>
            </div>
            <Button type="primary">Apply Config</Button>
          </div>
        </div>
      </div>
      <div className="w-1/2 pl-4">
        <h2 className="text-lg font-semibold mb-2">Results</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-4 border rounded-md results-item">
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

export default ConfigPage;