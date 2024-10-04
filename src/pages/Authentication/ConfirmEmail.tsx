import { Buttons } from "../../components/Buttons/Buttons";

export const ConfirmEmail = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="bg-slate-200 text-center font-bold p-6 rounded-md border border-slate-300">
                <h1 className="text-3xl  ">Gracias por registrarse</h1>
                <p className="  pt-4 text-xl">Hemos enviado un correo electronico para confirmar tu cuenta</p>
                <p className="  py-4 text-xl">Por favor revisa tu correo</p>
                <Buttons title="Iniciar sesion" to="/signin" />
            </div>
        </div>
    );
}