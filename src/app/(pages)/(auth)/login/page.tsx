import { Suspense } from "react";
import LoginForm from "./login_form";
const LoginPage = () => {


    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-800">
            <div className="w-full max-w-md">
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
};

export default LoginPage;
