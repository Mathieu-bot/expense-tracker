import { assets } from "../../assets/images";

function Logo({ className }: { className?: string }) {
  return (
    <img
      src={assets.logoDark}
      alt="Pennypal"
      className={` object-cover ${className}`}
    />
  );
}

export default Logo;
