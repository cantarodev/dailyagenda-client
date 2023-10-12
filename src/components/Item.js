import { useState } from "react";
import TickIcon from "../commons/TickIcon";
import Modal from "./Modal";
import ProgressBar from "../commons/ProgressBar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import moment from "moment";
import { toast } from "sonner";
import todoApi from "../utils/api/modules/todos.api";

const ListItem = ({ setUpdateListTask, task }) => {
  const [showModal, setShowModal] = useState(false);

  const deleteItem = () => {
    toast("Are you sure to delete?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const { response } = await todoApi.delete(task.id);
            if (response) {
              toast.success(`Task was deleted`);
              setUpdateListTask(true);
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    });
  };

  return (
    <li
      className="list-item"
      title={task.progress >= 100 ? "Task completed" : "Task incomplete"}
    >
      <div className="info-container">
        <TickIcon size={"20"} color={"#FF0000"} progress={task.progress} />
        <p className="task-title">
          {task.title} <br />
          <small>{moment(task.date).format("DD-MM-YYYY HH:mm:ss A")}</small>
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
          setUpdateListTask={setUpdateListTask}
          task={task}
        />
      )}
    </li>
  );
};

export default ListItem;
