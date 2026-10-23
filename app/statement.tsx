import React from "react";

type StatementProps = { title: string, text: string };

export default function Statement({ title, text }: StatementProps) : React.ReactNode {
    return (
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                {title}
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                {text}
            </p>
        </div >
    )
}