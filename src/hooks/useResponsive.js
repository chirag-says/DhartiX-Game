import { useState, useEffect } from "react";
import { UI_CONSTANTS } from "../utils/constants";

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < UI_CONSTANTS.BREAKPOINTS.MOBILE
  );
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= UI_CONSTANTS.BREAKPOINTS.MOBILE &&
      window.innerWidth < UI_CONSTANTS.BREAKPOINTS.TABLET
  );
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= UI_CONSTANTS.BREAKPOINTS.DESKTOP
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });
      setIsMobile(width < UI_CONSTANTS.BREAKPOINTS.MOBILE);
      setIsTablet(
        width >= UI_CONSTANTS.BREAKPOINTS.MOBILE &&
          width < UI_CONSTANTS.BREAKPOINTS.TABLET
      );
      setIsDesktop(width >= UI_CONSTANTS.BREAKPOINTS.DESKTOP);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
  };
};
