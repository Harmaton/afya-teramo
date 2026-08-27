'use client';

import RegistrationForm from "@/app/components/form";
import { useState } from "react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <main className="mx-auto max-w-4xl px-4 pt-28 pb-24 sm:pt-36 sm:pb-32">
        <div className="mb-10 space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            AICE Africa × Terumo BCT
          </p>
          <h1 className="text-3xl font-semibold text-neutral-100 sm:text-4xl">
            ABBIS Hackathon — Register Your Team
          </h1>
          <p className="max-w-xl text-sm text-neutral-500">
            Applications close Friday, 18 September 2026. Your entry is added directly
            to the official registrations sheet.
          </p>
        </div>

        <RegistrationForm />
      </main>

    </div>
  );
}