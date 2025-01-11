import React from "react";
import { Button, Container, Col, Row } from "react-bootstrap";
import { auth } from "../FireBase/Firebase";
import { useNavigate } from "react-router";
import { TbClipboardList } from "react-icons/tb";
import Nav from "react-bootstrap/Nav";
import { BsList } from "react-icons/bs";
import { CiViewBoard } from "react-icons/ci";
import "./Sass/TaskNav.scss";

function TaskNav() {
  const navigate = useNavigate(),
    logout = () => {
      auth.signOut();
      navigate("/");
    };
  return (
    <Container fluid className="p-5 Task-Container">
      <Row>
        <Col lg="6">
          <div className="d-flex">
            <TbClipboardList
              style={{ width: "32px", height: "32px" }}
              className="mx-2"
            />
            <h3>TaskBuddy</h3>
          </div>
          <div className="mt-4 d-flex  ">
            <Nav.Link href="/list-view" className=" list">
              {" "}
              <BsList
                style={{ width: "24px", height: "24px" }}
                className="mx-2 "
              />{" "}
              List
            </Nav.Link>
            <Nav.Link className="board" href="/board-view">
              <CiViewBoard
                className="mx-2"
                style={{ width: "24px", height: "24px" }}
              />
              Board
            </Nav.Link>
          </div>
          <div className="mt-3 mx-2 d-flex">
            <p className="filter">Filter by:</p>
            <select defaultValue="" className="mx-3 Category p-3">
              <option value="" disabled selected hidden>
                Category
              </option>
              <option value="Work">Work</option>
              <option value="Work">Personal</option>
            </select>

            <select defaultValue="" className="mx-3 Category p-3">
              <option value="" disabled selected hidden>
                Date
              </option>
            </select>
          </div>
        </Col>
        <Col lg="6">
          <Button onClick={logout}> LogOut</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default TaskNav;
