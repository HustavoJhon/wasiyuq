import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";

export function Brand() {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center gap-2 font-semibold tracking-tight text-foreground">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
        <PawPrint aria-hidden className="h-4 w-4" />
      </span>
      <span className="hidden sm:inline">WASIYUQ</span>
      <span className="sr-only sm:hidden">WASIYUQ</span>
    </Link>
  );
}

export function AuthLayout({ title, description, children, footer }: { title: string; description?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <Brand />
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-semibold leading-none tracking-tight">{title}</h1>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
      {footer && <div className="text-sm text-muted-foreground">{footer}</div>}
    </main>
  );
}
