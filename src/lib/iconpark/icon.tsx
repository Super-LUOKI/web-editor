import { forwardRef, MouseEventHandler } from "react";

interface IconParkProps {
    icon: string;
    size?: number | string;
    width?: number | string;
    height?: number | string;
    color?: string;
    rtl?: boolean;
    spin?: boolean;
    stroke?: string;
    fill?: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: MouseEventHandler<HTMLElement> | undefined;
}

/**
 * IconPack component
 * @example
 * <IconPark icon="add" size={32} />
 */
export const IconPark = forwardRef<HTMLDivElement, IconParkProps>((props, ref) => {
  const { icon, className, ...rest } = props;
  return <iconpark-icon ref={ref} name={icon} class={className} {...rest}></iconpark-icon>;
});

/**
 * Create an icon component
 * @example
 * const AddIcon = createIconComponent('add', {size: 24});
 */
export function createIconComponent(icon: IconParkProps['icon'], defaultProps: Partial<IconParkProps> = {}) {
  return (props: Omit<IconParkProps, 'icon'>) => {
    return <IconPark icon={icon} {...defaultProps} {...props} />;
  };
}
