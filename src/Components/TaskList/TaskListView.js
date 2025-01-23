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

function TaskListView() {
  const { currentUser } = useAuth(),
    dateInputRef = useRef(null),
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
      setSelectedDate,
      selectedDate,
    } = useContext(TaskContext),
    [tasks, setTasks] = useState([]),
    // [deleteAndEdit, setDeleteAndEdit] = useState(false),
    [activeTaskId, setActiveTaskId] = useState(null), // Store the active task ID
    [showOptions, setShowOptions] = useState(false),
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
      const response = await supabase.from("todo").delete().eq("id", taskID);
      fetchTasks();
    },
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
      // setShow(false);
    };

  useEffect(() => {
    fetchTasks();
  }, [currentUser, setTasks]);

  const renderTasks = (status) => {
    const filteredTasks = allTasks.filter((task) => task.status === status);
    const sortedTasks = filteredTasks.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    // const workCategory = sortedTasks.filter(
    //   (task) => task.category === navFilterStatus
    // );
    const workCategory = navFilterStatus
      ? sortedTasks.filter((task) => task.category === navFilterStatus)
      : sortedTasks;

    // const tasksWithFormattedDate = workCategory.map((task) => ({
    //   ...task,
    //   formattedDate: new Date(task.date).toLocaleDateString("en-us", {
    //     year: "numeric",
    //     month: "long",
    //     day: "numeric",
    //   }),
    // }));

    // const DateCategory = navFilterDate
    //   ? tasksWithFormattedDate.filter(
    //       (task) => task.formattedDate === navFilterDate
    //     )
    //   : tasksWithFormattedDate;

    return (
      <>
        {workCategory.map((task, index) => (
          <Row key={task.id} data-id={task.id}>
            <Col
              lg="3"
              className="d-flex align-items-baseline"
              style={{ color: "rgba(0, 0, 0, 0.6)" }}
            >
              <input type="checkbox"></input>
              <MdOutlineDragIndicator
                className="mx-2"
                style={{ width: "32px" }}
              />
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
              <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>{task.title}</p>
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
                  <Dropdown.Item eventKey="in-progress">
                    In-progress
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {/* <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>{task.status}</p> */}
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
            <Col
              lg="2"
              className="position-relative d-flex justify-content-end"
            >
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
                      <RiDeleteBin5Fill
                        style={{ color: "red" }}
                        className="mx-2"
                      />{" "}
                      Delete
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        ))}
      </>
    );
  };

  return (
    <Container fluid className="p-5">
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
                                // value={selectedDate}
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
    </Container>
  );
}

export default TaskListView;
