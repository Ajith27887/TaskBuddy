import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
// import { LiaClipboardListSolid } from "react-icons/lia";
import { TbClipboardList } from "react-icons/tb";
import "../Login/Login.css";
import backgroundImage from "../Images/d39d91697e2b4152019135fa206392a5.png";
import ellipse from "../Images/Desktop/circles_bg.png";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../AuthContext/AuthContext.tsx";

function Login() {
  const { signin } = useAuth();
  return (
    <Container fluid className="full-screen-container">
      <Row className="login-container">
        <Col className="p-5" lg="5">
          <div className="d-flex  justify-cnotent-center">
            <TbClipboardList
              className="mx-2"
              style={{
                color: "#7B1984",
                fontWeight: "700",
                width: "32px",
                height: "32px",
              }}
            />
            <h2>TaskBuddy</h2>
          </div>
          <div className="w-75 mt-3">
            <p>
              Streamline your workflow and track progress effortlessly with our
              all-in-one task management app.
            </p>
          </div>
          <div>
            <Button
              variant="dark"
              onClick={signin}
              className="p-3 w-50 login-btn"
            >
              {" "}
              <span className="mx-1">
                <FcGoogle />
              </span>
              <span className="mx-1">Continue with Google</span>
            </Button>
          </div>
        </Col>
        <Col lg="7" className="backgroundImage">
          <img src={ellipse} alt="ellipse" className="ellipse" />
          <img className="login-img" alt="bg-img" src={backgroundImage} />
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
