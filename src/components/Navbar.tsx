"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
          <Image
            src="/images/logo-tymor.png"
            alt="Tymor AI"
            width={150}
            height={60}
            style={{ height: "60px", width: "auto" }}
          />
        </Link>

        <button
          className={`navbar-toggler ${isMenuOpen ? "active" : ""}`}
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`collapse navbar-collapse justify-content-end ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" href="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#solutions">Solutions</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#project">Project</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#industry">AI By Industry</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#blog">Blog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
