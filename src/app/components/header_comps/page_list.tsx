"use client";

import Link from "next/link";
import { Home, Info } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarSeparator,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";


export default function PageList() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const list = [
        {
            name: "Trang chủ",
            link: "/",
            icon: Home
        },
        {
            name: "Về Hiển Review",
            link: "/about",
            icon: Info
        }
    ]

    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                router.refresh();
                console.log("Logout successful");
            }
        } catch (error) {
            console.error("Failed to logout", error);
        }
    }

    const handleClick = (link: string) => {
        console.log("handleClick", link);
        // setIsOpen(false);
        router.push(link);
    }

    useEffect(() => {
        console.log("isOpen", isOpen);
    }, [isOpen]);


    useEffect(() => {
        checkAuth();
    }, [pathname]);

    return (
        <div className="flex relative">
            <div className="hidden md:flex space-x-6">
                {list.map((item) => (
                    <Button key={item.name} variant={"ghost"} onClick={() => handleClick(item.link)} className={`text-gray-600 hover:text-[var(--inverse-primary-color)] transition-colors 
                        ${pathname === item.link ? "text-[var(--inverse-primary-color)] font-bold" : ""}`} >{item.name}</Button>
                ))}
            </div>
            <div className=" md:hidden absolute right-0 top-0 mt-[-20px]">
                <SidebarProvider open={isOpen} >
                    <Sidebar collapsible='icon' side="right">
                        <SidebarHeader className="pt-4">
                            <Link href="/" className="text-3xl text-center text-[var(--inverse-primary-color)] font-bold">Hiển Review</Link>
                            <img src='/images/avatar.jpg' alt="logo" className="rounded-full h-[100px] w-[100px] mx-auto" />
                        </SidebarHeader>
                        <SidebarSeparator />
                        <SidebarContent >
                            <SidebarMenu className="py-4 px-2">
                                {list.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton onClick={() => handleClick(item.link)} className={`my-2-py-2 text-lg ${pathname === item.link ? "text-blue-700 font-bold bg-blue-100 rounded-md" : ""}`} asChild>
                                            <Button variant={"ghost"} style={{ width: "100%", justifyContent: "flex-start", alignSelf: "flex-start" }} onClick={() => handleClick(item.link)}>
                                                <item.icon style={{ height: "20px", width: "20px" }} className="mr-2" />
                                                <span>{item.name}</span>
                                            </Button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarContent>
                        <SidebarFooter>
                            {!isLoggedIn && <Button variant={"secondary"} className="w-full" onClick={() => router.push(`/login?from=${pathname}`)}>Đăng nhập</Button>}
                            {isLoggedIn && <Button variant={"secondary"} className="w-full" onClick={() => router.push(`/add-post`)}>Thêm bài viết</Button>}
                            {isLoggedIn && <Button variant={"secondary"} className="w-full" onClick={handleLogout}>Đăng xuất</Button>}
                        </SidebarFooter>
                    </Sidebar>
                    <SidebarTrigger size="icon" variant={"secondary"} type="button" style={{ height: "40px", width: "40px" }} className="flex items-center justify-center" onClick={() => setIsOpen(true)} />
                </SidebarProvider>
            </div>
        </div>
    );
}