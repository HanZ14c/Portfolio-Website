import type { ReactNode } from "react";

type InstitutionNameProps = {
  children: ReactNode;
  logo: string;
  compact?: boolean;
};

export function InstitutionName({ children, logo, compact = false }: InstitutionNameProps) {
  return (
    <span className={`institution-name${compact ? " institution-name--compact" : ""}`}>
      <img src={logo} alt="" width="100" height="100" aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}
