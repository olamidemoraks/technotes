import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { useSelector } from "react-redux";
import usePersist from "../../hooks/usePersist";
import { selectCurrentToken } from "./authSlice";
import { RiseLoader } from "react-spinners";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isSuccess, isError, isLoading, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NOD_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          await refresh();
          setTrueSuccess(true);
        } catch (error) {
          console.error(error);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    //eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    console.log("loading");
    content = <RiseLoader />;
  } else if (isError) {
    console.log("error");
    content = (
      <p className="errmsg">
        {`${error?.data?.messsage} - `}
        <Link to={"/login"}>Please Login again</Link>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
