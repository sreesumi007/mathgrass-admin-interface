import { Fragment, useEffect, useRef, useState } from "react";

import $ from "jquery";
import * as joint from "jointjs";

import * as iden from "../Sources/js/dom-identifiers";
import * as func from "../Sources/ts/GraphFunctions";
import ToolsView from "./ToolsView/ToolsView";

import { useAppDispatch, useAppSelector } from "../../store/config/hooks";
import {
  appCommonSliceRes,
  saveGraphBtn,
  toggleAddHints,
  toggleAddQues,
  passGraphicalHintElemLen,
  passGraphicalHintsOpen,
  passGraphicalHintvalue
} from "../../store/adminAppCommonStates";
import GraphicalHints from "./PopupModal/GraphicalHints";


const GraphEditor = () => {
  const appOperations = useAppSelector(appCommonSliceRes);
  const dispatch = useAppDispatch();
  localStorage.setItem(
    "LinkDirection",
    JSON.stringify(appOperations.linkDirection)
  );
  const arrOfIdBlue: any = [];

  const nameInputRef: any = useRef("");
  let nameAlreadyExists: boolean;
  const canvas: any = useRef(null);

  const [nameExists, setNameExists] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [jsonState, setJsonState] = useState("");
  const [quesModal, setQuesModal] = useState("");
  const [hintsModal, setHintsModal] = useState("");
  const [jsonCall, setJsonCall] = useState(false);

  const [showGraphicalHintAlert, setShowGraphicalHintAlert] = useState(false);
  const [arrayElement, setArrayElement] = useState([]);
  const [hintModalShow,setHintModalShow] = useState(false);
  const [graphicalHintsModal,setGraphicalHintsModal]=useState("");

  const disableSaveGraphBtn = () => {
    dispatch(saveGraphBtn(false));
  };

  function getNameForNode(cellView: any) {
    setShowNameEdit(true);
    const nameValue = nameInputRef.current.value;
    nameAlreadyExists = func.alreadyNameExists(nameValue);
    if (nameAlreadyExists === false) {
      func.giveName(cellView, nameValue);
      setNameExists(false);
    } else {
      setNameExists(true);
    }
  }

  function closeNameEditHandler(event: any) {
    event.preventDefault();
    setShowNameEdit(false);
  }

  const addGraphicalHints = (event:any)=>{
    event.preventDefault();
    console.log("arrray value - "+arrayElement);
    
    if(arrayElement.length>0){
      setHintModalShow(true);
      localStorage.setItem("ElementId",JSON.stringify(arrayElement));
      dispatch(passGraphicalHintElemLen(arrayElement.length));
      setShowGraphicalHintAlert(false);
    }
    else{
      setShowGraphicalHintAlert(true);
    }
}

  // Clear LocalStorage on reload - Starts
  useEffect(() => {
    window.addEventListener("beforeunload", func.clearLocalStorage);

    return () => {
      window.removeEventListener("beforeunload", func.clearLocalStorage);
    };
  }, []);
  // Clear LocalStorage on reload - Ends

  useEffect(() => {
    const graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
    const paper = new joint.dia.Paper({
      el: canvas.current,
      model: graph,
      background: {
        color: "#F8F9FA",
      },
      gridSize: 30,
      // If anything not working please uncomment this and comment the el tag alone and uncomment at the end of the use effect - starts
      height: $("#diagramCanvas").height(),
      width: $("#diagramCanvas").width(),
      // frozen: true,
      // async: true,
      // sorting: joint.dia.Paper.sorting.APPROX,
      // cellViewNamespace: joint.shapes,
      // If anything not working please uncomment this and comment the el tag alone and uncomment at the end of the use effect - Ends
    });

    let contextMenuX = 240;
    let contextMenuY = 30;

    paper.on("blank:contextmenu", function (evt: any, x: any, y: any) {
      let popupCoordinate = paper.localToPagePoint(x, y);
      $("#" + iden.dom_itemdifier_ctxMenu).css({
        top: popupCoordinate.y + "px",
        left: popupCoordinate.x + "px",
      });

      contextMenuX = x;
      contextMenuY = y;

      func.showNewElementContextMenu();
    });

    func.contextMapping(contextMenuX, contextMenuY, graph);

    let linkCreationMode = "nill";
    let sourceCell: any;
    let targetCell: any;

    paper.on({
      "element:contextmenu": onElementRightClick,
    });
    paper.on(
      "cell:pointerclick",
      function (cellView: any, evt: any, x: any, y: any) {
        linkCreationMode = func.linkCreationEnd(
          linkCreationMode,
          targetCell,
          cellView,
          graph,
          sourceCell,
          appOperations.linkDirection
        );
      }
    );
    // Change for link click -- Starts
    paper.on("element:pointerdblclick", (elementView: any) => {
      console.log("Enter into the element DBClick");
      const graphLinks = graph.getLinks();
      for (const link of graphLinks) {
        link.attr("line/stroke", "black");
        // console.log("link item - ",link.attributes.type);
      }
      getNameForNode(elementView);
    });

    paper.on("element:pointerclick", (element: any) => {
      const isGraphicalHint = localStorage.getItem("GraphicalHint");
      const index = arrOfIdBlue.indexOf(element.model.attributes.id);
      if (isGraphicalHint === "true") {
        if (element.model.attributes.attrs.body.stroke === "black") {
          element.model.attr("body/stroke", "blue");
          if (index === -1) {
            arrOfIdBlue.push(element.model.attributes.id);
          } else{
            arrOfIdBlue.splice(index, 1);
          }
        } 
        else{
          if(element.model.attributes.attrs.body.stroke === "blue"){
            arrOfIdBlue.splice(index, 1);
          }
          element.model.attr("body/stroke", "black");
      }
      setArrayElement(arrOfIdBlue);
      }
    });
    paper.on("link:pointerclick", (link: any) => {
      console.log("clicked in the link id - ", link.model.attributes.id);
      console.log("clicked in the link name - ", link.model.attributes.type);
    });
    $("#" + iden.getIdForGraphicalHint).click(() => {
      paper.model.getElements().forEach(function (element) {
        // Check if the element's body stroke is blue
        if (element.attr("body/stroke") === "blue") {
          // If it is, log the element's id to the console
          console.log(
            "Element with id " + element.id + " has a blue body stroke."
          );
          arrOfIdBlue.push(element.id);
        }
      });
      console.log("Elements selected - ", arrOfIdBlue);
    });

    // paper.on("link:pointerdblclick", (linkView) => {
    //   // setLinkClick(elementView.model.isElement());
    //   console.log("Came into the link doubleClick block");
    //   const currentLink = linkView.model;
    //   const elementCheck = graph.getElements();
    //   const linklabel = currentLink.label(0).attrs;
    //   const linkJson = JSON.stringify(linklabel);
    //   for (const elem of elementCheck) {
    //     elem.attr("body/stroke", "black");
    //   }
    //   if (linkJson[17].startsWith("U") === true) {
    //     setShowNameEdit(false);
    //     console.log("came into directed block- ");
    //     currentLink.attr("line/stroke", "orange");
    //     currentLink.label(0, {
    //       attrs: {
    //         text: {
    //           text: "Directed",
    //         },
    //       },
    //     });
    //   } else if (linkJson[17].startsWith("D") === true) {
    //     setShowNameEdit(false);
    //     console.log("came into undirected block- ");
    //     currentLink.attr("line/stroke", "black");
    //     currentLink.label(0, {
    //       attrs: {
    //         text: {
    //           text: "Undirected",
    //         },
    //       },
    //     });
    //   }
    // });
    // Change for link click -- Ends

    // Extra code for Deleting the Links - Starts
    paper.on("link:pointerdblclick", (linkView: any) => {
      console.log("SRK Click called by the element");
      let link = linkView.model;
      console.log("the cid of the thing is like - ", link);
      link.remove();
    });
    // Extra code for Deleting the Links - Ends

    $("#" + iden.SaveGraph).click(() => {
      let json = JSON.stringify(graph.toJSON());
      let questionModal = JSON.parse(
        localStorage.getItem("QuestionModal") || "[]"
      );
      let hintsModal = JSON.parse(localStorage.getItem("HintsModal") || "[]");
      let graphicalHintsModal = JSON.parse(localStorage.getItem("GraphicalHints") || "[]");
      setJsonCall(true);
      setJsonState(json);
      setQuesModal(JSON.stringify(questionModal));
      setHintsModal(JSON.stringify(hintsModal));
      setGraphicalHintsModal(JSON.stringify(graphicalHintsModal));
      setShowNameEdit(false);
      dispatch(saveGraphBtn(false));
      dispatch(passGraphicalHintsOpen(false));
      dispatch(toggleAddQues(false));
      dispatch(toggleAddHints(false));
      graph.clear();
      // localStorage.clear();
    });

    $("#" + iden.ClearGraph).click(() => {
      setJsonCall(false);
      func.onClearGraphCall();
      disableSaveGraphBtn();
      setShowNameEdit(false);
      dispatch(toggleAddQues(false));
      dispatch(toggleAddHints(false));
      dispatch(passGraphicalHintsOpen(false));
      localStorage.clear();
      graph.clear();
    });

    function onElementRightClick(view: any) {
      linkCreationMode = "start";
      sourceCell = func.linkCreationStart(view, linkCreationMode, sourceCell);
    }
    // If anything not working please uncomment this and comment on the paper mentioned - starts
    // const scroller = new ui.PaperScroller({
    //   paper: paper,
    //   autoResizePaper: false,
    //   cursor: "grab",
    // });

    // canvas.current.appendChild(scroller.el);
    // scroller.render().center();
    // paper.unfreeze();

    // return () => {
    //   scroller.remove();
    //   paper.remove();
    // };
    // If anything not working please uncomment this and comment on the paper mentioned - Ends
  }, []);

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <div
            className="col border border-info rounded"
            style={{ height: "700px", fontFamily: "Times New Roman" }}
          >
            <ToolsView />
          </div>
          <div
            className="col-7 border border-info rounded"
            style={{ height: "700px", fontFamily: "Times New Roman" }}
          >
            <header className="d-block p-2 bg-secondary text-white text-center rounded blockquote">
              GRAPH
            </header>

            <button
              id="saveGraphJson"
              className="btn btn-outline-success"
              style={{
                marginRight: "5px",
                float: "right",
                position: "absolute",
                right: "320px",
                bottom: "35px",
              }}
              disabled={!appOperations.saveGraphToggle}
            >
              Save Graph
            </button>
            <button
              id="clearGraphView"
              className="btn btn-outline-danger"
              style={{
                marginRight: "5px",
                float: "right",
                position: "absolute",
                right: "430px",
                bottom: "35px",
              }}
              disabled={!appOperations.saveGraphToggle}
            >
              Clear Graph
            </button>
            <div
              className="canvas"
              id="diagramCanvas"
              style={{ height: "630px" }}
              ref={canvas}
            >
              <div className="hide" id="contextMenu">
                <div className="bg-gradient-primary"></div>
              </div>
            </div>
          </div>
          <div
            className="col border border-info rounded"
            style={{ height: "700px", fontFamily: "Times New Roman" }}
          >
            <header className="d-block p-2 bg-primary text-white text-center rounded blockquote">
              EDIT VIEW
            </header>
            {showNameEdit && (
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title text-center">NODE NAME</h5>
                  <h6 className="card-subtitle mb-2 text-muted text-center">
                    Enter & Double click on the node
                  </h6>
                  <form className="form-inline">
                    <div className="form-group mx-sm-3 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="inputNameGive"
                        ref={nameInputRef}
                        placeholder="Name"
                      />
                      {nameExists && (
                        <span className="text-danger">
                          <i>The Name Already Exists</i>
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-info mb-2"
                      style={{ float: "right" }}
                      onClick={closeNameEditHandler}
                    >
                      Close
                    </button>
                  </form>
                </div>
              </div>
            )}
            <br />
            {appOperations.graphicalHint === true && (
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title text-center">Graphical Hints</h5>
                  <h6 className="card-subtitle mb-2 text-muted text-center">
                    Click the elememt or link
                    <br />
                    <br />
                    {appOperations.graphicalHintValue === "" &&<a href="#" onClick={addGraphicalHints}>Add Hint</a>}
                    <br />
                    {showGraphicalHintAlert===true &&<p className="text-danger"><i>Please click any element or link</i></p>}
                  </h6>
                  {appOperations.graphicalHintValue !== "" && <div className="card-header bg-info text-white rounded">
                  Graphical Hints Added
                  <a
                    href="#"
                    className="fa fa-trash-o"
                    onClick={()=>{dispatch(passGraphicalHintvalue(""))}}
                    style={{ float: "right", fontSize: "28px", color: "red" }}
                  ></a>
                </div>}
                </div>
              </div>
            )}
            <GraphicalHints
              show={hintModalShow}
              onHide={() => {
                setHintModalShow(false);
              }}
            />
            {/* <button className="btn btn-secondary" id="getIdForGraphicalHint">
              Check
            </button> */}
            {jsonCall && (
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title text-center">JSON</h5>
                  <h6 className="card-subtitle mb-2 text-muted text-center">
                    Nodes with Links
                  </h6>
                  <p>{jsonState}</p>
                  <p>{quesModal}</p>
                  <p>{hintsModal}</p>
                  <p>{graphicalHintsModal}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GraphEditor;
