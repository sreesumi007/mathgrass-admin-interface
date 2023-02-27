import { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import {appCommonSliceRes,passGraphicalHintvalue} from "../../../store/adminAppCommonStates";
import { useAppDispatch, useAppSelector } from "../../../store/config/hooks";

const GraphicalHints = (props: any) => {
    const appOperations = useAppSelector(appCommonSliceRes);
    const dispatch = useAppDispatch();
    const inputGraphicalHint: any = useRef("");
    const graphicalHintArray: any = [];
    const[showEmptyAlert,setShowEmptyAlert]=useState(false);
    
    const saveGraphicalHints = (event:any)=>{
        event.preventDefault();
        if(inputGraphicalHint.current.value === ""){
            setShowEmptyAlert(true);
        }
        else{
            dispatch(passGraphicalHintvalue(inputGraphicalHint.current.value));
            let graphElemId = JSON.parse(localStorage.getItem("ElementId") || "[]");
            graphicalHintArray.push({
              numberOfElement:appOperations.graphicalElemLen,
              graphicalHint:inputGraphicalHint.current.value,
              elementId:graphElemId
            });
            localStorage.setItem("GraphicalHints",JSON.stringify(graphicalHintArray));
            props.onHide();
        }


    }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">GRAPHICAL HINT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="mb-2 text-muted text-center">Number of Elements/links selected: {appOperations.graphicalElemLen}</h6>
        <br />
        <h5 className="text-center text-muted">Your Hint</h5>
              <div className="input-group mb-3">
                <textarea
                  className="form-control"
                  ref={inputGraphicalHint}
                  placeholder="Your hint goes here"
                  aria-label="Your hint goes here"
                  onChange={()=>{if(showEmptyAlert===true){setShowEmptyAlert(false)}}}
                ></textarea>
              </div>
              <br />
              {showEmptyAlert === true && <p className="text-danger"><i>Please enter the hint or click close</i></p>}
        
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-outline-primary" onClick={saveGraphicalHints}
        >
        Save
        </button>
        <button className="btn btn-outline-primary" onClick={props.onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};
export default GraphicalHints;