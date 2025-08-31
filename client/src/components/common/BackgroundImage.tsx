import { assets } from "../../assets/images";

function BackgroundImage() {
  return (
    <div className="min-w-screen min-h-screen absolute inset-0 z-1">
      <img src={assets.bgDark} alt="Bg image" className="w-full h-full" />
    </div>
  );
}

export default BackgroundImage;
