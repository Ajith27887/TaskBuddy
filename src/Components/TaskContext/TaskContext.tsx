import React, { createContext, useState, ReactNode } from "react";
import { useAuth } from "../AuthContext/AuthContext.tsx";
import { supabase } from "../Supabase/Supabase";

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
  setTitle: (title: string) => void;
  title: string;
  setTaskData: (taskData: object) => void;
  taskData: object;
  handleChange: (file: File) => void;
  fetchTasks: () => Promise<void>;
  allTasks: any[];
  navFilterStatus: string;
  sethandleNavFilterStatus: (navFilterStatus: string) => void;
  navFilterDate: string;
  setNavFilterDate: (navFilterDate: string) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
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
  const [title, setTitle] = useState<string>("");
  const [taskData, setTaskData] = useState<object>({});
  const [file, setFile] = useState<File | null>(null);
  const { currentUser } = useAuth();
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [navFilterStatus, sethandleNavFilterStatus] = useState<string>("");
  const [navFilterDate, setNavFilterDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleChange = (file: File) => {
    setFile(file);
  };

  console.log(allTasks, "alltask");

  const addTask = (task: string) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("todo")
        .select("*")
        .eq("user_id", currentUser.email);

      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setAllTasks(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        setSearchQuery,
        searchQuery,
        tasks,
        addTask,
        allTasks,
        setShow,
        show,
        setCategory,
        setNavFilterDate,
        setSelectedDate,
        navFilterDate,
        selectedDate,
        sethandleNavFilterStatus,
        navFilterStatus,
        category,
        setTaskStatus,
        taskStatus,
        setTitle,
        title,
        setTaskData,
        handleChange,
        taskData,
        fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
