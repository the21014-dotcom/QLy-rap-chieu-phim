interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-black uppercase tracking-tighter transition-all active:scale-95 disabled:opacity-50";
  
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-red-700",
    outline: "border-2 border-zinc-700 text-white hover:border-primary hover:text-primary",
    ghost: "text-zinc-400 hover:text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-8 py-3 text-xs",
    lg: "px-10 py-4 text-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}