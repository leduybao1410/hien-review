"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
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
    SidebarSeparator
} from "@/components/ui/sidebar"
import { useState } from "react";


export default function PageList() {
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

    return (
        <div className="flex space-x-6 relative">
            <div className="hidden md:flex space-x-6">
                {list.map((item) => (
                    <Link key={item.name} href={item.link} className={`text-gray-600 hover:text-[var(--inverse-primary-color)] transition-colors 
                        ${pathname === item.link ? "text-[var(--inverse-primary-color)] font-bold" : ""}`} >{item.name}</Link>
                ))}
            </div>
            <div className="self-center md:hidden absolute right-0 top-0">
                <SidebarProvider open={isOpen}>
                    <Sidebar collapsible='icon' side="right">
                        <SidebarHeader className="pt-4">
                            <Link href="/" className="text-3xl text-[var(--inverse-primary-color)] font-bold">Hiển Review</Link>
                        </SidebarHeader>
                        <SidebarSeparator />
                        <SidebarContent >
                            <SidebarMenu>
                                {list.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.link}>
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarContent>
                    </Sidebar>
                    <SidebarTrigger onClick={() => setIsOpen(!isOpen)}>
                        <FiMenu size={24} />
                    </SidebarTrigger>
                </SidebarProvider>
            </div>
        </div>
    );
}