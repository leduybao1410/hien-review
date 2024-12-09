import Link from "next/link";
import SearchQuery from "./searchQuery";
import AccountStatus from "./account_status.header";
import PageList from "./page_list";
import Image from "next/image";
import logo from "../../../assets/images/logo_transparent.png";

export default function Header() {

    return (
        <nav className="sticky top-0 bg-[var(--inverse-primary-color)] shadow-md z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src={logo} alt="logo" width={35} height={35} />
                        <h1 className="text-xl font-bold text-white">Hiển Review</h1>
                    </Link>
                    <PageList />
                    {/* Search and account status: only show on desktop */}
                    <div className="items-center space-x-4 md:flex hidden">
                        <SearchQuery />
                        <AccountStatus />
                    </div>
                </div>
            </div>
        </nav>
    )
}