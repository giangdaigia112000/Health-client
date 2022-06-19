import type { NextPage } from "next";
import Head from "next/head";
import { useState, useRef } from "react";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";
import { InputNumber, notification, Modal, Button } from "antd";
import {
  InfoCircleFilled,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import app from "../utils/firebase";
import Loading from "../components/loading";
import { async } from "@firebase/util";
interface user {
  name: string | null;
  uid: string | null;
}
const Home: NextPage = () => {
  console.log("rerender");
  const [info, setInfo] = useState([
    {
      title: "Nồng độ Ure trong máu là gì?",
      content:
        "Urea hay được gọi là ure là sản phẩm cuối cùng của quá trình chuyển hóa chất đạm (hay còn gọi là protein) trong cơ thể và được thận đào thải ra ngoài.Giá trị bình thường của chỉ số ure máu là khoảng 2.5 – 7.5 mmol/l. Ure là chất tương đối ít độc, ngay cả khi lượng ure trong máu cao.",
      click: true,
    },
    {
      title: "Nồng độ Crom trong máu là gì?",
      content:
        "Chromium hay được gọi là crôm có nhiệm vụ hỗ trợ vận chuyển đường huyết (glucose) từ mạch máu đến các tế bào, điều khiển lượng đường trong máu. Cơ thể người trưởng thành chứa trung bình từ 1-5mg crôm, trong máu người bình thường tỷ lệ crôm là 10mcg/l",
      click: true,
    },
    {
      title: "Chỉ số HbA1c là gì?",
      content:
        "HbA1c là mức đường huyết trung bình của bạn trong hai đến ba tháng qua. Nếu HbA1c cao có nghĩa là bạn có quá nhiều đường trong máu. Chỉ số HbA1c bình thường nằm trong khoảng 5 - 5,5%",
      click: true,
    },
    {
      title: "Cholesterol toàn phần là gì?",
      content:
        "Cholesterol toàn phần là lượng cholesterol tổng thể được tìm thấy trong máu của bạn thông qua xét nghiệm sinh hóa máu, kiểm tra sức khỏe với các xét nghiệm công thức máu. Nhỏ hơn 200 mg/dL (5,1 mmol/L): Nồng độ lý tưởng và ít có nguy cơ gây bệnh động mạch vành.",
      click: true,
    },
    {
      title: "Chỉ số Triglyceride là gì?",
      content:
        "Triglyceride là một dạng chất béo mà cơ thể chúng ta vẫn tiêu thụ mỗi ngày. Triglyceride cũng là một trong những thành phần chủ yếu của mỡ động vật, thực vật. Sau khi cơ thể tiêu hóa Triglyceride sẽ được tiêu thụ dưới dạng năng lượng tế bào khi di chuyển trong mạch máu. Chỉ số Triglyceride bình thường: dưới 150 mg/dL (1,7 mmol/L).",
      click: true,
    },
    {
      title: "HDL-Cholesterol là gì?",
      content:
        "HDL-Cholesterol là viết tắt của High Density Lipoprotein Cholesterol nghĩa là cholesterol lipoprotein tỉ trọng cao. Một trong các loại lipoprotein được tổng hợp tại gan và có chức năng vận chuyển cholesterol trong máu. Nồng độ HDL-Cholesterol bình thường trong máu khoảng 40-50 mg/dL (1.0-1.3 mmol/L).",
      click: true,
    },
    {
      title: "LDL-cholesterol là gì?",
      content:
        "LDL-cholesterol còn được gọi là cholesterol xấu hay mỡ xấu, là một loại lipoprotein tỷ trọng thấp gây hại cho cơ thể. Khi LDL tăng lên sẽ tạo thành các mảng bám tích tụ trong thành mạch gây xơ vữa động mạch. Ở người trưởng thành khỏe mạnh, giá trị tối ưu của LDL nên ở mức < 100 mg/dL, tuy nhiên ở mức 100 - 129 mg/dL(2.6 - 3 mmol/L) vẫn là bình thường.",
      click: true,
    },
    {
      title: "VLDL Cholesterol là gì?",
      content:
        "Cholesterol VLDL (lipoprotein mật độ rất thấp) có thể tích tụ làm tắc nghẽn động mạch, được gọi là xơ vữa động mạch. Lượng cholesterol VLDL trong máu có thể giúp bác sĩ đánh giá nguy cơ mắc bệnh tim và đột quỵ của bệnh nhân.Theo Hiệp hội Hóa học Lâm sàng Hoa Kỳ (AACC), mức VLDL bình thường lên đến 30 mg/dl, tương đương với 0,77 mmol/l.",
      click: true,
    },
  ]);
  const [user, setUser] = useState<user>();
  const [logged, setLogged] = useState(false);

  const [gender, setGender] = useState<string>("M");
  const [age, setAge] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [weight, setWeight] = useState<number>();
  const [urea, setUrea] = useState<number>();
  const [cr, setCr] = useState<number>();
  const [hbA1c, setHbA1c] = useState<number>();
  const [chol, setChol] = useState<number>();
  const [tg, setTg] = useState<number>();
  const [hdl, setHdl] = useState<number>();
  const [ldl, setLdl] = useState<number>();
  const [vldl, setVldl] = useState<number>();

  const [resServer, setResServer] = useState<string>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowHistory, setIsShowHistory] = useState(false);

  const [loading, setLoading] = useState(false);
  const listInfo = useRef<any>();
  const handleClickSocial = (provider: any) => {
    signInWithPopup(getAuth(app), provider)
      .then((res) => {
        setUser({
          name: res.user.displayName,
          uid: res.user.uid,
        });
        setLogged(true);
      })
      .catch((err) => console.log(err));
  };
  const handleSetGender = (gender2: string) => {
    if (gender == gender2) return;
    setGender(gender2);
  };
  const handelClickInfo = (index: any) => {
    const checkClick =
      listInfo.current.childNodes[index].childNodes[1].classList.contains(
        "show_content"
      );
    const elementClick = listInfo.current.childNodes[index];
    listInfo.current.childNodes.forEach((element: any) => {
      element.childNodes[1].classList.remove("show_content");
      element.childNodes[0].childNodes[0].classList.remove("title_focus");
      element.childNodes[0].childNodes[1].style.display = "none";
      element.childNodes[0].childNodes[2].style.display = "block";
    });
    if (checkClick) return;
    elementClick.childNodes[1].classList.add("show_content");
    elementClick.childNodes[0].childNodes[0].classList.add("title_focus");
    elementClick.childNodes[0].childNodes[1].style.display = "block";
    elementClick.childNodes[0].childNodes[2].style.display = "none";
  };
  const handleCheckDiabetes = async () => {
    if (
      age &&
      height &&
      weight &&
      urea &&
      cr &&
      hbA1c &&
      chol &&
      tg &&
      hdl &&
      ldl &&
      vldl
    ) {
      setLoading(true);
      try {
        // const response = await axios.post("https://www.facebook.com/");
        const response = {
          data: { result: "Y" },
        };
        setResServer(response.data.result);
        setLoading(false);
        setIsModalVisible(true);
      } catch (error) {
        setLoading(false);
      }
    } else {
      notification["warning"]({
        message: "Cảnh báo nhập dữ liệu",
        description:
          "Bạn phải nhập đầy đủ các dữ liệu để có thể thực hiện việc kiểm tra !!!",
        placement: "bottomLeft",
      });
      return;
    }
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const checkHistory = async () => {
    console.log("okee");
    setIsShowHistory(true);
  };
  return (
    <>
      {!logged && (
        <div className="w-full h-screen bg-[#f7f9fc] overflow-hidden">
          <Head>
            <title>Health App</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className=" w-full h-full  flex items-end justify-between">
            <aside className="float-left">
              <img
                src="https://id.hellobacsi.com/assets/graphics/doctor.svg"
                alt="left"
              />
            </aside>
            <aside className="float-right">
              <img
                src="https://id.hellobacsi.com/assets/graphics/user.svg"
                alt="right"
              />
            </aside>
          </div>
          <main className="w-full h-full absolute top-0 left-0 flex items-center flex-col justify-center z-10">
            <img
              className="w-[50px] h-[50px] mb-5"
              src="/logo.png"
              alt="logo"
            />
            <div className="w-[500px] bg-white rounded-md shadow-lg shadow-indigo-500/40 flex items-center flex-col justify-center">
              <h1 className="font-bold text-lg p-5">
                Kết nối bằng tài khoản mạng xã hội của bạn
              </h1>
              <span className="px-20 text-sm text-center italic text-[#0170d8e6]">
                Nhấn Tiếp tục đồng nghĩa với việc bạn đã chấp nhận cung cấp các
                thông tin cá nhân cho chúng tôi!!!
              </span>
              <button
                className="w-[270px] h-[50px] p-2 rounded-md  border border-indigo-600 flex items-center m-5 justify-center"
                onClick={() => {
                  handleClickSocial(new GoogleAuthProvider());
                }}
              >
                <img
                  className="w-[20px] h-[20px] mr-2"
                  src="/icon-gg.png"
                  alt="icon google"
                />
                <span className="font-medium">Sử dụng tài khoản Google</span>
              </button>
              <button
                className="w-[270px] h-[50px] p-2 rounded-md  border border-indigo-600 flex items-center mb-5 justify-center"
                onClick={() => {
                  handleClickSocial(new FacebookAuthProvider());
                }}
              >
                <img
                  className="w-[20px] h-[20px] mr-2"
                  src="/fb-icon.png"
                  alt="icon facebook"
                />
                <span className="font-medium">Sử dụng tài khoản Facebook</span>
              </button>
            </div>
          </main>
        </div>
      )}
      {logged && (
        <div className="w-full">
          <div className="w-full h-[270px] wrapper relative">
            <img
              className="w-[200px] h-[200px] absolute bottom-0 right-10"
              src="/tieuduong-logo.png"
              alt="tiểu đường logo"
            />
            <div className="absolute w-[1000px] top-[190px] left-1/2 translate-x-[-50%] flex flex-col items-center">
              <img
                className="w-[120px] h-[120px] rounded-full "
                src="/tieuduong.png"
                alt="tiểu đường"
              />
              <span className="border border-[#2e2e2e29] p-5 mt-1 ">
                Bệnh tiểu đường là nhóm bệnh chuyển hóa gây ảnh hưởng đến khả
                năng sản sinh hoặc sử dụng insulin của cơ thể, hormone giúp
                chuyển hóa glucose thành năng lượng. Tiểu đường có thể gây ra
                các biến chứng nghiêm trọng về tim mạch, thận hoặc đột quỵ đối
                với người bệnh.
              </span>
              <Button
                type="link"
                onClick={() => {
                  checkHistory();
                }}
              >
                Lịch sử kiểm tra của bạn
              </Button>
            </div>
            <h1 className="text-white font-bold	text-6xl px-5 pt-10">
              Kiểm tra Tiểu đường
            </h1>
            <h2 className="text-white font-bold px-5 pt-2">
              Xin chào {user?.name?.toUpperCase()} vui lòng nhập các thông tin
              bên dưới để kiểm tra xem bạn có đang bị tiểu đường hay không?
            </h2>
          </div>
          <div className="w-[1100px] h-[2000px] relative m-auto mt-[150px] p-5 flex justify-between">
            <div className="w-[500px]">
              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  Giới tính của bạn
                </h2>
                <div className="flex mt-1">
                  <div
                    className={`${
                      gender == "M" ? "active_gender" : ""
                    } w-[150px] mr-3 py-2 flex flex-col justify-center items-center rounded-lg drop-shadow-md cursor-pointer`}
                    onClick={() => {
                      handleSetGender("M");
                    }}
                  >
                    <img
                      src="https://hellobacsi.com/images/maleIcon.svg"
                      alt="male"
                    />
                    <span className={`text-sm	font-semibold	 text-lg`}>Nam</span>
                  </div>
                  <div
                    className={`${
                      gender == "F" ? "active_gender" : ""
                    } w-[150px] py-2 flex flex-col justify-center items-center rounded-lg drop-shadow-md cursor-pointer`}
                    onClick={() => {
                      handleSetGender("F");
                    }}
                  >
                    <img
                      src="https://hellobacsi.com/images/femaleIcon.svg"
                      alt="male"
                    />
                    <span className={`text-sm	font-semibold text-lg `}>Nữ</span>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Bạn bao nhiêu tuổi? (năm)
                </h2>
                <InputNumber
                  min={21}
                  max={81}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setAge(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Bạn cao bao nhiêu? (cm)
                </h2>
                <InputNumber
                  min={50}
                  max={210}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setHeight(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Cân nặng của bạn (kg)
                </h2>
                <InputNumber
                  min={30}
                  max={120}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setWeight(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Nồng độ Ure trong máu (mmol/l)
                </h2>
                <InputNumber
                  min={0}
                  max={40}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setUrea(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Nồng độ Crom trong máu (mmol/l)
                </h2>
                <InputNumber
                  min={0}
                  max={1000}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setCr(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Chỉ số HbA1c (%)
                </h2>
                <InputNumber
                  min={0}
                  max={20}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setHbA1c(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Nồng độ Cholesterol toàn phần (mmol/l)
                </h2>
                <InputNumber
                  min={0}
                  max={12}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setChol(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Chỉ số Triglyceride (mmol/l)
                </h2>
                <InputNumber
                  min={0}
                  max={15}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setTg(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Nồng độ HDL-Cholesterol (mmol/l)
                </h2>
                <InputNumber
                  min={0}
                  max={10}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setHdl(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Nồng độ LDL-cholesterol (mmol/l)
                </h2>
                <InputNumber
                  min={0}
                  max={10}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setLdl(value);
                  }}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Nồng độ VLDL Cholesterol (mmol/l)
                </h2>
                <InputNumber
                  min={0}
                  max={40}
                  size="large"
                  style={{ width: "100%", borderRadius: "5px" }}
                  onChange={(value: number) => {
                    setVldl(value);
                  }}
                />
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  className="bg-sky-500 w-[200px] h-[40px] rounded text-white text-sm font-semibold"
                  onClick={() => {
                    handleCheckDiabetes();
                  }}
                >
                  Kiểm tra ngay
                </button>
              </div>
            </div>
            <div className="w-[550px] h-[600px] mt-5 sticky top-[50px] left-0">
              <div className="flex items-center mb-2">
                <InfoCircleFilled style={{ color: "blue" }} />
                <h2 className="text-sm font-semibold text-slate-700 m-0 ml-1">
                  Thông tin
                </h2>
              </div>
              <div ref={listInfo} className="w-full pl-5">
                {info.map((item, index) => {
                  return (
                    <div key={index} className="w-full pt-1">
                      <div
                        className="flex cursor-pointer justify-between"
                        onClick={() => {
                          handelClickInfo(index);
                        }}
                      >
                        <h2
                          className={`text-slate-700 text-sm font-normal w-[400px]`}
                        >
                          {item.title}
                        </h2>

                        <MinusOutlined style={{ paddingTop: "2px" }} />
                        <PlusOutlined />
                      </div>
                      <div
                        className={`w-full rounded-md bg-slate-200 overflow-hidden h-0`}
                        style={{
                          transition: "height 0.4s ease 0s",
                        }}
                      >
                        <div className="w-full p-3">{item.content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && <Loading />}
      <Modal
        title="Kết quả do máy tính dự đoán"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <img
          className="w-full h-[300px] object-cover"
          src="yes.png"
          alt="Bạn có nguy cơ cao bị tiểu đường"
        />
        <div className="w-full text-center">
          <h2 className="text-xl  font-bold	 text-[#f9f8f8] bg-[#f51313] py-1 rounded">
            Bạn có nguy cơ rất cao bị bệnh tiểu đường !!!.
          </h2>
        </div>
      </Modal>
      <Modal
        title="Lịch sử kiểm tra của bạn"
        visible={isShowHistory}
        onOk={() => {
          setIsShowHistory(false);
        }}
        onCancel={() => {
          setIsShowHistory(false);
        }}
        width={1000}
      >
        <div className="w-full text-center">
          <h2 className="text-xl  font-bold	 text-[#f9f8f8] bg-[#f51313] py-1 rounded">
            Bạn có nguy cơ rất cao bị bệnh tiểu đường !!!.
          </h2>
        </div>
      </Modal>
    </>
  );
};

export default Home;
