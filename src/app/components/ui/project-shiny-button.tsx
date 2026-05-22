import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "./utils";

import "./project-shiny-button.css";

type ProjectShinyButtonBaseProps = {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

type ProjectShinyAnchorProps = ProjectShinyButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    href: string;
  };

type ProjectShinyNativeButtonProps = ProjectShinyButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

export type ProjectShinyButtonProps = ProjectShinyAnchorProps | ProjectShinyNativeButtonProps;

export function ProjectShinyButton(props: ProjectShinyButtonProps) {
  const { children, icon, className } = props;

  const content = (
    <span className="project-shiny-button__content">
      <span className="project-shiny-button__label">{children}</span>
      {icon ? <span aria-hidden="true" className="project-shiny-button__icon">{icon}</span> : null}
    </span>
  );

  if ("href" in props && typeof props.href === "string") {
    const { href, children: _children, icon: _icon, className: _className, ...anchorProps } = props;

    return (
      <a href={href} className={cn("project-shiny-button", className)} {...anchorProps}>
        {content}
      </a>
    );
  }

  const {
    type = "button",
    children: _children,
    icon: _icon,
    className: _className,
    ...buttonProps
  } = props;

  return (
    <button type={type} className={cn("project-shiny-button", className)} {...buttonProps}>
      {content}
    </button>
  );
}