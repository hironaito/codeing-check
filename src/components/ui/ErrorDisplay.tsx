'use client';

import { memo, useCallback } from 'react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Button } from './button';
import { XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ErrorState } from '@/types/error';

interface ErrorDisplayProps {
  error: ErrorState | null;
  errorMessage: string | null;
  isRecoverable: boolean;
  isCritical: boolean;
  onClear?: () => void;
}

export const ErrorDisplay = memo(({
  error,
  errorMessage,
  isRecoverable,
  isCritical,
  onClear,
}: ErrorDisplayProps) => {
  const handleClearError = useCallback(() => {
    onClear?.();
  }, [onClear]);

  if (!error) return null;

  return (
    <Alert variant={isCritical ? "destructive" : "warning"} className="mb-4">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {isCritical ? (
            <XCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <AlertTitle className="text-lg font-semibold">
            {isCritical ? 'エラーが発生しました' : '警告'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm">{errorMessage}</p>
            {isRecoverable && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleClearError}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                再試行
              </Button>
            )}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
});
