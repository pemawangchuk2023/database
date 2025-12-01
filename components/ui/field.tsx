import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Field = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("grid gap-2", className)} {...props} />
        )
    }
)
Field.displayName = "Field"

const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("grid gap-4", className)} {...props} />
        )
    }
)
FieldGroup.displayName = "FieldGroup"

const FieldSet = React.forwardRef<HTMLFieldSetElement, React.HTMLAttributes<HTMLFieldSetElement>>(
    ({ className, ...props }, ref) => {
        return (
            <fieldset ref={ref} className={cn("grid gap-4 rounded-lg border p-4", className)} {...props} />
        )
    }
)
FieldSet.displayName = "FieldSet"

const FieldLegend = React.forwardRef<HTMLLegendElement, React.HTMLAttributes<HTMLLegendElement>>(
    ({ className, ...props }, ref) => {
        return (
            <legend ref={ref} className={cn("px-1 text-sm font-medium", className)} {...props} />
        )
    }
)
FieldLegend.displayName = "FieldLegend"

const FieldLabel = React.forwardRef<React.ElementRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(
    ({ className, ...props }, ref) => {
        return (
            <Label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
        )
    }
)
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => {
        return (
            <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
        )
    }
)
FieldDescription.displayName = "FieldDescription"

const FieldSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("h-px w-full bg-border", className)} {...props} />
        )
    }
)
FieldSeparator.displayName = "FieldSeparator"

export {
    Field,
    FieldGroup,
    FieldSet,
    FieldLegend,
    FieldLabel,
    FieldDescription,
    FieldSeparator,
}
