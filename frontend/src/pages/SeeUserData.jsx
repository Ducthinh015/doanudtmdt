import CloseIcon from "@mui/icons-material/Close";

const SeeUserData = ({ userDivData, userDiv, setUserDiv }) => {
  return (
    <>
      <div
        className={`${userDiv} top-0 left-0 h-screen w-full bg-white/30 opacity-80`}
      ></div>
      <div
        className={`${userDiv} top-0 left-0 h-screen w-full flex items-center justify-center`}
      >
        <div className="bg-green-600 border rounded p-4 w[80%] md:w-[50%] lg:w-[40%]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold uppercase ">
              {" "}
              Thông tin người dùng
            </h1>
            <button onClick={() => setUserDiv("hidden")}>
              <CloseIcon />
            </button>
          </div>
          <div className="mt-2">
            <label htmlFor="">
              Tên đăng nhập :{" "}
              <span className="font-semibold">{userDivData.username}</span>
            </label>
          </div>
          <div className="mt-4">
            <label htmlFor="">
              Email : <span className="font-semibold">{userDivData.email}</span>
            </label>
          </div>
          <div className="mt-4">
            <label htmlFor="">
              Địa chỉ :{" "}
              <span className="font-semibold">{userDivData.address}</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeeUserData;
