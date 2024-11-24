"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterForm() {

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, nickname, password }),
            });
            const data = await response.json();
            if (data.status === 201) {
                router.push('/');
            } else if (data.status === 409) {
                setError(data.message);
            }
        } catch (error) {
            console.error("Register error:", error);
            setError("Failed to register. Please try again.");
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
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6">Register</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleRegister}>
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
                <div className="mb-4">
                    <label htmlFor="nickname" className="block text-gray-700">Nickname</label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
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
                    <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-6">
                    <p className="text-gray-700">Already have an account? <Link href="/login" className="text-blue-500 hover:underline font-semibold">Login here.</Link></p>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Register
                </button>
            </form>
        </div>
    )
}