import React, { useState, useCallback, useContext } from "react";
import { Button, Container, Col, Row } from "react-bootstrap";
import { auth } from "../FireBase/Firebase";
import { useNavigate } from "react-router";
import { TbClipboardList } from "react-icons/tb";
import Nav from "react-bootstrap/Nav";
import { BsList } from "react-icons/bs";
import { CiViewBoard } from "react-icons/ci";
import "./Sass/TaskNav.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { useAuth } from "../AuthContext/AuthContext.tsx";
import { BiLogOut } from "react-icons/bi";
import { TaskContext } from "../TaskContext/TaskContext.tsx";

function TaskNav() {
  const navigate = useNavigate(),
    [setSelectedDate] = useState(new Date()),
    { currentUser } = useAuth(),
    { setShow } = useContext(TaskContext);

  const handleShow = useCallback(
    (e) => {
      e.preventDefault();
      setShow(true);
      console.log("popup");
    },
    [setShow]
  );

  const logout = useCallback(() => {
    auth.signOut();
    navigate("/");
  }, [navigate]);

  const { displayName = "", photoURL = "" } = currentUser || {};
  console.log(currentUser, "url");

  return (
    <Container fluid className="p-5 Task-Container">
      <Row>
        <Col lg={6}>
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
          <div className="mt-2 mx-2 d-flex filter-container">
            <p className="filter">Filter by:</p>
            <select defaultValue="" className="mx-3 Category">
              <option value="" disabled selected hidden>
                Category
              </option>
              <option value="Work">Work</option>
              <option value="Work">Personal</option>
            </select>
            <div className="date-picker-container">
              <DatePicker
                // selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Date"
                className="date-picker"
                prevMonthButtonLabel=""
                navPrev={null}
                navNext={null}
              />
            </div>
          </div>
        </Col>
        <Col
          lg={6}
          className="d-flex justify-content-start flex-column align-items-end"
        >
          <div className="d-flex align-items-center">
            {photoURL && (
              <img
                src={photoURL}
                alt="profile"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            )}
            {displayName && <div className="mx-3">{displayName}</div>}
          </div>
          <Button className="logout" onClick={logout}>
            {" "}
            <BiLogOut className="mx-2" style={{ fontSize: "24px" }} />
            Logout
          </Button>
          <div className="d-flex justify-content-start mt-3">
            <input
              type="search"
              className="search mx-3 p-2"
              placeholder="Search"
            ></input>
            <Button onClick={handleShow} className=" p-3 add-task">
              Add Task
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TaskNav;
