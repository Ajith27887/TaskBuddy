import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import "../TaskList/Sass/TaskListView.scss";
import { supabase } from "../Supabase/Supabase.js";
import { useAuth } from "../AuthContext/AuthContext.tsx";

function TaskListView() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);

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
  }, [currentUser]);

  console.log(tasks, "tasks");

  const renderTasks = (status) => {
    console.log(status, "todo");
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div key={task.id} className="d-flex justify-content-between">
          <h5>{task.title}</h5>
          <p>{task.category}</p>
          <p>{task.created_at}</p>
        </div>
      ));
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
