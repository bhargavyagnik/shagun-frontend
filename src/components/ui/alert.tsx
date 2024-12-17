interface AlertProps {
    type: 'error' | 'success' | 'info';
    message: string;
  }
  
  export function Alert({ type, message }: AlertProps) {
    const styles = {
      error: 'bg-red-50 text-red-500 border-red-200',
      success: 'bg-green-50 text-green-500 border-green-200',
      info: 'bg-blue-50 text-blue-500 border-blue-200',
    };
  
    return (
      <div className={`${styles[type]} p-3 rounded-md border mb-4`}>
        {message}
      </div>
  );
}
