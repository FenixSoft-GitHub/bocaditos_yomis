import { ImSpinner9 } from "react-icons/im";

interface Props {
  size?: number;
  fullScreen?: boolean;
}

export const Loader = ({ size = 40, fullScreen = true }: Props) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen bg-fondo dark:bg-fondo-dark" : "py-12"
      }`}
    >
      <ImSpinner9
        className="animate-spin text-choco dark:text-cream"
        size={size}
      />
    </div>
  );
};
