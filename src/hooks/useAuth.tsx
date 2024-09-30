import { registerService } from './../services/register';

interface RegisterParams {
    username: string;
    email: string;
    password: string;
    role: string;
}

export const useAuth = () => {
    const handleRegister = async ({ username, email, password, role }: RegisterParams): Promise<string> => {
        try {
            const message = await registerService({ username, email, password, role });
            return message;
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    };

    return { register: handleRegister };
}
