import { Modal, Button, Form } from 'react-bootstrap';
import React, { useState } from'react';

const BookNowModal = ({ show, onHide, onSubmit }) => {
  const [name, setName] = useState('');

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setName('')
    onSubmit(name);
  };

  return (
    <Modal show={show} onHide={() => {
        setName('')
        onHide()
    }}>
      <Modal.Header closeButton>
        <Modal.Title>Book now</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" value={name} onChange={handleNameChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookNowModal;
