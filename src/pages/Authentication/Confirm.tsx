import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

export const Confirm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const confirmEmail = async () => {
            // Obtener el token de la URL
            const searchParams = new URLSearchParams(location.search);
            const token = searchParams.get("token");

            if (!token) {
                setError("Token no válido.");
                setLoading(false);
                return;
            }

            try {
                // Enviar el token a la API para confirmarlo
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/confirm`, {
                    token,
                });

                // Si la confirmación es exitosa, iniciar sesión automáticamente
                const { email } = response.data;
                login(email); 
                navigate("/");
            } catch (error: any) {
                setError(error.response?.data?.message || "Error al confirmar el correo.");
            } finally {
                setLoading(false);
            }
        };

        confirmEmail();
    }, [location, login, navigate]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl font-bold">Confirmando...</div>;
    }

    if (error) {
        return <div className="text-red-500 flex justify-center items-center h-screen text-xl font-bold">Error: {error}</div>;
    }

    return <div className="flex justify-center items-center h-screen text-xl font-bold">Confirmación exitosa, redirigiendo...</div>;
};
