import React from 'react';
import Modal from 'react-bootstrap/Modal';

function GlobalModal(props) {
    return (
        <Modal show={props.show} onHide={()=> props.setShow(false)}>
            <Modal.Header closeButton>
                <img src=''/>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.data.data1}
                {props.data.data2}
            </Modal.Body>
            <Modal.Footer>
                {props.footer}
            </Modal.Footer>
        </Modal>
    );
};

export default GlobalModal;