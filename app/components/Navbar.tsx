'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function FloatingNavbar() {
  return (
    <nav className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2">
      <div
        className="
          relative flex w-full items-center justify-between
          rounded-full border border-white/10
          bg-black/75 px-6 py-3
          shadow-[0_10px_40px_rgba(0,0,0,0.35)]
          backdrop-blur-xl
          md:px-10
        "
      >
        {/* Green ambient glow */}
        <div className="pointer-events-none absolute -left-20 top-1/2 h-24 w-32 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl" />

        {/* Red ambient glow */}
        <div className="pointer-events-none absolute -right-20 top-1/2 h-24 w-32 -translate-y-1/2 rounded-full bg-red-500/10 blur-3xl" />

        {/* Teramo */}
        <Link
          href="#"
          className="
            group relative z-10
            flex h-12 items-center
            rounded-full px-3
            transition-all duration-300
            hover:bg-white/5
          "
        >
          <Image
            src="/logos/terumo.jpg"
            alt="Teramo"
            width={130}
            height={42}
            className="
              h-9 w-auto object-contain
              transition-transform duration-300
              group-hover:scale-105
            "
            priority
          />
        </Link>

        {/* X */}
        <div className="relative z-10 flex items-center justify-center px-6 md:px-10">
          <motion.div
            className="relative flex h-10 w-10 items-center justify-center"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Main X */}
            <motion.span
              className="
                absolute h-[3px] w-9
                rotate-45 rounded-full
                bg-white
              "
              animate={{
                opacity: [0.75, 1, 0.75],
              }}
              transition={{
                duration: 2.5,
                repeat:  0,
                ease: 'easeInOut',
              }}
            />

            <motion.span
              className="
                absolute h-[3px] w-9
                -rotate-45 rounded-full
                bg-white
              "
              animate={{
                opacity: [0.75, 1, 0.75],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            />

            {/* Blue center pulse */}
            <motion.span
              className="
                absolute h-1.5 w-1.5
                rounded-full bg-blue-400
                shadow-[0_0_12px_rgba(96,165,250,0.9)]
              "
              animate={{
                scale: [0.8, 1.5, 0.8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>

        {/* AfyaRekod */}
        <Link
          href="#"
          className="
            group relative z-10
            flex h-12 items-center
            rounded-full px-3
            transition-all duration-300
            hover:bg-white/5
          "
        >
          <Image
            src="/logos/afyarekod.png"
            alt="AfyaRekod"
            width={140}
            height={42}
            className="
              h-9 w-auto object-contain
              transition-transform duration-300
              group-hover:scale-105
            "
            priority
          />
        </Link>

        {/* Bottom collaboration line */}
        <div
          className="
            pointer-events-none absolute
            bottom-0 left-1/2
            h-[1px] w-1/2
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-blue-400/50
            to-transparent
          "
        />
      </div>
    </nav>
  )
}