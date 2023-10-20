import { useCookies } from "react-cookie";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";

const CheckTokenExpiration = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);

  useEffect(() => {
    const expirationCheckInterval = setInterval(async () => {
      const authToken = cookies.AuthToken;
      if (authToken) {
        const decodedToken = jwt_decode(authToken);
        const expirationTimeInSeconds = decodedToken.exp;
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (expirationTimeInSeconds < currentTimestamp) {
          removeCookie("AuthToken");
          removeCookie("Email");
        }
      }
    }, 10000);

    return () => clearInterval(expirationCheckInterval);
  }, [cookies, removeCookie]);

  return null;
};

export default CheckTokenExpiration;
