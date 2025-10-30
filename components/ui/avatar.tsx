"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)} {...props} />
}

function AvatarImage({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("aspect-square size-full object-cover", className)} {...props} />
}

function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-slate-200 flex size-full items-center justify-center rounded-full text-sm font-medium text-slate-700",
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
