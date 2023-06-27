import { Actor, AllActions, Remove, Search, Toggle, Write, Add, TarefaActionsEnum, TarefasState } from "./types";

const updateStorage = (state: TarefasState) => {
   localStorage.setItem("tasks", JSON.stringify(state.tarefas));
}

export const makeInitialTarefaState = (): TarefasState => {

  const tasks = localStorage.getItem("tasks")
  let tasksArray = []
  if (tasks) {
    tasksArray = JSON.parse(tasks)
    tasksArray.map((task: any) => {task.createdAt = new Date(task.createdAt)})
  }

  return{
    tarefas: [...tasksArray],
    error: "",
    name: "",
    search: "",
  }
};

export const removeTask: Actor<Remove> = (state, action) => {
  return {
    ...state,
    tarefas: state.tarefas.filter((tarefa) => tarefa.id !== action.payload.id),
  };
};

export const toggleTask: Actor<Toggle> = (state, action) => {
  const updatedState = {
    ...state,
    tarefas: state.tarefas.map((t) =>
      t.id === action.payload.id ? { ...t, done: !t.done } : t
    ),
  };

  updateStorage(updatedState);

  return updatedState;
};

export const writeTask: Actor<Write> = (state, { payload }) => {

  const hasTaskAlready = state.tarefas.some((t) => t.name === payload.name);

  if (hasTaskAlready) {
    return {
      ...state,
      name: payload.name,
      error: "Nome da tarefa já existe",
    };
  }

  return {
    ...state,
    error: "",
    name: payload.name,
  };
};

export const addTask: Actor<Add> = (state) => {
  if (state.name === "") {
    return {
      ...state,
      error: "Nome da tarefa não pode ser vazio",
    };
  }

  if (state.error) {
    return state;
  }

  const modifiedState = {
    ...state,
    tarefas: [
      ...state.tarefas,
      {
        id: (state.tarefas.length + 1).toString(),
        name: state.name,
        done: false,
        createdAt: new Date(),
      },
    ],
    error: "",
    name: "",
  };

  updateStorage(modifiedState)

  return modifiedState
};

export const searchTask: Actor<Search> = (state, action) => {
  return {
    ...state,
    search: action.payload.search,
  };
};

export const tarefaReducer = (
  state: TarefasState,
  action: AllActions
): TarefasState => {
  switch (action.type) {
    case TarefaActionsEnum.add:
      return addTask(state, action);

    case TarefaActionsEnum.remove:
      return removeTask(state, action);

    case TarefaActionsEnum.toggle:
      return toggleTask(state, action);

    case TarefaActionsEnum.write:
      return writeTask(state, action);

    case TarefaActionsEnum.search:
      return searchTask(state, action);

    default:
      return state;
  }
};
