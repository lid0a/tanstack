import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

export function ErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error occured while loading data</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
      <Button
        onClick={async () => {
          setIsRetrying(true);
          await router.invalidate();
          setIsRetrying(false);
        }}
        className="w-full"
        disabled={isRetrying}
      >
        Retry
      </Button>
    </div>
  );
}
