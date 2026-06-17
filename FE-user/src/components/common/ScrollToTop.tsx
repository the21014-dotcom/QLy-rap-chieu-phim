import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên đầu trang một cách mượt mà (smooth) hoặc tức thì (instant)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // CGV thường dùng instant để tránh cảm giác bị trễ
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;