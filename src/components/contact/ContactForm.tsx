"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2 } from "lucide-react";

export const ContactForm: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-canvas border border-stone p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="border-b border-stone pb-4">
        <h3 className="font-serif text-2xl font-normal text-ink">Skicka ett direktmeddelande</h3>
        <p className="text-xs text-ink/70 font-sans mt-1">
          Gäller det offert med bilder rekommenderar vi vårt <Link href="/tjanster/offert" className="text-wood underline">offertformulär</Link>.
        </p>
      </div>

      {sent ? (
        <div className="p-8 bg-stone-light text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-wood mx-auto" />
          <h4 className="font-serif text-xl text-ink">Tack för ditt meddelande!</h4>
          <p className="text-xs text-ink/70 font-mono">Vi återkopplar inom kort.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono uppercase text-ink/70 mb-1">Ditt Namn *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="För- och efternamn"
              className="w-full bg-canvas border border-stone p-2.5 font-sans text-ink focus:outline-none focus:border-wood"
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-ink/70 mb-1">E-postadress *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="namn@epost.se"
              className="w-full bg-canvas border border-stone p-2.5 font-sans text-ink focus:outline-none focus:border-wood"
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-ink/70 mb-1">Ditt Meddelande *</label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hur kan vi hjälpa dig?"
              className="w-full bg-canvas border border-stone p-2.5 font-sans text-ink focus:outline-none focus:border-wood"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-ink hover:bg-wood text-canvas font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Skicka Meddelande</span>
          </button>
        </form>
      )}
    </div>
  );
};
