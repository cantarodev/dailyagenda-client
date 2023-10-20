import Header from "./components/Header";
import Item from "./components/Item";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FaTrashAlt } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import "react-datetime/css/react-datetime.css";
import CheckTokenExpiration from "./commons/CheckTokenExpiration";
import todoApi from "./utils/api/modules/todos.api";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const { AuthToken, Email } = cookies;
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("pending");
  const [socket, setSocket] = useState(null);
  const [sendToUser, setSendToUser] = useState("");

  const deleteAllItems = () => {
    toast("Are you sure to delete?", {
      action: {
        label: "Delete All",
        onClick: async () => {
          try {
            const response = await todoApi.deleteAll();
            if (response) {
              toast.success("All tasks deleted successfully");
              setSendToUser("all");
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    });
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    setSendToUser("one");
  };

  function startWebSocket(email) {
    const url = new URL(process.env.REACT_APP_SERVERURL);
    const socket = io(url.origin, {
      secure: true,
      forceNew: false,
      transports: ["polling"],
    });

    socket.on("connect", () => {
      console.log("Connection established with the server");
    });

    socket.on("getListTodos", (data) => {
      setTasks(data);
    });

    socket.on("changeStatusProcess", (data) => {
      data.changeStatus && setSendToUser("all");
    });

    socket.emit("joinUser", email);

    socket.emit("notification", email);

    socket.emit("getTodos", {
      userEmail: email,
      sendToUser: "one",
    });

    setSocket(socket);
  }

  useEffect(() => {
    if (sendToUser && socket && socket.connected && AuthToken) {
      socket.emit("getTodos", {
        userEmail: Email,
        sendToUser: sendToUser,
      });
      setSendToUser("");
    }
  }, [sendToUser]);

  useEffect(() => {
    if (AuthToken) {
      startWebSocket(Email);
    }
  }, []);

  return (
    <div className="app">
      <Toaster
        theme={theme === "dark" ? "system" : "light"}
        position="top-right"
        duration={3000}
        closeButton
      />
      <CheckTokenExpiration />
      <div className="container">
        <>
          <Header
            listName={"Manage your tasks"}
            authToken={AuthToken}
            theme={theme}
            setTheme={setTheme}
            tasks={tasks}
            setTasks={setTasks}
            setSendToUser={setSendToUser}
            startWebSocket={startWebSocket}
          />
          {AuthToken ? (
            <>
              <div className="content-info">
                <select
                  className="status"
                  value={status}
                  onChange={(e) => handleStatus(e)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In progress</option>
                  <option value="complete">Complete</option>
                </select>
                <p className="user-email">
                  Welcome to {Email} |{" "}
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

              {(tasks.length <= 0 ||
                (!Object.values(tasks).some((obj) => obj.status === status) &&
                  status !== "all")) && (
                <p className="message-no-data">No have tasks</p>
              )}

              {tasks?.map(
                (task) =>
                  (status === task.status || status === "all") && (
                    <Item
                      key={task.id}
                      task={task}
                      setSendToUser={setSendToUser}
                    />
                  )
              )}
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
