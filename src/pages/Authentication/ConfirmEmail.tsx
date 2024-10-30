import { Buttons } from "../../components/Buttons/Buttons";

export const ConfirmEmail = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="bg-primary text-center text-white font-bold p-10 rounded-md border">
                <h1 className="text-3xl">¡Gracias por registrarte!</h1>
                <p className="pt-4 text-xl">Te hemos enviado un correo para confirmar tu cuenta.</p>
                <p className="py-4 text-xl">Por favor, revisa tu bandeja de entrada.</p>
                <Buttons title="Iniciar sesión" to="/signin" />
            </div>
        </div>
    );
}