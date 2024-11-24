"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from');
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Dummy login logic for demonstration
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log(data);
            if (data.status === 200) {
                if (from) {
                    router.push(`/${from}`);
                } else {
                    router.push('/');
                }
            } else {
                setError(data.message);
                data.error && alert(data.error);
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Failed to login. Please try again.");
        }
    };

    useEffect(() => {
        if (error) {
            alert(error);
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }, [error]);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-6">
                    <p className="text-gray-700">Don't have an account? <Link href="/register" className="text-blue-500 hover:underline font-semibold">Register here.</Link></p>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </form>
        </div>
    )
}