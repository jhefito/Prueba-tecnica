import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    email: '',
    password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
        console.log('Envío de solicitud de inicio de sesión con datos:', formData);
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        });

        console.log('Estado de la respuesta:', response.status);
        const data = await response.json();
        console.log('Datos de respuesta:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Error de inicio de sesión');
        }

        localStorage.setItem('token', data.token);
        setSuccess(true);
        
        // Delay navigation to show success message
        setTimeout(() => {
            navigate('/tasks');
        }, 2500);
    } catch (err) {
        console.error('Error de inicio de sesión:', err);
        setError(err instanceof Error ? err.message : 'No se ha podido conectar con el servidor. Compruebe si el servidor está en funcionamiento.');
    }
};

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Accede a tu cuenta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                O{' '}
                <Link to="/register" className="font-medium text-primary-main hover:text-primary-dark">
                    crea una nueva cuenta
                </Link>
            </p>
        </div>
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">Iniciando sesión</span>
            </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label htmlFor="email" className="sr-only">Correo electronico</label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-main focus:border-primary-main focus:z-10 sm:text-sm"
                    placeholder="Correo electronico"
                    value={formData.email}
                    onChange={handleChange}
                    />
                </div>
            <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-main focus:border-primary-main focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                />
            </div>
        </div>

        <div>
            <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-main hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main"
            >
                Iniciar sesión
            </button>
        </div>
        </form>
    </div>
</div>
);
};

export default Login;
