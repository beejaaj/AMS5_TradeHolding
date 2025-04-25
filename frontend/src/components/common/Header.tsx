"use client";

import { useEffect, useState } from "react";
import { FaUserAlt } from 'react-icons/fa';
import Link from 'next/link';
import './Header.css';

export const Header = () => {

    return (
        <header className="header">
            <div className="logo-container">
                <Link href="/users" className="logo">
                    <img src="/Lunaria.jpg" alt="Logo do Site" className="logo-img" />
                </Link>
            </div>

        </header>
    );
};