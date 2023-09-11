import Modal from "./Modal";
import ToggleDarkMode from "./ToggleDarkMode ";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { MdPostAdd } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import Auth from "./Auth";
import { toast } from "sonner";

const ListHeader = ({ getData, listName, authToken, theme, setTheme }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);

  const signOut = () => {
    removeCookie("Email");
    removeCookie("AuthToken");
    setShowModalLogin(false);
    toast.success("Come back soon");
  };

  return (
    <div className="list-header">
      <h1>{listName}</h1>
      <div className="button-container">
        <div className="change-mode">
          <ToggleDarkMode theme={theme} setTheme={setTheme} />
        </div>
        {authToken ? (
          <>
            <button className="create" onClick={() => setShowModal(true)}>
              {" "}
              <MdPostAdd size={"28"} title="ADD NEW Task" />
            </button>
            <button className="signout" onClick={signOut}>
              <FaSignOutAlt size={"28"} title="Sign out" />
            </button>
          </>
        ) : (
          <button className="btn-login" onClick={() => setShowModalLogin(true)}>
            Login
          </button>
        )}
      </div>

      {showModal && (
        <Modal mode={"create"} setShowModal={setShowModal} getData={getData} />
      )}

      {showModalLogin && <Auth setShowModalLogin={setShowModalLogin} />}
    </div>
  );
};

export default ListHeader;
