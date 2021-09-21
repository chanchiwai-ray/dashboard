import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Task from "../../components/Task/Task.jsx";
import { selectAuth, selectTasks } from "../app/store";
import { getTasks, putTask } from "../slices/tasks";

export default () => {
  const auth = useSelector(selectAuth);
  const tasks = useSelector(selectTasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getTasks({
        userId: auth.value.userId,
      })
    );
  }, []);

  return tasks.success
    ? tasks.value
        .filter((task) => task.star)
        .sort((x, y) => x.priority < y.priority)
        .map((task) => (
          <Task
            key={task._id}
            content={task}
            onDone={(data) => {
              dispatch(putTask({ id: task._id, userId: auth.value.userId, data: data }));
            }}
            onDelete={() => dispatch(deleteTask({ userId: auth.value.userId, id: task._id }))}
            onCancel={() => null}
          />
        ))
    : tasks.message;
};
