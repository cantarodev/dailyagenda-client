import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FaTrashAlt } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [deleted, setDeleted] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") === "dark" ? "system" : "light";
  });
  const [tasks, setTasks] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`
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
    if (authToken || deleted) {
      getData();
    }
  }, [deleted]);

  //Sort by date
  const sortedTasks = tasks?.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="app">
      <Toaster
        theme={theme}
        position="top-right"
        duration={5000}
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
              <p className="user-email">
                Welcome to {userEmail} |{" "}
                <button className="delete-all" onClick={deleteAllItems}>
                  <FaTrashAlt size={"20"} title={"Delete all"} />
                </button>
              </p>

              {tasks.length <= 0 && (
                <p className="message-no-data">No have tasks</p>
              )}

              {sortedTasks?.map((task) => (
                <ListItem key={task.id} task={task} getData={getData} />
              ))}
            </>
          ) : (
            <>
              <p>Soon</p>
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
