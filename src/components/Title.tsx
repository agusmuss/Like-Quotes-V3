export const align = {
  center: "center",
  left: "left",
  right: "right",
} as const;

export type Align = (typeof align)[keyof typeof align];

type TitleProps = {
  label: string;
  align: Align;
};

export function Title({ label, align }: TitleProps) {
  const alignText = () => {
    switch (align) {
      case "center":
        return "text-center";
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      default:
        console.error("No suitable setting is found for", align);
        return "text-center";
    }
  };

  return (
    <h2
      className={`text-2xl font-semibold leading-snug text-slate-900 dark:text-slate-100 ${alignText()}`}
    >
      {label}
    </h2>
  );
}
