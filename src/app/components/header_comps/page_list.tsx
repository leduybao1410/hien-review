"use client";

import Link from "next/link";
import { Home, Info } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

export default function PageList() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const list = [
        { name: "Trang chủ", link: "/", icon: Home },
        { name: "Về Hiển Review", link: "/about", icon: Info },
    ];

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const sidebarRef = useRef<any>(null);

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
    };

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
    };

    const handleClick = (link: string) => {
        console.log("handleClick", link);
        router.push(link);
        setIsOpen(false); // Close sidebar when clicking a link
    };

    // Close the sidebar when the route changes
    useEffect(() => {
        setIsOpen(false);
    }, [router]);

    useEffect(() => {
        checkAuth();
    }, [pathname]);

    return (
        <div className="flex relative">
            <div className="hidden md:flex space-x-6">
                {list.map((item) => (
                    <Button
                        key={item.name}
                        variant={"ghost"}
                        onClick={() => handleClick(item.link)}
                        className={`text-white hover:text-[var(--inverse-primary-color)] transition-colors  font-bold
                            ${pathname === item.link ? "text-[var(--inverse-primary-color)] bg-white " : ""}`}
                    >
                        {item.name}
                    </Button>
                ))}
            </div>

            <div className="md:hidden absolute right-0 top-0 mt-[-20px]">
                <SidebarProvider>
                    <Sidebar collapsible="icon" side="right" open={isOpen}>
                        <SidebarTrigger
                            size="icon"
                            variant={"secondary"}
                            type="button"
                            style={{ height: "40px", width: "40px", backgroundColor: "#777", color: "#fff" }}
                            className="ml-auto mr-4 mt-4"
                            onClick={() => setIsOpen(!isOpen)}
                        />
                        <SidebarHeader className="pt-4">
                            <Link href="/" className="text-3xl text-center text-[var(--inverse-primary-color)] font-bold">Hiển Review</Link>
                            <img src='/images/avatar.jpg' alt="logo" className="rounded-full h-[100px] w-[100px] mx-auto" />
                        </SidebarHeader>
                        <SidebarSeparator />
                        <SidebarContent>
                            <SidebarMenu className="py-4 px-2" style={{ listStyle: 'none', outline: 'none' }}>
                                {list.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            onClick={() => handleClick(item.link)}
                                            className={`mb-2 py-2 text-lg ${pathname === item.link ? "text-blue-700 font-bold bg-blue-100 rounded-md" : ""}`}
                                            asChild
                                        >
                                            <Button variant={"ghost"} style={{ minHeight: 45, width: "100%", justifyContent: "flex-start", alignSelf: "flex-start" }}>
                                                <item.icon style={{ height: "20px", width: "20px" }} className="mr-2" />
                                                <span>{item.name}</span>
                                            </Button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarContent>
                        <SidebarFooter>
                            {!isLoggedIn && <Button variant={"secondary"} className="w-full" onClick={() => { router.push(`/login?from=${pathname}`); setIsOpen(false); }}>Đăng nhập</Button>}
                            {isLoggedIn && <Button variant={"secondary"} className="w-full" onClick={() => { router.push(`/add-post`); setIsOpen(false); }}>Thêm bài viết</Button>}
                            {isLoggedIn && <Button variant={"secondary"} className="w-full" onClick={() => { handleLogout(); setIsOpen(false); }}>Đăng xuất</Button>}
                        </SidebarFooter>
                    </Sidebar>

                    {/* Trigger button */}
                    <SidebarTrigger
                        size="icon"
                        variant={"secondary"}
                        type="button"
                        style={{ height: "40px", width: "40px" }}
                        className="flex items-center justify-center"
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </SidebarProvider>
            </div>
        </div>
    );
}
