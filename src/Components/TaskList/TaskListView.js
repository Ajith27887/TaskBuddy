import React, { useState, useEffect, useCallback } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import "../TaskList/Sass/TaskListView.scss";
import { supabase } from "../Supabase/Supabase.js";
import { useAuth } from "../AuthContext/AuthContext.tsx";
import { IoIosMore } from "react-icons/io";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
// import { Draggable } from "react-drag-reorder";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";

function TaskListView() {
  const { currentUser } = useAuth(),
    [tasks, setTasks] = useState([]),
    // [deleteAndEdit, setDeleteAndEdit] = useState(false),
    [activeTaskId, setActiveTaskId] = useState(null), // Store the active task ID
    [showOptions, setShowOptions] = useState(false),
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
    };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from("todo")
          .select("*")
          .eq("user_id", currentUser.email);

        if (error) {
          console.error("Error fetching tasks:", error);
        } else {
          setTasks(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchTasks();
  }, [currentUser, setTasks, tasks]);

  console.log(tasks, "tasks");

  //   const renderTasks = (status) => {
  //     console.log(status, "todo");
  //     return tasks
  //       .filter((task) => task.status === status)
  //       .map((task) => (
  //         <Row key={task.id}>
  //           <Col lg="3" className="d-flex">
  //             <MdOutlineDragIndicator
  //               className="mx-2"
  //               style={{ width: "32px" }}
  //             />
  //             <h5>{task.title}</h5>
  //           </Col>
  //           <Col lg="3">
  //             <p>{task.category}</p>
  //           </Col>
  //           <Col lg="3">
  //             <p>{task.created_at}</p>
  //           </Col>
  //           <Col lg="3" className="position-relative d-flex justify-content-end">
  //             <div
  //               onMouseEnter={() => handleDeleteAndEdit(task.id)}
  //               onMouseLeave={handleMouseLeave}
  //             >
  //               <IoIosMore />
  //               {activeTaskId === task.id && showOptions && (
  //                 <div
  //                   className="deleteOption p-3 position-absolute"
  //                   //   onClick={() => handleEdit(task.id)}
  //                 >
  //                   <div className="d-flex align-items-center">
  //                     <RiEdit2Fill className="mx-2" /> Edit
  //                   </div>
  //                   <div
  //                     className="d-flex align-items-center mt-2  delete"
  //                     style={{ color: "red" }}
  //                     onClick={() => handleDelete(task.id)}
  //                   >
  //                     <RiDeleteBin5Fill
  //                       style={{ color: "red" }}
  //                       className="mx-2"
  //                     />{" "}
  //                     Delete
  //                   </div>
  //                 </div>
  //               )}
  //             </div>
  //           </Col>
  //         </Row>
  //       ));
  //   };

  const renderTasks = (status) => {
    const filteredTasks = tasks.filter((task) => task.status === status);

    return (
      //   <Draggable>
      filteredTasks.map((task, index) => (
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
            <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>{task.status}</p>
          </Col>
          <Col lg="2">
            <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>{task.created_at}</p>
          </Col>
          <Col lg="3" className="position-relative d-flex justify-content-end">
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
      ))
      //   </Draggable>
    );
  };

  return (
    <Container fluid className="p-5">
      <Row>
        <Col lg="12">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header className="accordion-header-todo">
                Todo
              </Accordion.Header>
              <Accordion.Body>{renderTasks("Todo")}</Accordion.Body>
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
