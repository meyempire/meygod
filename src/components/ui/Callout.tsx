import { AlertTriangle, CheckCircle, Info } from "lucide-react";

type CalloutType = "info" | "warning" | "success" | "danger";

const icons: Record<CalloutType, React.ReactNode> = {
  info: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  danger: <AlertTriangle className="h-5 w-5" />,
};

const styles: Record<CalloutType, string> = {
  info: "border-blue-500 bg-blue-950/30 text-blue-100",
  warning: "border-amber-500 bg-amber-950/30 text-amber-100",
  success: "border-green-500 bg-green-950/30 text-green-100",
  danger: "border-red-500 bg-red-950/30 text-red-100",
};

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
}

export function Callout({ type = "info", children }: CalloutProps) {
  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 not-prose ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5">{icons[type]}</span>
        <div className="[&>p]:m-0">{children}</div>
      </div>
    </div>
  );
}
