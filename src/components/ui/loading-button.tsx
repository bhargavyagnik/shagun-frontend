import { Button } from "./button";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: React.ReactNode;
    loadingText?: string;
  }
  
  export function LoadingButton({
    loading,
    children,
    loadingText = 'Loading...',
    ...props
  }: LoadingButtonProps) {
    return (
      <Button {...props} disabled={loading}>
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {loadingText}
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }