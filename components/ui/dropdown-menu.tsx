"use client"

import * as React from "react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest("[data-dropdown-menu]")) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block" data-dropdown-menu>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({
  children,
  asChild,
  ...props
}: {
  children: React.ReactNode
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu")

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => context.setOpen(!context.open),
      ...props,
    })
  }

  return (
    <button onClick={() => context.setOpen(!context.open)} {...props}>
      {children}
    </button>
  )
}

function DropdownMenuContent({
  children,
  className,
  align = "start",
}: {
  children: React.ReactNode
  className?: string
  align?: "start" | "end"
}) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu")

  if (!context.open) return null

  return (
    <div
      className={cn(
        "absolute top-full mt-1 min-w-32 rounded-md border border-slate-200 bg-white shadow-md z-50",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({
  children,
  onClick,
  className,
  asChild,
  ...props
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  asChild?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(DropdownMenuContext)

  const handleClick = () => {
    onClick?.()
    context?.setOpen(false)
  }

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
      className: cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-slate-100 rounded-sm",
        className,
      ),
      ...props,
    })
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-slate-100 rounded-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px bg-slate-200", className)} />
}

function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onClick,
  ...props
}: {
  className?: string
  children: React.ReactNode
  checked?: boolean
  onClick?: () => void
} & React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(DropdownMenuContext)

  const handleClick = () => {
    onClick?.()
    context?.setOpen(false)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-slate-100 rounded-sm",
        className,
      )}
      {...props}
    >
      <span className="flex size-4 items-center justify-center">{checked && <CheckIcon className="size-4" />}</span>
      {children}
    </div>
  )
}

function DropdownMenuRadioGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuRadioItem({
  className,
  children,
  checked,
  onClick,
  ...props
}: {
  className?: string
  children: React.ReactNode
  checked?: boolean
  onClick?: () => void
} & React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(DropdownMenuContext)

  const handleClick = () => {
    onClick?.()
    context?.setOpen(false)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-slate-100 rounded-sm",
        className,
      )}
      {...props}
    >
      <span className="flex size-4 items-center justify-center">
        {checked && <CircleIcon className="size-2 fill-current" />}
      </span>
      {children}
    </div>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  children,
  ...props
}: {
  className?: string
  inset?: boolean
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-medium", inset && "pl-8", className)} {...props}>
      {children}
    </div>
  )
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("text-slate-500 ml-auto text-xs tracking-widest", className)} {...props} />
}

function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: {
  className?: string
  inset?: boolean
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm hover:bg-slate-100",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </div>
  )
}

function DropdownMenuSubContent({
  className,
  children,
  ...props
}: {
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white text-slate-900 z-50 min-w-32 overflow-hidden rounded-md border border-slate-200 p-1 shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
