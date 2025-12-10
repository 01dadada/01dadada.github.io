import React from "react";

export function SectionCard({
    id,
    icon,
    title,
    description,
    children,
}: {
    id?: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section
            id={id}
            className="glass mx-auto w-full max-w-7xl p-8 md:p-10 animate-fade-in"
        >
            <div className="mb-8 flex items-start gap-4">
                <div className="group relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/30 to-brand-600/20 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 p-3.5 text-brand-200 shadow-lg shadow-brand-500/10 transition-all group-hover:scale-105">
                        {icon}
                    </div>
                </div>
                <div className="flex-1 space-y-2 pt-1">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
                    {description && (
                        <p className="text-slate-300 leading-relaxed max-w-2xl">{description}</p>
                    )}
                </div>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </section>
    );
}

