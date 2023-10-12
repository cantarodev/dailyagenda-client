import Header from "./components/Header";
import Item from "./components/Item";
import { socket } from "./utils/subscription";
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
  const [updateListTask, setUpdateListTask] = useState(false);

  const getDataSocket = (sendToUser = "one") => {
    socket.emit("getTodos", {
      userEmail: Email,
      sendToUser: sendToUser,
    });
  };

  const deleteAllItems = () => {
    toast("Are you sure to delete?", {
      action: {
        label: "Delete All",
        onClick: async () => {
          try {
            const response = await todoApi.deleteAll();
            if (response) {
              toast.success("All tasks deleted successfully");
              setUpdateListTask(true);
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    });
  };

  useEffect(() => {
    if (AuthToken) {
      socket.emit("subscribeToTasks", Email);
    }
  }, []);

  useEffect(() => {
    if (AuthToken) {
      getDataSocket();
    }
  }, [status]);

  useEffect(() => {
    if (AuthToken) {
      getDataSocket("all");
      setUpdateListTask(false);
    }
  }, [updateListTask]);

  useEffect(() => {
    socket.on("getListTodos", (data) => {
      setTasks(data);
    });
    socket.on("changeStatusProcess", (value) => {
      setUpdateListTask(value);
    });
    socket.on("successfulSubscription", (value) => {
      setUpdateListTask(value);
    });
  }, []);

  return (
    <div className="app">
      <Toaster
        theme={theme === "dark" ? "system" : "light"}
        position="top-right"
        duration={3000}
        closeButton
        richColors
      />
      <CheckTokenExpiration />
      <div className="container">
        <>
          <Header
            listName={"Manage your tasks"}
            getDataSocket={getDataSocket}
            authToken={AuthToken}
            theme={theme}
            setTheme={setTheme}
            tasks={tasks}
            setTasks={setTasks}
            setUpdateListTask={setUpdateListTask}
          />
          {AuthToken ? (
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
                      setUpdateListTask={setUpdateListTask}
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
