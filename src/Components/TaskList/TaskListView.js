import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function TaskListView() {
  return (
    <Container fluid className="p-5">
      <Row>
        <Col lg="12">
          <b>list view</b>
        </Col>
      </Row>
    </Container>
  );
}

export default TaskListView;
