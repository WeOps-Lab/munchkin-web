'use client';
import React, { useState, useEffect } from 'react';
import { Card, Input, Spin, Pagination, Tooltip } from 'antd';
import { useSearchParams } from 'next/navigation';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import styles from './index.module.less';
import ContentDrawer from '@/components/content-drawer';
import useContentDrawer from '@/hooks/useContentDrawer';

interface Paragraph {
  id: string;
  content: string;
}

const DocsResultPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [paragraphsState, setParagraphsState] = useState<Paragraph[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalItems, setTotalItems] = useState<number>(0);
  const searchParams = useSearchParams();
  const id = searchParams.get('knowledgeId');
  const { get } = useApiClient();

  const {
    drawerVisible,
    drawerContent,
    showDrawer,
    hideDrawer,
  } = useContentDrawer();

  const fetchData = async (page: number, pageSize: number) => {
    if (id) {
      setLoading(true);
      const params = {
        page,
        page_size: pageSize
      }
      try {
        const { count, items } = await get(`/knowledge_mgmt/knowledge_document/${id}/get_detail/`, { params });
        setParagraphsState(items);
        setTotalItems(count);
      } catch (error) {
        console.error(`${t('common.errorFetch')}: ${error}`);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [id, get, currentPage, pageSize]);

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  const filteredParagraphs = paragraphsState.filter(paragraph =>
    paragraph.content.toLowerCase().includes(searchTerm)
  );

  const handleContentClick = (content: string) => {
    showDrawer(content);
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-end items-center mb-4">
        <Input
          placeholder={`${t('common.search')}...`}
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
        <>
          <div className={`flex flex-wrap -mx-2 ${styles.resultWrap}`}>
            {filteredParagraphs.map((paragraph, index) => (
              <div key={paragraph.id} className="sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 cursor-pointer" onClick={() => handleContentClick(paragraph.content)}>
                <Card
                  size="small"
                  className={`rounded-lg flex flex-col justify-between ${styles.resultCard}`}
                  title={
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${styles.number}`}>
                        #{index.toString().padStart(3, '0')}
                      </span>
                    </div>
                  }
                >
                  <Tooltip 
                    title={paragraph.content}
                    overlayStyle={{ maxWidth: '550px' }}
                  >
                    <p className={`${styles.truncateLines}`}>
                      {paragraph.content || '--'}
                    </p>
                  </Tooltip>
                </Card>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
            />
          </div>
        </>
      )}
      <ContentDrawer
        visible={drawerVisible}
        onClose={hideDrawer}
        content={drawerContent}
      />
    </div>
  );
};

export default DocsResultPage;