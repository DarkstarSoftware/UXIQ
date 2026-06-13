import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'ds-button',
        variant === 'primary' && 'ds-button-primary',
        variant === 'secondary' && 'ds-button-secondary',
        variant === 'danger' && 'ds-button-danger',
        className,
      )}
      {...props}
    />
  );
}
