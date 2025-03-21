import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({ title: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/ ');
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3002/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token caducado o inválido
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Fallo en la búsqueda de tareas');
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Se ha producido un error');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/ ');
      return;
    }
    fetchTasks();
  }, [navigate]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/ ');
        return;
      }

      const url = isEditing 
        ? `http://localhost:3002/api/tasks/${currentTask._id}`
        : 'http://localhost:3002/api/tasks';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentTask)
      });

      if (response.status === 401) {
        // Token caducado o inválido
        localStorage.removeItem('token');
        navigate('/ ');
        return;
      }
      
      if (!response.ok) {
        throw new Error(isEditing ? 'Error al actualizar la tarea' : 'Error al crear la tarea');
      }

      setOpenDialog(false);
      setCurrentTask({ title: '', description: '' });
      setIsEditing(false);
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Se ha producido un error');
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/ ');
        return;
      }

      const response = await fetch(`http://localhost:3002/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token caducado o inválido
        localStorage.removeItem('token');
        navigate('/ ');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Error al eliminar tarea');
      }

      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Se ha producido un error');
    }
  };

  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setIsEditing(true);
    setOpenDialog(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tareas</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <button
        className="mb-4 bg-primary-main hover:bg-primary-dark text-white font-bold py-2 px-4 rounded inline-flex items-center"
        onClick={() => {
          setCurrentTask({ title: '', description: '' });
          setIsEditing(false);
          setOpenDialog(true);
        }}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Añadir tarea
      </button>
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow duration-200"
          >
            <div>
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isEditing ? 'Editar tarea' : 'Nueva tarea'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la tarea
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-main focus:ring focus:ring-primary-main focus:ring-opacity-50"
                    value={currentTask.title}
                    onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripcion
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-main focus:ring focus:ring-primary-main focus:ring-opacity-50"
                    value={currentTask.description}
                    onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main rounded-md"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-main hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main rounded-md"
                onClick={handleSubmit}
              >
                {isEditing ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {isEditing ? 'Editar tarea' : 'Nueva Tarea'}
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Titulo de la tarea
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-main focus:ring-primary-main sm:text-sm"
                      value={currentTask.title}
                      onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Descripcion
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-main focus:ring-primary-main sm:text-sm"
                      value={currentTask.description}
                      onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-main text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSubmit}
                >
                  {isEditing ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancelar
              </button>
        </div>
      </div>
    </div>
  )
}
  
export default Tasks;
