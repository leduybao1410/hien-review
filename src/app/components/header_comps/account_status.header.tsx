"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AccountStatus() {
    const pathname = usePathname();
    const path = pathname.charAt(0) === "/" ? pathname.slice(1) : pathname;
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkAuth();
        console.log("pathname", pathname);
    }, [pathname]);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth', {
                method: 'GET',
            });
            if (response.status === 200) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            console.log("checkAuth", response);
        } catch (error) {
            console.error("Failed to check authentication", error);
        }
    }

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ force: true })
            });
            if (response.status === 200) {
                setIsLoggedIn(false);
                router.refresh
                console.log("Logout successful");
            }
        } catch (error) {
            console.error("Failed to logout", error);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center w-10 h-10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent >
                {isLoggedIn && <DropdownMenuItem>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/add-post" className="flex items-center space-x-2 w-full">Thêm bài viết</Link>
                    </Button>
                </DropdownMenuItem>}
                {!isLoggedIn && (
                    <DropdownMenuItem>
                        <Button variant="outline" className="w-full" onClick={() => router.push(`/login?from=${path}`)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            Đăng nhập
                        </Button>
                    </DropdownMenuItem>
                )}
                {isLoggedIn && (
                    <DropdownMenuItem>
                        <Button variant="outline" className="w-full" onClick={handleLogout}>Đăng xuất</Button>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
