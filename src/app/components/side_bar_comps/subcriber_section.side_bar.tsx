"use client"
import { Subscriber } from "@/app/schema/subcriber.schema";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


interface alertMessageType {
    title: string;
    description: string;
}
const alertMessageType = {
    success: {
        title: "Chúc mừng",
        description: "Bạn đã đăng ký nhận bản tin"
    },
    alreadySubscribed: {
        title: "Rất tiếc",
        description: "Bạn đã đăng ký nhận bản tin rồi"
    },
    error: {
        title: "Rất tiếc",
        description: "Đã xảy ra lỗi"
    }
}

export default function SubcribeSection() {

    const [email, setEmail] = useState("");
    const [alertMessage, setAlertMessage] = useState<alertMessageType | null>(null);
    // Hide alert after 3 seconds
    useEffect(() => {
        if (alertMessage) {
            setTimeout(() => {
                setAlertMessage(null);
            }, 3000);
        }
    }, [alertMessage]);

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body: Subscriber = { email, subscribedAt: Date.now().valueOf() };
        const response = await fetch("/api/subcribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (data.status === 200) {
            setAlertMessage(alertMessageType.success);
            setEmail("");
        } else if (data.status === 400) {
            setAlertMessage(alertMessageType.alreadySubscribed);
        } else {
            setAlertMessage(alertMessageType.error);
        }
    }


    return (
        //  Newsletter Subscription 
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">Đăng ký nhận bản tin</h3>
            <form onSubmit={handleSubscribe}>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Đăng ký
                </button>
                {alertMessage && (
                    <Alert variant={'default'} className={`mt-4 text-white px-4 py-2 rounded-lg ${alertMessage.title === "Congratulations" ? 'bg-green-600' : 'bg-red-600'}`}>
                        <AlertTitle className="text-white font-bold text-lg">{alertMessage.title}</AlertTitle>
                        <AlertDescription>{alertMessage.description}</AlertDescription>
                    </Alert>
                )}
            </form>
        </div>
    )
}