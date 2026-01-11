"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="p-5 text-center">
            <Link href="/dashboard" className="lnk">
                <span className="btn btn-warning">dashboard</span>
            </Link>
        </div>
    );
}
