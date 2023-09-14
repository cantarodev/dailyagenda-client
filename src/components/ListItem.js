import { useEffect, useState } from "react";
import TickIcon from "./TickIcon";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import moment from "moment";
import { toast } from "sonner";

const ListItem = ({ getData, task }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const deleteItem = () => {
    toast("Are you sure to delete?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_SERVERURL}/todos/${task.id}`,
              {
                method: "DELETE",
              }
            );
            if (response.status === 200) {
              toast.success(`Task was deleted`);
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
    deleted && getData();
    setDeleted(false);
  }, [deleted]);

  return (
    <li
      className="list-item"
      title={task.progress >= 100 ? "Task completed" : "Task incomplete"}
    >
      <div className="info-container">
        <TickIcon size={"20"} color={"#FF0000"} progress={task.progress} />
        <p className="task-title">
          {task.title} <br />
          <small>{moment(task.date).format("DD-MM-YYYY HH:mm:ss")}</small>
        </p>
        <ProgressBar progress={task.progress} />
      </div>

      <div className="button-container">
        <button className="edit" onClick={() => setShowModal(true)}>
          <FaEdit size={"20"} title="Edit task" />
        </button>
        <button className="delete" onClick={deleteItem}>
          <FaTrashAlt size={"20"} title="Delete task" />
        </button>
      </div>
      {showModal && (
        <Modal
          mode={"edit"}
          setShowModal={setShowModal}
          getData={getData}
          task={task}
        />
      )}
    </li>
  );
};

export default ListItem;
