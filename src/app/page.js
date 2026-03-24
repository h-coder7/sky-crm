"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/") {
            const token = localStorage.getItem("token");
            const target = token ? "/dashboard" : "/login";

            // Use window.location.pathname check if needed, but router.push handles it.
            // The most important thing is to ensure this only runs once or when router changes.
            router.replace(target);
        }
    }, [pathname, router]);

    return (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center">
                <div className="spinner-border mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted">Redirecting...</h5>
            </div>
        </div>
    );
}
