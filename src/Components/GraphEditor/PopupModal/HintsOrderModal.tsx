import React, { Fragment, useState } from "react";
import { Modal } from "react-bootstrap";
import { appCommonSliceRes } from "../../../store/adminAppCommonStates";
import { textHintSliceArray } from "../../../store/slices/textHintSlice";

import { useAppDispatch, useAppSelector } from "../../../store/config/hooks";

type InputValues = { [key: string]: string };

const HintsOrderModal = (props: any) => {
  const appOperations = useAppSelector(appCommonSliceRes);
  const textHintsArr = useAppSelector(textHintSliceArray);
  const dispatch = useAppDispatch();
  const [inputValues, setInputValues] = useState<InputValues>({});
  const handleInputChange = (event: any) => {
    const { id, value } = event.target;
    setInputValues((prevState: any) => ({
      ...prevState,
      [id]: value,
    }));
    console.log("Values from save - ", inputValues);
  };
  return (
    <Fragment>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            HINTS ORDER
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="text-muted text-center">
            <i> Provide hints order in Number (1,2,3...n)</i>
          </h5>
          <div className="card-deck">
            {appOperations.scriptHintValue !== "" && (
              <>
                <label htmlFor="basic-url" className="form-label">
                  Script Hint
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text text-wrap">
                      {appOperations.scriptHintValue}
                    </span>
                  </div>
                  <input
                    type="number"
                    style={{ maxWidth: "100px" }}
                    placeholder="Your Order"
                    className="form-control form-control-sm"
                  />
                </div>
              </>
            )}
            <br />
            {appOperations.graphicalHintValue !== "" && (
              <>
                <label htmlFor="basic-url" className="form-label">
                  Graphical Hint
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text text-wrap">
                      {appOperations.graphicalHintValue}
                    </span>
                  </div>
                  <input
                    type="number"
                    style={{ maxWidth: "100px" }}
                    placeholder="Your Order"
                    className="form-control form-control-sm"
                  />
                </div>
              </>
            )}
            <br />
            {textHintsArr.textHintValue.length !== 0 && (
              <>
                <label htmlFor="basic-url" className="form-label">
                  Textual Hints
                </label>
                {textHintsArr.textHintValue.map((textHint, index) => (
                  <Fragment key={index}>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text text-wrap">
                          {textHint}
                        </span>
                      </div>
                      <input
                        type="number"
                        style={{ maxWidth: "100px" }}
                        className="form-control form-control-sm"
                        placeholder="Your Order"
                        id={`input-${index}`}
                        value={inputValues[`input-${index}`] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <br />
                  </Fragment>
                ))}
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-primary">Save</button>
          <button className="btn btn-outline-primary" onClick={props.onHide}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default HintsOrderModal;
