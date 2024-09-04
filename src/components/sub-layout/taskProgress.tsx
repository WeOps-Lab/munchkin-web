import React from 'react';
import styles from './index.module.less'; // 确保路径正确

interface Task {
  id: number;
  name: string;
}

const tasks: Task[] = [
  { id: 1, name: 'Task 1' },
  { id: 2, name: 'Task 2' },
];

const TaskProgress: React.FC = () => {
  return (
    <div className="p-4 absolute bottom-10 left-0 w-full">
      {tasks.map((task) => (
        <div key={task.id} className="mb-2">
          <div className="text-sm mb-1">{task.name}</div>
          <div className={`w-full h-2 rounded relative overflow-hidden ${styles.progressContainer}`}>
            <div className={`${styles.progressBar} h-full w-full`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskProgress;
