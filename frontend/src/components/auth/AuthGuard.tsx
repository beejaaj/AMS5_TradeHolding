"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const publicRoutes = [
            "/users/login",
            "/users/create",
            "/" 
        ];

        const isPublicRoute = publicRoutes.some(route => pathname === route);

        const token = localStorage.getItem("token");

        if (!token && !isPublicRoute) {
            router.push("/users/login");
        } else {
            setIsChecking(false);
        }
    }, [router, pathname]);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#8B5CF6]" size={40} />
            </div>
        );
    }

    return <>{children}</>;
}