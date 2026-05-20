import { useState, useMemo } from 'react';
import { ListTodo, LogOut, Filter, Calendar, FolderKanban, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { TaskStatus, TaskPriority, Task } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function CollaboratorDashboard() {
  const { currentUser, logout } = useAuth();
  const { tasks, projects, updateTask, getTasksByUser } = useData();
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');

  const myTasks = getTasksByUser(currentUser!.id);

  const filteredTasks = useMemo(() => {
    return myTasks.filter((task) => {
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      return true;
    });
  }, [myTasks, filterStatus, filterPriority]);

  const stats = {
    total: myTasks.length,
    todo: myTasks.filter((t) => t.status === 'todo').length,
    inProgress: myTasks.filter((t) => t.status === 'in_progress').length,
    completed: myTasks.filter((t) => t.status === 'completed').length,
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return AlertCircle;
      case 'in_progress':
        return Clock;
      case 'completed':
        return CheckCircle2;
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

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || 'Proyecto desconocido';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl">Mis Tareas</h1>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pendiente</p>
                <p className="text-2xl">{stats.todo}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">En Progreso</p>
                <p className="text-2xl">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completado</p>
                <p className="text-2xl">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div>
                <h2 className="text-xl">Mis Tareas Asignadas</h2>
                <p className="text-sm text-muted-foreground">Gestiona el estado de tus tareas</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
                    className="px-3 py-2 bg-input-background rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="todo">Pendiente</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
                  className="px-3 py-2 bg-input-background rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ListTodo className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg mb-2">No tienes tareas</h3>
                <p className="text-sm">
                  {filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'No hay tareas con los filtros seleccionados'
                    : 'Aún no se te han asignado tareas'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTasks.map((task) => {
                  const StatusIcon = getStatusIcon(task.status);
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      projectName={getProjectName(task.projectId)}
                      onUpdateStatus={(status) => updateTask(task.id, { status })}
                      getStatusColor={getStatusColor}
                      getPriorityColor={getPriorityColor}
                      getPriorityLabel={getPriorityLabel}
                      StatusIcon={StatusIcon}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  projectName,
  onUpdateStatus,
  getStatusColor,
  getPriorityColor,
  getPriorityLabel,
  StatusIcon,
}: {
  task: Task;
  projectName: string;
  onUpdateStatus: (status: TaskStatus) => void;
  getStatusColor: (status: TaskStatus) => string;
  getPriorityColor: (priority: TaskPriority) => string;
  getPriorityLabel: (priority: TaskPriority) => string;
  StatusIcon: any;
}) {
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== 'completed';
  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 shadow-sm border-2 transition-all hover:shadow-md ${getStatusColor(task.status)}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2">
          <div className={`mt-0.5 p-1.5 rounded-lg ${getStatusColor(task.status).replace('border-', 'bg-').split(' ')[0]}`}>
            <StatusIcon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium leading-tight mb-1">{task.title}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <FolderKanban className="w-3 h-3" />
              {projectName}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{task.description}</p>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
          {getPriorityLabel(task.priority)}
        </span>
        <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
          <Calendar className="w-3 h-3" />
          <span>{format(dueDate, 'dd/MM/yyyy')}</span>
          {task.status !== 'completed' && (
            <span className="ml-1">
              ({isOverdue ? `${Math.abs(daysUntilDue)} días retrasada` : `${daysUntilDue} días`})
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-2">Estado de la tarea</label>
        <select
          value={task.status}
          onChange={(e) => onUpdateStatus(e.target.value as TaskStatus)}
          className="w-full px-3 py-2 bg-white rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="todo">Pendiente</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Completado</option>
        </select>
      </div>
    </div>
  );
}
