"use client";

import { ExternalLink } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ApplyButtonProps extends ButtonProps {
  linkId?: string;
  url?: string;
  productSlug?: string;
  label: string;
  showIcon?: boolean;
}

/**
 * Outbound affiliate CTA. Fires a non-blocking tracking beacon, then opens the
 * partner link in a new tab with rel="sponsored nofollow noopener".
 */
export function ApplyButton({
  linkId,
  url,
  productSlug,
  label,
  showIcon = true,
  className,
  variant = "accent",
  ...props
}: ApplyButtonProps) {
  function track() {
    if (!linkId) return;
    const payload = JSON.stringify({ linkId, productSlug });
    // sendBeacon survives the navigation to the partner site.
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/affiliate/click", payload);
    } else {
      fetch("/api/affiliate/click", { method: "POST", body: payload, keepalive: true });
    }
  }

  if (!url) {
    return (
      <Button variant={variant} className={className} disabled {...props}>
        {label}
      </Button>
    );
  }

  return (
    <Button asChild variant={variant} className={cn(className)} {...props}>
      <a
        href={url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        onClick={track}
        onAuxClick={track}
      >
        {label}
        {showIcon && <ExternalLink className="h-4 w-4" />}
      </a>
    </Button>
  );
}
