"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { confirmAction } from "@/utils/confirm";

export default function SideMenu() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <aside className="sidemenu">

            <div className="top-cont">

                <div className="logo-wrapper">
                    <Link href="/" className="logo ">
                        <Image
                            src="/images/sky-logo.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="img-contain"
                        />
                    </Link>
                </div>

                <div className="sidemenu-links pt-4">
                    {/* <div className="sub-title text mt-4 mb-2">
                        Main Menu
                    </div> */}

                    <ul className="links">
                        <li>
                            <Link href="/dashboard" className={`lnk ${isActive("/dashboard") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-chart-simple"></i>
                                </span>
                                <span className="txt">Dashboard</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/dashboard/admins" className={`lnk ${isActive("/dashboard/admins") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-user-tie"></i>
                                </span>
                                <span className="txt">Admins</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/dashboard/employees" className={`lnk ${isActive("/dashboard/employees") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-users"></i>
                                </span>
                                <span className="txt">Employees</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/dashboard/categories" className={`lnk ${isActive("/dashboard/categories") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-grid-2"></i>
                                </span>
                                <span className="txt">Categories</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/dashboard/sectors" className={`lnk ${isActive("/dashboard/sectors") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-tire"></i>
                                </span>
                                <span className="txt">Sectors</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/dashboard/countries" className={`lnk ${isActive("/dashboard/countries") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-globe"></i>
                                </span>
                                <span className="txt">Countries</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/dashboard/products" className={`lnk ${isActive("/dashboard/products") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-box"></i>
                                </span>
                                <span className="txt">Products</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/dashboard/contact-lists" className={`lnk ${isActive("/dashboard/contact-lists") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-list"></i>
                                </span>
                                <span className="txt">Contact Lists</span>
                            </Link>
                        </li>


                        <li>
                            <Link href="/dashboard/deals" className={`lnk ${isActive("/dashboard/deals") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-check-circle"></i>
                                </span>
                                <span className="txt">Deals</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/dashboard/about" className={`lnk ${isActive("/dashboard/about") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-bell"></i>
                                </span>
                                <span className="txt">about</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/tasks" className={`lnk ${isActive("/tasks") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-square-check"></i>
                                </span>
                                <span className="txt">Tasks</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/companies" className={`lnk ${isActive("/companies") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-city"></i>
                                </span>
                                <span className="txt">Companies</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/contacts" className={`lnk ${isActive("/contacts") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-id-badge"></i>
                                </span>
                                <span className="txt">Contacts</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="btm-cont">
                <div className="sidemenu-links">
                    <ul className="links">
                        <li>
                            <Link href="/invite-team" className={`lnk ${isActive("/invite-team") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-user-plus"></i>
                                </span>
                                <span className="txt">Invite Team</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/integration" className={`lnk ${isActive("/integration") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-grid-2"></i>
                                </span>
                                <span className="txt">Integration</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/help" className={`lnk ${isActive("/help") ? "active" : ""}`}>
                                <span className="icon">
                                    <i className="fal fa-headphones"></i>
                                </span>
                                <span className="txt">Help & First step</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="user-wrapper">
                    <div className="avatar">
                        <Image
                            src="/images/av2.png"
                            alt="User Avatar"
                            width={40}
                            height={40}
                        />
                    </div>

                    <div className="inf">
                        <h6>Yasmin Ali</h6>
                        <small>YasminAli@gmail.com</small>
                    </div>

                    <button
                        className="btn border-0 p-0 ms-auto text-danger"
                        onClick={() => {
                            confirmAction({
                                title: "Logout?",
                                message: "Are you sure you want to logout?",
                                confirmLabel: "Logout",
                                onConfirm: () => {
                                    console.log("Logged out");
                                    // 🔜 Logout logic (e.g. redirect to login)
                                },
                            });
                        }}
                        title="Logout"
                    >
                        <i className="fal fa-sign-out fa-lg"></i>
                    </button>
                </div>
            </div>
        </aside>
    );
}
