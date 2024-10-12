export default function Loading({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <span className={`loading loading-spinner ${sizeClasses[size]}`} />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
}
