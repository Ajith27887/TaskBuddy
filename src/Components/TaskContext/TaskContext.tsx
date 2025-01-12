import React, { createContext, useState, ReactNode } from "react";

// Define the types for the context value
interface TaskContextType {
  tasks: string[];
  addTask: (task: string) => void;
  setShow: (show: boolean) => void;
  show: boolean;
  setCategory: (category: string) => void;
  category: string;
  setSelectedDate: (selectedDate: Date) => void;
  selectedDate: Date;
  setTaskStatus: (taskStatus: string) => void;
  taskStatus: string;
}

// Create the context with a default value
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Define the provider component props
interface TaskProviderProps {
  children: ReactNode;
}

// Create the provider component
const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [taskStatus, setTaskStatus] = useState<string>("");

  const addTask = (task: string) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        setShow,
        show,
        setCategory,
        setSelectedDate,
        selectedDate,
        category,
        setTaskStatus,
        taskStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
