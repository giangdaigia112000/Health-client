import { Spin } from "antd";
import { useEffect } from "react";
function Loading() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="h-screen w-full overflow-hidden fixed top-0 left-0 flex items-center justify-center z-100 bg-[#a7a7a72e]">
      <Spin spinning={true} size="large"></Spin>
    </div>
  );
}

export default Loading;
