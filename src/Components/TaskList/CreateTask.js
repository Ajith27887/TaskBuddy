import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { TaskContext } from "../TaskContext/TaskContext.tsx";
import "./Sass/CreateTask.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { supabase } from "../Supabase/Supabase.js";
import { useAuth } from "../AuthContext/AuthContext.tsx";

function CreateTask() {
  const {
      show,
      setShow,
      setCategory,
      category,
      selectedDate,
      setSelectedDate,
      setTaskStatus,
      setTitle,
      handleChange,
      taskStatus,
      title,
      taskData,
    } = useContext(TaskContext),
    { currentUser } = useAuth();

  const handleClose = async () => {
      const newTask = {
        title: title,
        // Date: selectedDate,
        status: taskStatus,
        category: category,
        user_name: currentUser.displayName,
        user_id: currentUser.email,
      };
      // Upload task data to Supabase
      try {
        const { data, error } = await supabase.from("todo").insert([newTask]);

        if (error) {
          console.error("Error inserting task:", error);
        } else {
          console.log("Task inserted successfully:", data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
      setTitle("");
      setSelectedDate(new Date());
      setTaskStatus("");
      setCategory("");
      setShow(false);
    },
    handleWork = (e) => {
      e.preventDefault();
      setCategory("Work");
    },
    handlePersonal = (e) => {
      e.preventDefault();
      setCategory("personal");
    },
    handleStatusChange = (e) => {
      setTaskStatus(e.target.value);
    },
    handleTitle = (e) => {
      setTitle(e.target.value);
    };

  useEffect(() => {
    console.log(taskData, "data");
  }, [taskData]);
  console.log(show, "show");

  return (
    <>
      <Modal size="lg" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                onChange={handleTitle}
                placeholder="Task title"
                autoFocus
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control required as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className="d-flex justify-content-between">
              <div>
                <p>Task Category*</p>
                <div className="d-flex">
                  <button
                    className={`Category_btn mx-2 btn ${
                      category === "Work" ? "btn-primary" : "btn-light"
                    }`}
                    onClick={handleWork}
                  >
                    Work
                  </button>
                  <button
                    onClick={handlePersonal}
                    className={`Category_btn btn  ${
                      category === "personal" ? "btn-primary" : "btn-light"
                    }`}
                  >
                    Personal
                  </button>
                </div>
              </div>
              <div>
                <p>Due on*</p>
                <div className="date-picker-container  text-center">
                  <DatePicker
                    selected={selectedDate}
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
              <div>
                <p>Task Status*</p>
                <select
                  defaultValue=""
                  onChange={handleStatusChange}
                  className="mx-3 p-3 custom-select Category"
                >
                  <option value="" disabled selected hidden>
                    Choose
                  </option>
                  <option value="Todo">TO-DO</option>
                  <option value="in-progress">In-progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateTask;
