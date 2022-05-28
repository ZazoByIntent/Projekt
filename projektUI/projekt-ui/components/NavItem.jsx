import Link from "next/link";
import React from "react";

export const NavItem = ({ text, href, active }) => {
    return (
        <Link href={href}>
            <a
                className={`nav__item ${
                    active ? "active" : ""
                }`}
            >
                {text}
            </a>
        </Link>
    );
};
