import { assets } from "../../assets/images";
import { useTheme } from "../../contexts/ThemeContext";

function BackgroundImage() {
    const { isDark } = useTheme();
  
  // return (
  //   <div className="min-w-screen min-h-screen bg-primary-light/80 fixed inset-0 -z-1">

  //     {isDark && <img src={assets.bgDark} alt="Bg image" className="w-full h-full" /> }
  //   </div>
  // );

    return (
    <div className="min-w-screen min-h-screen bg-primary-light/80 fixed inset-0 -z-1">

      <img src={isDark ? assets.bgDark : assets.bgLight} alt="Bg image" className="w-full h-full"/>
    </div>
  );
}

export default BackgroundImage;
