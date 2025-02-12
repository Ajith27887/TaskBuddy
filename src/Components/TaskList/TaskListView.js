import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { Col, Container, Row, Button, Dropdown, Alert } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import "../TaskList/Sass/TaskListView.scss";
import { supabase } from "../Supabase/Supabase.js";
import { useAuth } from "../AuthContext/AuthContext.tsx";
import { IoIosMore } from "react-icons/io";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { AiOutlineEnter } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";
import { TaskContext } from "../TaskContext/TaskContext.tsx";
import { useDrag, useDrop } from "react-dnd";
import { IoMdClose } from "react-icons/io";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = {
  TASK: "task",
};

const DraggableTask = ({
  task,
  index,
  moveTask,
  handleCheckBox,
  handleInLineStatus,
  currentDate,
  handleDeleteAndEdit,
  handleMouseLeave,
  activeTaskId,
  showOptions,
  handleDelete,
}) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ItemType.TASK,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { type: ItemType.TASK, id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <Row
      ref={ref}
      key={task.id}
      data-id={task.id}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Col
        lg="3"
        className="d-flex align-items-baseline"
        style={{ color: "rgba(0, 0, 0, 0.6)" }}
      >
        <input
          onChange={(e) => handleCheckBox(e.target.checked, task.id)}
          type="checkbox"
        ></input>
        <MdOutlineDragIndicator className="mx-2" style={{ width: "32px" }} />
        <IoIosCheckmarkCircle
          className="mx-2"
          style={{
            color:
              task.status !== "Completed"
                ? "rgba(221, 218, 221, 1)"
                : "rgba(27, 141, 23, 1)",
            fontSize: "20px",
          }}
        />
        <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>
          {task.status === "Completed" ? <s>{task.title}</s> : task.title}
        </p>
      </Col>
      <Col lg="2">
        <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>{task.category}</p>
      </Col>
      <Col lg="2">
        <Dropdown
          onSelect={(eventKey) => handleInLineStatus(task.id, eventKey)}
        >
          <Dropdown.Toggle>{task.status}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="Todo">TODO</Dropdown.Item>
            <Dropdown.Item eventKey="in-progress">In-progress</Dropdown.Item>
            <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
      <Col lg="3" className="text-center">
        <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>
          {task.date === currentDate
            ? "Today"
            : new Date(task.date).toDateString("en-us", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
        </p>
      </Col>
      <Col lg="2" className="position-relative d-flex justify-content-end">
        <div
          onMouseEnter={() => handleDeleteAndEdit(task.id)}
          onMouseLeave={handleMouseLeave}
        >
          <IoIosMore />
          {activeTaskId === task.id && showOptions && (
            <div className="deleteOption p-3 position-absolute">
              <div className="d-flex align-items-center">
                <RiEdit2Fill className="mx-2" /> Edit
              </div>
              <div
                className="d-flex align-items-center mt-2 delete"
                style={{ color: "red" }}
                onClick={() => handleDelete(task.id)}
              >
                <RiDeleteBin5Fill style={{ color: "red" }} className="mx-2" />{" "}
                Delete
              </div>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

function TaskListView() {
  const { currentUser } = useAuth(),
    {
      setTitle,
      allTasks,
      fetchTasks,
      navFilterStatus,
      navFilterDate,
      setTaskStatus,
      taskStatus,
      category,
      title,
      setCategory,
      searchQuery,
      setSelectedDate,
      selectedDate,
      setAllTasks,
    } = useContext(TaskContext),
    [tasks, setTasks] = useState([]),
    [activeTaskId, setActiveTaskId] = useState(null), // Store the active task ID
    [showOptions, setShowOptions] = useState(false),
    // [navDateL, setNavDate] = useState(""),
    [checkBox, setCheckBox] = useState([]),
    d = new Date(),
    currentDate = d.getDate(),
    handleDeleteAndEdit = useCallback(
      (taskId) => {
        setActiveTaskId(taskId === activeTaskId ? null : taskId);
        setShowOptions(true);
      },
      [activeTaskId]
    ),
    handleMouseLeave = () => {
      setShowOptions(false);
    },
    handleDelete = async (taskID) => {
      await supabase.from("todo").delete().eq("id", taskID);
      fetchTasks();
    },
    handleMulitDelete = useCallback(async () => {
      await supabase.from("todo").delete().in("id", checkBox);
      setCheckBox([]);
      fetchTasks();
    }, [checkBox, fetchTasks]),
    handleTitle = (e) => {
      setTitle(e.target.value);
    },
    handleStatusChange = (eventKey) => {
      setTaskStatus(eventKey);
      console.log(eventKey, "status");
    },
    handleCategory = (eventKey) => {
      setCategory(eventKey);
    },
    handleDate = (e) => {
      setSelectedDate(e.target.value);
    },
    handleInLineStatus = async (taskId, eventKey) => {
      console.log(eventKey, taskId, "taskid");

      try {
        const { data, error } = await supabase
          .from("todo")
          .update({ status: eventKey })
          .eq("id", taskId);
        if (error) {
          console.log("Somthing Wrong", error);
        } else {
          console.log("updated", data);
          fetchTasks();
        }
      } catch (err) {
        console.error("Unexpected error");
      }
    },
    handleMulitiStatus = async (eventKey) => {
      try {
        const { data, error } = await supabase
          .from("todo")
          .update({ status: eventKey })
          .in("id", checkBox);
        setCheckBox([]);

        if (error) {
          console.log("Somthing Wrong", error);
        } else {
          console.log("updated", data);
          fetchTasks();
        }
      } catch (err) {
        console.error("Unexpected error");
      }
    },
    handleClose = async () => {
      const newTask = {
        title: title,
        date: selectedDate,
        status: taskStatus,
        category: category,
        user_name: currentUser.displayName,
        user_id: currentUser.email,
        file: "",
      };

      try {
        const { data, error } = await supabase.from("todo").insert([newTask]);
        if (error) {
          console.error("Error inserting task:", error);
        } else {
          <Alert variant="success">
            <Alert.Heading>Task inserted successfully</Alert.Heading>
          </Alert>;
          console.log("Task inserted successfully:", data);
          fetchTasks();
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
      setTitle("");
      setSelectedDate(new Date());
      setTaskStatus("");
      setCategory("");
    };

  useEffect(() => {
    fetchTasks();
  }, [currentUser, fetchTasks]);

  useEffect(() => {
    setTasks(allTasks);
  }, [allTasks]);

  const handleMulitiClose = () => {
    setCheckBox([]);
  };

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);

    // Update the allTasks context
    const updatedAllTasks = Array.from(allTasks);
    const [movedAllTask] = updatedAllTasks.splice(fromIndex, 1);
    updatedAllTasks.splice(toIndex, 0, movedAllTask);
    setAllTasks(updatedAllTasks);
  };

  const renderTasks = (status) => {
    const filteredTasks = tasks.filter((task) => task.status === status);
    const sortedTasks = filteredTasks.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const workCategory = navFilterStatus
      ? sortedTasks.filter((task) => task.category === navFilterStatus)
      : sortedTasks;

    const searchedTasks = searchQuery
      ? workCategory.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : workCategory;

    const dateFilteredTasks = navFilterDate
      ? searchedTasks.filter(
          (task) =>
            new Date(task.date).toDateString() ===
            new Date(navFilterDate).toDateString()
        )
      : searchedTasks;

    const handleCheckBox = (isChecked, taskid) => {
      setCheckBox((prev) => {
        if (isChecked) {
          return [...prev, taskid];
        } else {
          return prev.filter((id) => id !== taskid);
        }
      });
    };

    return (
      <>
        {dateFilteredTasks.map((task, index) => (
          <DraggableTask
            key={task.id}
            task={task}
            index={index}
            moveTask={moveTask}
            handleCheckBox={handleCheckBox}
            handleInLineStatus={handleInLineStatus}
            currentDate={currentDate}
            handleDeleteAndEdit={handleDeleteAndEdit}
            handleMouseLeave={handleMouseLeave}
            activeTaskId={activeTaskId}
            showOptions={showOptions}
            handleDelete={handleDelete}
          />
        ))}
      </>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid className="p-5 position-relative">
        <Row>
          <Col lg="12">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0" className="todo-accordion-item">
                <Accordion.Header className="accordion-header-todo">
                  Todo
                </Accordion.Header>
                <Accordion.Body>
                  <Accordion className="mb-3">
                    <Accordion.Item eventKey="0" className="task-accordion">
                      <Accordion.Header className="task-accordion-header">
                        <FiPlus
                          style={{ color: "rgba(123, 25, 132, 1)" }}
                          className="mx-2"
                        />{" "}
                        Add Task
                      </Accordion.Header>
                      <Accordion.Body>
                        <Container fluid>
                          <Row>
                            <Col lg="4">
                              <input
                                type="text"
                                value={title}
                                onChange={handleTitle}
                                placeholder="Task Title"
                                className="accordion-input p-2 w-100"
                              ></input>
                              <div className="d-flex mx-2">
                                <Button
                                  className="accordion-add mt-3"
                                  onClick={handleClose}
                                >
                                  ADD <AiOutlineEnter className="mx-2" />
                                </Button>
                                <Button className="accordion-cancel p-3 mx-2 mt-3">
                                  Cancel
                                </Button>
                              </div>
                            </Col>
                            <Col
                              className="d-flex justify-content-center align-items-start"
                              lg="2"
                            >
                              <form>
                                <input
                                  type="date"
                                  name="birthday"
                                  onChange={handleDate}
                                  placeholder="ADD Date"
                                  className="accordion-date"
                                />
                              </form>
                            </Col>
                            <Col
                              className="d-flex justify-content-center align-items-start"
                              lg="3"
                            >
                              <Dropdown
                                className="accordion-dropdown"
                                onSelect={handleStatusChange}
                              >
                                <Dropdown.Toggle className="accordion-toggle">
                                  <CiCirclePlus className="large-icon" />{" "}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item eventKey="Todo">
                                    Todo
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="in-progress">
                                    In Progress
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="Completed">
                                    Completed
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>
                            <Col
                              lg="3"
                              className="d-flex justify-content-center align-items-start"
                            >
                              <Dropdown
                                className="accordion-dropdown"
                                onSelect={handleCategory}
                              >
                                <Dropdown.Toggle className="accordion-toggle">
                                  <CiCirclePlus className="large-icon" />{" "}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item eventKey="work">
                                    Work
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="personal">
                                    Personal
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>
                          </Row>
                        </Container>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  {renderTasks("Todo")}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1" className="mt-5">
                <Accordion.Header className="accordion-header-in-progress">
                  In-progress
                </Accordion.Header>
                <Accordion.Body>{renderTasks("in-progress")}</Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2" className="mt-5">
                <Accordion.Header className="accordion-header-completed">
                  Completed
                </Accordion.Header>
                <Accordion.Body>{renderTasks("Completed")}</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        {checkBox && checkBox.length > 0 ? (
          <div className="Muliti d-flex  align-items-center">
            <button className="w-50 mx-3" onClick={handleMulitiClose}>
              {checkBox.length} Tasks Selected <IoMdClose />{" "}
            </button>
            <Dropdown onSelect={(eventKey) => handleMulitiStatus(eventKey)}>
              <Dropdown.Toggle>Status</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Todo">TODO</Dropdown.Item>
                <Dropdown.Item eventKey="in-progress">
                  In-progress
                </Dropdown.Item>
                <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button className="mx-3 w-25" onClick={handleMulitDelete}>
              Delete
            </Button>
          </div>
        ) : (
          <></>
        )}
      </Container>
    </DndProvider>
  );
}

export default TaskListView;
