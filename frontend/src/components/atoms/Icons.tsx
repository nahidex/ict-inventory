interface MaterialIconProps {
  name: string;
  fill?: boolean;
  size?: number;
  className?: string;
}

export function MaterialIcon({ name, fill = false, size = 24, className = "" }: MaterialIconProps) {
  return (
    <span 
      className={`material-symbols-outlined ${className}`}
      style={{ 
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        fontSize: `${size}px`
      }}
    >
      {name}
    </span>
  );
}

export const Inventory = "inventory_2";
export const PersonCheck = "person_check";
export const Build = "build";
export const PendingActions = "pending_actions";
