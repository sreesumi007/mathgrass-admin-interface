import { Fragment, useState } from "react";

import circle from "../../Sources/assets/circle.jpg";
import rectangle from "../../Sources/assets/rectangle.jpg";

import { useAppDispatch, useAppSelector } from "../../../store/config/hooks";
import {appCommonSliceRes, toggleAddHints, toggleAddQues, toggleLinkDirection} from "../../../store/adminAppCommonStates";
import { saveGraphBtn } from "../../../store/adminAppCommonStates";

import QuestionModal from "../PopupModal/QuestionModal";
import HintsModal from "../PopupModal/HintsModal";

const ToolsView = () => {
  const appOperations = useAppSelector(appCommonSliceRes);
  const dispatch =  useAppDispatch();
  

  const [modalQuesShow, setQuesModalShow] = useState(false);
  const [modalHintShow, setHintModalShow] = useState(false);
  
  const saveGraphNavigation = () => {
    if (appOperations.saveGraphToggle === false) {
      dispatch(saveGraphBtn(true));
    }
  };
  const deleteQuestionHandler = (event: any) => {
    event.preventDefault();
    dispatch(toggleAddQues(false));
    dispatch(toggleAddHints(false));
  };
  const deleteHintsHandler = (event: any) => {
    event.preventDefault();
    dispatch(toggleAddHints(false));
  };
  const [isDirected, setIsDirected] = useState(false);
  

  const handleToggle = () => {
    setIsDirected(!isDirected);
    dispatch(toggleLinkDirection(!isDirected));
  };
  
return (
    <Fragment>
      <header className="d-block p-2 bg-primary text-white text-center rounded blockquote">
        TOOLS VIEW
      </header>
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title text-center">GRAPH TYPE</h5>
          <h6 className="card-subtitle mb-2 text-muted text-center">Directed/Undirected</h6>
          {/* Toggle button  -- Start*/}
          <div className="form-check form-switch"  style={{marginLeft: "4rem"}}>
            <input
              className="form-check-input"
              type="checkbox"
              id="toggleSwitch"
              checked={isDirected}
              onChange={handleToggle}
            />
            <label className="form-check-label" htmlFor="toggleSwitch">
              {isDirected ? "Directed" : "Undirected"}
            </label>
          </div>
          {/* Toggle button  -- Ends*/}
        </div>
      </div>
      <br />
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title text-center">SHAPES</h5>
          <h6 className="card-subtitle mb-2 text-muted text-center">Basic</h6>
          <img
            className="btn btn-outline-dark"
            id="contextmenu-addRect-trigger"
            src={rectangle}
            alt="rectangle"
            onClick={saveGraphNavigation}
            style={{ width: "100px", height: "40px", marginRight: "20px" }}
          />
          <img
            className="btn btn-outline-dark"
            id="contextmenu-addCircle-trigger"
            src={circle}
            alt="circle"
            onClick={saveGraphNavigation}
            style={{ width: "60px", height: "40px", marginRight: "20px" }}
          />
        </div>
      </div>
      <br />
      {appOperations.saveGraphToggle && (
        <div>
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title text-center">Questions</h5>
              {!appOperations.toggleAddQues && (
                <h6 className="card-subtitle mb-2 text-muted text-center">
                  <a href="#" onClick={() => setQuesModalShow(true)}>
                    Add Ques
                  </a>
                </h6>
              )}
              <QuestionModal
                show={modalQuesShow}
                onHide={() => setQuesModalShow(false)}
              />
              {appOperations.toggleAddQues && (
                <div className="card-header bg-info text-white rounded">
                  Question Added{" "}
                  <a
                    href="#"
                    className="fa fa-trash-o"
                    onClick={deleteQuestionHandler}
                    style={{ float: "right", fontSize: "28px", color: "red" }}
                  ></a>
                </div>
              )}
            </div>
          </div>
          <br />
          {appOperations.toggleAddQues && (
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title text-center">Hints</h5>
                {!appOperations.toggleAddHints && (
                  <h6 className="card-subtitle mb-2 text-muted text-center">
                    <a href="#" onClick={() => setHintModalShow(true)}>
                      Add Hints
                    </a>
                  </h6>
                )}
                <HintsModal
                  show={modalHintShow}
                  onHide={() => setHintModalShow(false)}
                />
                {appOperations.toggleAddHints && (
                  <div className="card-header bg-info text-white rounded">
                    Hints Added{" "}
                    <a
                      href="#"
                      className="fa fa-trash-o"
                      onClick={deleteHintsHandler}
                      style={{ float: "right", fontSize: "28px", color: "red" }}
                    ></a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default ToolsView;
