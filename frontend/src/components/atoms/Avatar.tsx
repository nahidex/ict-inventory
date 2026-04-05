import React, { useState } from 'react';
import config from '../../utils/config';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-[10px]',
    lg: 'w-12 h-12 text-xs',
    xl: 'w-16 h-16 text-sm',
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '??';

  const getFullUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/backend') ? path.replace('/backend', '') : path;
    const separator = cleanPath.startsWith('/') ? '' : '/';
    return `${config.apiUrl}${separator}${cleanPath}`;
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full border border-outline-variant bg-surface-container-high overflow-hidden shadow-sm shrink-0 flex items-center justify-center relative ${className}`}>
      {src && !error ? (
        <img
          src={getFullUrl(src)}
          key={src} 
          alt={name}
          className="w-full h-full object-cover block"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary-container text-primary font-black uppercase">
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
