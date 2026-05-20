import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Task, ProjectStatus, TaskStatus, TaskPriority } from '../types';

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getProjectsByUser: (userId: string) => Project[];
  getTasksByProject: (projectId: string) => Task[];
  getTasksByUser: (userId: string) => Task[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECTS: 'taskapp_projects',
  TASKS: 'taskapp_tasks',
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const createProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map((p) =>
      p.id === projectId ? { ...p, ...updates } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    const updatedTasks = tasks.filter((t) => t.projectId !== projectId);
    setProjects(updatedProjects);
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
  };

  const createTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, ...updates } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
  };

  const getProjectsByUser = (userId: string): Project[] => {
    return projects.filter(
      (p) => p.createdBy === userId || p.memberIds.includes(userId)
    );
  };

  const getTasksByProject = (projectId: string): Task[] => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  const getTasksByUser = (userId: string): Task[] => {
    return tasks.filter((t) => t.assignedTo === userId);
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
        getProjectsByUser,
        getTasksByProject,
        getTasksByUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
