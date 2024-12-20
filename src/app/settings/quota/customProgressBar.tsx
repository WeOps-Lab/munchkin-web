import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { QuotaData } from '@/types/settings'

const CustomProgressBar: React.FC<QuotaData> = ({ label, usage, total, unit }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress((usage / total) * 100);
    }, 100);

    return () => clearTimeout(timeout);
  }, [usage, total]);

  return (
    <div className={`mb-4 flex items-center ${styles.progressContainer}`}>
      <div className="w-1/3">
        <div className="flex justify-between items-center mr-4 text-sm">
          <span>{label}</span>
          <span className="text-[var(--color-text-3)]">{`${usage}/${total}${unit}`}</span>
        </div>
      </div>
      <div className={`flex-1 ${styles.progressBar}`}>
        <div className={styles.progress} style={{ width: `${progress}%` }}>
        </div>
      </div>
    </div>
  );
};

export default CustomProgressBar;
