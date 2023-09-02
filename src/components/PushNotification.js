// import { useEffect, useState } from 'react';

// const PushNotification = ({tasks}) => {
//   console.log(tasks);
//   const [tasksTemp, setTasksTemp] = useState(tasks);
// console.log(tasksTemp);
//   const subscribeToPushNotifications = () => {
//     Notification.requestPermission().then(permission => {
//       if (permission === 'granted') {
//         console.log('Permiso para enviar notificaciones push concedido');
//       }
//     });
//   }

//   useEffect(() => {
//     setTasksTemp(tasks)
//   })

//   useEffect(() => {
//     const socket = io('http://localhost:8000');

//     socket.on('connect', () => {
//       console.log('Connected to server');
//     });

//     socket.on('task_due', (task) => {
//       console.log(`Task ${task.name} is due on ${task.date}`);
//       setTasks([...tasks, task]);

//       if ('Notification' in window && Notification.permission === 'granted') {
//         new Notification(`${task.name} is due!`, {
//           body: `Due date: ${task.date}`,
//         });
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [tasks]);

//   const sendPushNotification = (title, body, date) => {
//     const now = new Date();
//     const diff = date.getTime() - now.getTime();
//     const delay = Math.max(0, diff);

//     setTimeout(() => {
//       const notification = new Notification(title, { body });
//       notification.onclick = () => {
//         window.focus();
//       };
//       notification.onshow = () => {
//         setTimeout(() => {
//           notification.close();
//         }, 5000);
//       };
//     }, delay);
//   }

//   const handleTaskCompletion = (task) => {
//     setTasksTemp(tasks => tasks.filter(t => t.id !== task.id));
//     sendPushNotification(`Tarea "${task.title}" completada`, '', new Date(task.date));
//   }

//   const Task = ({ task }) => {
//     const [completed, setCompleted] = useState(false);

//     const handleCheckboxChange = (event) => {
//       setCompleted(event.target.checked);
//       if (event.target.checked) {
//         handleTaskCompletion(task);
//       }
//     }

//     return (
//       <div>
//         <input type="checkbox" checked={completed} onChange={handleCheckboxChange} />
//         <span>{task.title}</span>
//         <span>{task.date}</span>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Lista de tareas</h1>
//       <button onClick={subscribeToPushNotifications}>Solicitar permiso para notificaciones push</button>
//       {tasksTemp.map(task => (
//         <Task key={task.id} task={task} />
//       ))}
//     </div>
//   );
// }

// export default PushNotification;