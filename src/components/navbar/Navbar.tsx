"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  /*
   * menuOpen controls whether the mobile navigation
   * menu is currently visible.
   *
   * false = menu closed
   * true  = menu open
   */
  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * scrolled tells us whether the user has moved
   * down the page.
   *
   * false = user is near the top
   * true  = user has scrolled
   */
  const [scrolled, setScrolled] = useState(false);

  /*
   * useEffect runs after the component is rendered.
   *
   * Here we create a listener for the browser's
   * "scroll" event.
   */
  useEffect(() => {
    /*
     * This function runs every time the user scrolls.
     */
    const handleScroll = () => {
      /*
       * window.scrollY tells us how many pixels
       * the page has been scrolled vertically.
       *
       * If the user has scrolled more than 50px,
       * we consider the navbar to be in "scrolled" state.
       */
      setScrolled(window.scrollY > 50);
    };

    /*
     * Tell the browser to execute handleScroll
     * whenever a scroll occurs.
     */
    window.addEventListener("scroll", handleScroll);

    /*
     * Cleanup function.
     *
     * When this component is removed, we remove the
     * event listener so that we don't leave unnecessary
     * listeners running in the browser.
     */
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * Close the mobile menu whenever a navigation
   * link is selected.
   */
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed left-0 top-0 z-50 w-full px-6 py-6 transition-all duration-500 md:px-10 ${
        scrolled
          ? "bg-[#f5f1e8]/95 text-neutral-900 shadow-sm backdrop-blur-md"
          : "bg-transparent text-white"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between">

        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group"
        >
          <div className="text-sm font-medium tracking-[0.25em]">
            AKSHITA
          </div>

          <div
            className={`text-[10px] tracking-[0.45em] transition-colors duration-500 ${
              scrolled
                ? "text-neutral-700"
                : "text-white/70"
            }`}
          >
            MELAMINE
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">

          {/* 
           * These URLs intentionally start with "/".
           *
           * This means they work correctly from:
           *
           * /
           * /products
           * /products/1
           *
           * instead of relying on the current page URL.
           */}
          <Link
            href="/#collections"
            className="text-sm transition-opacity hover:opacity-50"
          >
            Collections
          </Link>

          <Link
            href="/#about"
            className="text-sm transition-opacity hover:opacity-50"
          >
            About
          </Link>

          <Link
            href="/#contact"
            className="text-sm transition-opacity hover:opacity-50"
          >
            Contact
          </Link>

        </div>

        {/* Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 flex items-center gap-3 text-sm"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span>
            {menuOpen ? "CLOSE" : "MENU"}
          </span>

          <span className="flex flex-col gap-1">
            <span
              className={`block h-px w-5 transition-colors duration-500 ${
                scrolled ? "bg-black" : "bg-white"
              }`}
            />

            <span
              className={`block h-px w-3 transition-colors duration-500 ${
                scrolled ? "bg-black" : "bg-white"
              }`}
            />
          </span>
        </button>

      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-0 -z-10 flex h-screen w-full flex-col items-center justify-center bg-[#f5f1e8] text-neutral-900"
          >
            <div className="flex flex-col items-center gap-8 text-3xl">

              <Link
                href="/#collections"
                onClick={closeMenu}
              >
                Collections
              </Link>

              <Link
                href="/#about"
                onClick={closeMenu}
              >
                About
              </Link>

              <Link
                href="/#contact"
                onClick={closeMenu}
              >
                Contact
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}