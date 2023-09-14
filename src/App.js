import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FaTrashAlt } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import "react-datetime/css/react-datetime.css";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [deleted, setDeleted] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("pending");

  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todos/${userEmail}/${status}`
      );
      const json = await response.json();
      setTasks(json);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllItems = () => {
    toast("Are you sure to delete?", {
      action: {
        label: "Delete All",
        onClick: async () => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_SERVERURL}/todos`,
              {
                method: "DELETE",
              }
            );
            if (response.status === 200) {
              toast.success("All tasks deleted successfully");
              setDeleted(true);
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    });
  };

  useEffect(() => {
    if (authToken || deleted || status) {
      getData();
    }
  }, [deleted, status]);

  return (
    <div className="app">
      <Toaster
        theme={theme === "dark" ? "system" : "light"}
        position="top-right"
        duration={3000}
        closeButton
        richColors
      />

      <div className="container">
        <>
          <ListHeader
            listName={"Manage your tasks"}
            getData={getData}
            authToken={authToken}
            theme={theme}
            setTheme={setTheme}
          />
          {authToken ? (
            <>
              <div className="content-info">
                <select
                  className="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In progress</option>
                  <option value="complete">Complete</option>
                </select>
                <p className="user-email">
                  Welcome to {userEmail} |{" "}
                  <button
                    className="delete-all"
                    onClick={() =>
                      tasks.length ? deleteAllItems() : toast("No have tasks!")
                    }
                  >
                    <FaTrashAlt size={"20"} title={"Delete all"} />
                  </button>
                </p>
              </div>

              {tasks.length <= 0 && (
                <p className="message-no-data">No have tasks</p>
              )}

              {tasks?.map((task) => (
                <ListItem key={task.id} task={task} getData={getData} />
              ))}
            </>
          ) : (
            <>
              <p>The secret to your success is organizing your time.</p>
            </>
          )}
        </>
      </div>
      <p className="copyright">
        &copy; {new Date().getFullYear()}{" "}
        <a href="https://cantaro.dev/" target="_blank" rel="noreferrer">
          CANTARODEV
        </a>
      </p>
    </div>
  );
};

export default App;
