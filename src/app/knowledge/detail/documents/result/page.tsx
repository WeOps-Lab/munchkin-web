'use client';
import React, { useState, useEffect } from 'react';
import { Card, Input, Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import useApiClient from '@/utils/request';
import styles from './index.module.less';

interface Paragraph {
  id: string;
  content: string;
}

const DocsResultPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [paragraphsState, setParagraphsState] = useState<Paragraph[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('knowledgeId');
  const { get } = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await get(`/knowledge_mgmt/knowledge_document/${id}/get_detail/`);
          setParagraphsState(data);
        } catch (error) {
          console.error('Error fetching document detail:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, get]);

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredParagraphs = paragraphsState.filter(paragraph =>
    paragraph.content.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end items-center mb-4">
        <Input
          placeholder="search..."
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          onPressEnter={() => handleSearch(searchTerm)}
          style={{ width: '240px' }}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-wrap -mx-2">
          {filteredParagraphs.map((paragraph, index) => (
            <div key={paragraph.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
              <Card
                size="small"
                className={`rounded-lg h-full flex flex-col justify-between ${styles.resultCard}`}
                title={
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${styles.number}`}>
                      #{index.toString().padStart(3, '0')}
                    </span>
                  </div>
                }
              >
                <p className={`${styles.truncateLines}`} title={paragraph.content || '--'}>
                  {paragraph.content || '--'}
                </p>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocsResultPage;