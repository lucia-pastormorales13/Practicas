import { useState } from 'react';
import { FolderKanban, Plus, LogOut, Calendar, Users as UsersIcon, Edit2, Trash2, ChevronRight, ListTodo, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Project, Task, ProjectStatus, TaskStatus, TaskPriority } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ManagerDashboard() {
  const { currentUser, logout, users } = useAuth();
  const { projects, tasks, createProject, updateProject, deleteProject, createTask, updateTask, deleteTask, getProjectsByUser, getTasksByProject } = useData();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const myProjects = getProjectsByUser(currentUser!.id);

  const getStatusColor = (status: ProjectStatus | TaskStatus) => {
    switch (status) {
      case 'pending':
      case 'todo':
        return 'bg-yellow-100 text-yellow-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
    }
  };

  const getStatusLabel = (status: ProjectStatus | TaskStatus) => {
    switch (status) {
      case 'pending':
      case 'todo':
        return 'Pendiente';
      case 'in_progress':
        return 'En Progreso';
      case 'completed':
        return 'Completado';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'high':
        return 'bg-red-100 text-red-700';
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'Baja';
      case 'medium':
        return 'Media';
      case 'high':
        return 'Alta';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl">Gestión de Proyectos</h1>
              <p className="text-sm text-muted-foreground">Bienvenido, {currentUser?.name}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">Mis Proyectos</h2>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setShowProjectModal(true);
                  }}
                  className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  title="Crear proyecto"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {myProjects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No tienes proyectos</p>
                    <p className="text-xs">Crea tu primer proyecto</p>
                  </div>
                ) : (
                  myProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedProject === project.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-transparent bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{project.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform ${selectedProject === project.id ? 'rotate-90' : ''}`} />
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <ListTodo className="w-3 h-3" />
                          {getTasksByProject(project.id).length}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedProject ? (
              <ProjectDetails
                project={myProjects.find((p) => p.id === selectedProject)!}
                tasks={getTasksByProject(selectedProject)}
                users={users}
                onEditProject={(project) => {
                  setEditingProject(project);
                  setShowProjectModal(true);
                }}
                onDeleteProject={(projectId) => {
                  if (confirm('¿Estás seguro de eliminar este proyecto y todas sus tareas?')) {
                    deleteProject(projectId);
                    setSelectedProject(null);
                  }
                }}
                onCreateTask={() => {
                  setEditingTask(null);
                  setShowTaskModal(true);
                }}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setShowTaskModal(true);
                }}
                onDeleteTask={(taskId) => {
                  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
                    deleteTask(taskId);
                  }
                }}
                onUpdateTask={updateTask}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
                getPriorityColor={getPriorityColor}
                getPriorityLabel={getPriorityLabel}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12">
                <div className="text-center text-muted-foreground">
                  <FolderKanban className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg mb-2">Selecciona un proyecto</h3>
                  <p className="text-sm">Elige un proyecto de la lista para ver sus detalles y tareas</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProjectModal && (
        <ProjectModal
          project={editingProject}
          users={users}
          currentUserId={currentUser!.id}
          onClose={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
          onCreate={createProject}
          onUpdate={updateProject}
        />
      )}

      {showTaskModal && selectedProject && (
        <TaskModal
          task={editingTask}
          projectId={selectedProject}
          users={users}
          project={myProjects.find((p) => p.id === selectedProject)!}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onCreate={createTask}
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}

function ProjectDetails({
  project,
  tasks,
  users,
  onEditProject,
  onDeleteProject,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onUpdateTask,
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  getPriorityLabel,
}: {
  project: Project;
  tasks: Task[];
  users: any[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  getStatusColor: (status: any) => string;
  getStatusLabel: (status: any) => string;
  getPriorityColor: (priority: TaskPriority) => string;
  getPriorityLabel: (priority: TaskPriority) => string;
}) {
  const members = users.filter((u) => project.memberIds.includes(u.id));

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <h2 className="text-2xl mb-2">{project.name}</h2>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEditProject(project)}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
              title="Editar proyecto"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteProject(project.id)}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              title="Eliminar proyecto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Inicio</p>
              <p>{format(new Date(project.startDate), 'dd/MM/yyyy')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Fin</p>
              <p>{format(new Date(project.endDate), 'dd/MM/yyyy')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UsersIcon className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Miembros</p>
              <p>{members.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg">Tareas</h3>
          <button
            onClick={onCreateTask}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No hay tareas en este proyecto</p>
            </div>
          ) : (
            tasks.map((task) => {
              const assignedUser = users.find((u) => u.id === task.assignedTo);
              return (
                <div key={task.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1">{task.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTask(task.id, { status: e.target.value as TaskStatus })}
                          className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(task.status)}`}
                        >
                          <option value="todo">Pendiente</option>
                          <option value="in_progress">En Progreso</option>
                          <option value="completed">Completado</option>
                        </select>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Vence: {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                        </span>
                        {assignedUser && (
                          <span className="text-xs text-muted-foreground">
                            Asignado: {assignedUser.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectModal({
  project,
  users,
  currentUserId,
  onClose,
  onCreate,
  onUpdate,
}: {
  project: Project | null;
  users: any[];
  currentUserId: string;
  onClose: () => void;
  onCreate: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  onUpdate: (projectId: string, updates: Partial<Project>) => void;
}) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [startDate, setStartDate] = useState(
    project?.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    project?.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : ''
  );
  const [status, setStatus] = useState<ProjectStatus>(project?.status || 'pending');
  const [memberIds, setMemberIds] = useState<string[]>(project?.memberIds || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (project) {
      onUpdate(project.id, { name, description, startDate, endDate, status, memberIds });
    } else {
      onCreate({
        name,
        description,
        startDate,
        endDate,
        status,
        memberIds,
        createdBy: currentUserId,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8">
        <h2 className="text-xl mb-6">{project ? 'Editar Proyecto' : 'Crear Proyecto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Nombre del proyecto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Fecha inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Fecha fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">Miembros del equipo</label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-input-background rounded-xl border border-border">
              {users.filter(u => u.role !== 'admin').map((user) => (
                <label key={user.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg">
                  <input
                    type="checkbox"
                    checked={memberIds.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMemberIds([...memberIds, user.id]);
                      } else {
                        setMemberIds(memberIds.filter((id) => id !== user.id));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{user.name} ({user.email})</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              {project ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskModal({
  task,
  projectId,
  users,
  project,
  onClose,
  onCreate,
  onUpdate,
}: {
  task: Task | null;
  projectId: string;
  users: any[];
  project: Project;
  onClose: () => void;
  onCreate: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
  );

  const availableUsers = users.filter(u => project.memberIds.includes(u.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (task) {
      onUpdate(task.id, { title, description, priority, status, assignedTo, dueDate });
    } else {
      onCreate({
        projectId,
        title,
        description,
        priority,
        status,
        assignedTo,
        dueDate,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8">
        <h2 className="text-xl mb-6">{task ? 'Editar Tarea' : 'Crear Tarea'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="todo">Pendiente</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completado</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Asignar a</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">Seleccionar usuario</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">Fecha de entrega</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              {task ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
