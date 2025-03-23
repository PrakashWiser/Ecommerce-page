import ToastMessage from "@/app/user/components/ToastMessage";

const MainLayout = ({ children }) => {
  return (
    <>
      <ToastMessage /> 
      {children}
    </>
  );
};

export default MainLayout;