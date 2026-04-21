"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
    label
}: {
    value: string;
    onChange: (value: string) => void;
    options: { id: string | number; name: string }[];
    placeholder: string;
    label?: string;
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((o) => o.id.toString() === value.toString());

    return (
        <div className={`relative w-full ${open ? 'z-50' : ''}`} ref={containerRef}>
            {label && <label className="block text-xs uppercase tracking-widest text-neutral-300 mb-2">{label}</label>}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full h-12 flex items-center justify-between rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-3 text-sm text-neutral-300 hover:border-emerald-400/40 hover:text-white transition outline-none"
            >
                <span className="flex-1 text-left truncate">
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <div className="flex items-center pointer-events-none ml-2">
                    <span className={`text-neutral-500 text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
                </div>
            </button>

            {open && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-ink-900/95 backdrop-blur shadow-xl overflow-hidden z-50 transform origin-top animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto w-full p-2 flex flex-col gap-1 custom-scrollbar">
                        <button
                            type="button"
                            onClick={() => {
                                onChange('');
                                setOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${value === ''
                                ? 'text-emerald-300 bg-emerald-400/10 font-medium'
                                : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {placeholder}
                        </button>
                        {options.map((o) => (
                            <button
                                key={o.id}
                                type="button"
                                onClick={() => {
                                    onChange(o.id.toString());
                                    setOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${value === o.id.toString()
                                    ? 'text-emerald-300 bg-emerald-400/10 font-medium'
                                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {o.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
