export const align = {
  center: "center",
  left: "left",
  right: "right",
};

export function Title({ label, align }) {
  const alignText = () => {
    switch (align) {
      case "center":
        return "title-center";
      case "left":
        return "title-left";
      case "right":
        return "title-right";
      default:
        console.error("No suitable setting is found for", align);
        return "title-center";
    }
  };

  return <h2 className={`title ${alignText()}`}>{label}</h2>;
}
