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
    SidebarSeparator,
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
        <div className="flex relative">
            <div className="hidden md:flex space-x-6">
                {list.map((item) => (
                    <Link key={item.name} href={item.link} className={`text-gray-600 hover:text-[var(--inverse-primary-color)] transition-colors 
                        ${pathname === item.link ? "text-[var(--inverse-primary-color)] font-bold" : ""}`} >{item.name}</Link>
                ))}
            </div>
            <div className=" md:hidden absolute right-0 top-0 mt-[-20px]">
                <SidebarProvider open={isOpen}>
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
                                        <SidebarMenuButton onClick={() => setIsOpen(false)} className={`my-2-py-2 text-lg ${pathname === item.link ? "text-blue-700 font-bold bg-blue-100 rounded-md" : ""}`} asChild>
                                            <Link href={item.link}>
                                                <item.icon style={{ height: "20px", width: "20px" }} className="mr-2" />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarContent>
                    </Sidebar>
                    <SidebarTrigger size="icon" variant={"secondary"} type="button" style={{ height: "40px", width: "40px" }} className="flex items-center justify-center" onClick={() => setIsOpen(true)} />
                </SidebarProvider>
            </div>
        </div>
    );
}