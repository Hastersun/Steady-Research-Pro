import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

// Avoid using Radix primitives during SSR because they rely on React context
// which can throw when children are rendered outside the Root in some SSR flows.
const isServer = typeof window === 'undefined'

let Avatar: any
let AvatarImage: any
let AvatarFallback: any

if (isServer) {
  // Simple server-side fallbacks that render plain HTML and do not rely on Radix
  Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
    <div ref={ref as any} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}>
      {children}
    </div>
  ))

  AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(({ className, ...props }, ref) => (
    // Render a plain img on the server
    <img ref={ref as any} className={cn("aspect-square h-full w-full", className)} {...props} />
  ))

  AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref as any} className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)} {...props} />
  ))
} else {
  // Client-side: use Radix primitives for full behavior
  Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  ))
  Avatar.displayName = AvatarPrimitive.Root.displayName

  AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  ))
  AvatarImage.displayName = AvatarPrimitive.Image.displayName

  AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
  >(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  ))
  AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName
}

export { Avatar, AvatarImage, AvatarFallback }
