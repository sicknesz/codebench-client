import {
    Alert,
    AlertAction,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import { CheckCircle2Icon, InfoIcon, AlertCircleIcon } from "lucide-react"

export type Variant = "destructive" | "default" | undefined
export type AlertType = "success" | "failure" | "info";
export type AlertProps = { type: AlertType, title: string, description: string, variant: Variant };

function getIcon(type: AlertType) {
    switch (type) {
        case 'success':
            return <CheckCircle2Icon />

        case 'failure':
            return <AlertCircleIcon />

        case 'info':
            return <InfoIcon />

        default: return <InfoIcon />
    }
}

function getPrefix(success: boolean) {
    if (success) {
        return "PASS"
    }
    return "FAIL"
}

export function TestResult({ type, title, description, variant, }: AlertProps) {
    return (
        <Alert variant={variant} className={`mx-auto ${type === "success" ? "alert-success" : "alert-failure"}`}>
            {getPrefix(type === "success")}{' '}{getIcon(type)}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {description}
            </AlertDescription>
            {/* <AlertAction>
                <Button size="lg" variant={variant}>
                    Enable
                </Button>
            </AlertAction> */}
        </Alert>
    )
}

