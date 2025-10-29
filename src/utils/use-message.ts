import { useEffect } from "react";
import { toast, type ExternalToast } from "sonner";

export function useMessage(
  type: "error" | "success" | "warning" | "info",
  message?: string | null,
  options?: ExternalToast,
) {
  useEffect(() => {
    if (message) {
      toast[type](message, options);
    }
  }, [message]);
}
