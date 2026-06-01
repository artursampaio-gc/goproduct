import { type ReactNode, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';

import GoProductLogo from './goproduct_logo.svg';

export const InvenTreeLogoHomeButton = forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <div ref={ref} {...props}>
        <NavLink to={'/'} style={{ display: 'flex', alignItems: 'center' }}>
          <InvenTreeLogo />
        </NavLink>
      </div>
    );
  }
);

/*
 * Render the GoProduct logo
 */
export function InvenTreeLogo(): ReactNode {
  return <img src={GoProductLogo} alt='GoProduct Logo' height={28} />;
}
