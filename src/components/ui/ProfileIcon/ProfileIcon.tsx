export const ProfileIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor" // color theme inheritance based on text color
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Heads */}
    <circle cx="12" cy="8" r="4" />
    {/* Body */}
    <path d="M12 14c-4.418 0-8 2.582-8 6h16c0-3.418-3.582-6-8-6z" />
  </svg>
);