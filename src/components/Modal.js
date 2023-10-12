import { useState } from "react";
import { useCookies } from "react-cookie";
import DateTime from "react-datetime";
import moment from "moment";
import { IoIosClose } from "react-icons/io";
import { toast } from "sonner";
import todoApi from "../utils/api/modules/todos.api";

const Modal = ({ mode, setShowModal, setUpdateListTask, task }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const editMode = mode === "edit" ? true : false;

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : "",
    progress: editMode ? task.progress : 0,
    notified: editMode ? task.notified : 0,
    status: editMode ? task.status : "pending",
    date: editMode ? new Date(task.date) : new Date(),
  });

  const handleDateChange = (date) => {
    const formattedDate = date.toDate();
    setData((data) => ({
      ...data,
      date: formattedDate,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: String(value).toUpperCase(),
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const currentDate = new Date();
    editMode
      ? editData()
      : data.date > currentDate
      ? postData()
      : toast.error(`Date and time must be greater than current`);
  };

  const postData = async () => {
    try {
      const { response } = await todoApi.create(data);
      if (response) {
        setShowModal(false);
        setUpdateListTask(true);
        toast.success(`Task created`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editData = async () => {
    try {
      const { response } = await todoApi.update(data, task.id);
      if (response) {
        setShowModal(false);
        setUpdateListTask(true);
        toast.success(`Modififed task`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isValid = (currentDate) => {
    const now = moment();
    return currentDate.isSameOrAfter(now);
  };

  return (
    <div className="overlay" onClick={() => setShowModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-title-container">
          <h3>Let's {mode} your task.</h3>
          <IoIosClose
            className="close-modal"
            onClick={() => setShowModal(false)}
          />
        </div>
        <form onSubmit={handleFormSubmit}>
          <input
            required
            maxLength={30}
            placeholder=" Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <DateTime
            isValidDate={isValid}
            isValidTime={isValid}
            name="date"
            id="date"
            dateFormat="DD/MM/YYYY"
            timeFormat="HH:mm"
            value={data.date}
            onChange={(date) => handleDateChange(date)}
          />
          <br />
          <label htmlFor="range">
            Drag to select your current progress: {data.progress}%
          </label>
          <input
            required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <input className={mode} type="submit" value="Send" />
        </form>
      </div>
    </div>
  );
};

export default Modal;
