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
  passGraphicalHintvalue,
  openTextualAndScriptHints,
} from "../../store/adminAppCommonOperations";
import GraphicalHints from "./PopupModal/GraphicalHints";
import { adminAppJSON, setGraphElementId } from "../../store/adminAppJSONFormation";
import {  hintsWithOrder } from "../../store/slices/hintsWithOrderSlice";

const GraphEditor = () => {
  const appOperations = useAppSelector(appCommonSliceRes);
  const adminAppJson = useAppSelector(adminAppJSON);
  const hints = useAppSelector(hintsWithOrder);
  const dispatch = useAppDispatch();

  let selectedElements:any = [];
  localStorage.setItem(
    "LinkDirection",
    JSON.stringify(appOperations.linkDirection)
  );
  let arrOfIdBlue: any = [];

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
  const [hintModalShow, setHintModalShow] = useState(false);
  const [graphicalHintsModal, setGraphicalHintsModal] = useState("");

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

  const addGraphicalHints = (event: any) => {
    event.preventDefault();
    selectedElements.push(arrayElement);
    if (arrayElement.length > 0) {
      setHintModalShow(true);
      dispatch(setGraphElementId(arrayElement));
      dispatch(passGraphicalHintElemLen(arrayElement.length));
      setShowGraphicalHintAlert(false);
    } else {
      setShowGraphicalHintAlert(true);
    }
  };

  // Clear LocalStorage on reload - Starts
  useEffect(() => {
    window.addEventListener("beforeunload", func.clearLocalStorage);

    return () => {
      window.removeEventListener("beforeunload", func.clearLocalStorage);
    };
  }, []);
  // Clear LocalStorage on reload - Ends
  const adminAppJSONFormation = (event: any) => {
    event.preventDefault();
    $("#" + iden.SaveGraph).click();
    console.log("Hints with Order -",hints)
    console.log("Admin App Json -", adminAppJson);
  };

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
    function onElementRightClick(view: any) {
      linkCreationMode = "start";
      sourceCell = func.linkCreationStart(view, linkCreationMode, sourceCell);
    }
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
      }
      getNameForNode(elementView);
    });
    paper.on("element:pointerclick", (element: any) => {
      const isGraphicalHint = localStorage.getItem("GraphicalHint");
      const index = arrOfIdBlue.indexOf(element.model.attributes.id);
      if (isGraphicalHint === "true") {
        if (
          element.model.attributes.attrs.body.stroke === "black" ||
          element.model.attributes.attrs.body.stroke === "#ff8800"
        ) {
          element.model.attr("body/stroke", "blue");
          if (index === -1) {
            arrOfIdBlue.push(element.model.attributes.id);
          } else {
            arrOfIdBlue.splice(index, 1);
          }
        } else {
          if (element.model.attributes.attrs.body.stroke === "blue") {
            arrOfIdBlue.splice(index, 1);
          }
          element.model.attr("body/stroke", "black");
        }
        setArrayElement(arrOfIdBlue);
        selectedElements.push(arrOfIdBlue);
      }
    });

    // Check for the directed to undirected links - starts
    $("#" + iden.graphChange).click(() => {
      console.log("graph change called - ");
      let linkDirection: any = localStorage.getItem("LinkDirection");
      if (linkDirection === "true") {
        convertLinksToDirected();
      } else {
        convertLinksToUndirected();
      }
    });
    function convertLinksToUndirected() {
      console.log("came into convertLinksToUndirected");
      graph.getLinks().forEach((link) => {
        link.attr({
          line: {
            width: 1,
            targetMarker: {
              type: "circle",
              size: 5,
              attrs: {
                fill: "black",
              },
            },
          },
        });
        link.label(0, {
          attrs: {
            text: {
              text: "Undirected",
            },
          },
        });
      });
    }
    function convertLinksToDirected() {
      console.log("came into convertLinksToDirected");
      graph.getLinks().forEach((link) => {
        link.attr({
          line: {
            width: 1,
            targetMarker: {
              type: "path",
              attrs: {
                fill: "black",
              },
            },
          },
        });
        link.label(0, {
          attrs: {
            text: {
              text: "Directed",
            },
          },
        });
      });
    }
    // Check for the directed to undirected links - Ends
    // Extra code for Deleting the Links - Starts
    paper.on("link:pointerdblclick", (linkView: any) => {
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
      let graphicalHintsModal = JSON.parse(
        localStorage.getItem("GraphicalHints") || "[]"
      );
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

    $("#" + iden.closeGraphicalHint).click(() => {
      graph.getElements().forEach((elem) => {
        elem.attr({
          body: {
            stroke: "black",
          },
        });
      });
      setArrayElement([]);
      arrOfIdBlue = [];
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

    // paper.on("link:pointerdblclick", (cellView) => {
    //   console.log("came into link change block");
    //   graph.getLinks()
    //   // Undirected Graph
    //   // cellView.model.attr({
    //   //   line: {
    //   //     width: 1,
    //   //     targetMarker: {
    //   //       type: "circle",
    //   //       size: 5,
    //   //       attrs: {
    //   //         fill: "black",
    //   //       },
    //   //     },
    //   //   },
    //   // });
    //   // DirectedGraph
    //   // cellView.model.attr({
    //   //   line: {
    //   //     width: 1,
    //   //     targetMarker: {
    //   //       type: "path",
    //   //       attrs: {
    //   //         fill: "black",
    //   //       },
    //   //     },
    //   //   },
    //   // });
    // });
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
    return () => console.log("Component unmounted");
  }, []);

  useEffect(() => {
    $("#" + iden.graphChange).click();
    console.log("button triggered");
  }, [appOperations.linkDirection]);

  useEffect(() => {
    $("#" + iden.closeGraphicalHint).click();
    console.log("button triggered");
  }, [appOperations.graphicalHint !== true]);

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
              type="button"
              className="btn btn-success btn-rounded"
              style={{
                marginRight: "5px",
                float: "right",
                position: "absolute",
                right: "320px",
                bottom: "50px",
              }}
              onClick={adminAppJSONFormation}
              disabled={!appOperations.saveGraphToggle}
            >
              Save Graph
            </button>
            <button id="graphChange" style={{ display: "none" }} />
            <button id="closeGraphicalHint" style={{ display: "none" }} />
            <button id="saveGraphJson" style={{ display: "none" }} />
            <button
              id="clearGraphView"
              className="btn btn-danger btn-rounded"
              style={{
                marginRight: "5px",
                float: "right",
                position: "absolute",
                right: "430px",
                bottom: "50px",
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
                    {appOperations.graphicalHintValue === "" && (
                      <>
                        <a href="#" onClick={addGraphicalHints}>
                          Add Hint
                        </a>
                        <br />
                        {showGraphicalHintAlert === true && (
                          <p className="text-danger">
                            <i>Please click any element or link</i>
                          </p>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline-info mb-2"
                          style={{ float: "right" }}
                          onClick={() => {
                            dispatch(passGraphicalHintsOpen(false));
                            dispatch(openTextualAndScriptHints(false));
                          }}
                        >
                          Close
                        </button>
                      </>
                    )}
                  </h6>
                  {appOperations.graphicalHintValue !== "" && (
                    <div className="card-header bg-info text-white rounded">
                      Graphical Hints Added
                      <a
                        href="#"
                        className="fa fa-trash-o"
                        onClick={() => {
                          dispatch(passGraphicalHintvalue(""));
                          dispatch(openTextualAndScriptHints(true));
                        }}
                        style={{
                          float: "right",
                          fontSize: "28px",
                          color: "red",
                        }}
                      ></a>
                    </div>
                  )}
                </div>
              </div>
            )}
            <GraphicalHints
              show={hintModalShow}
              onHide={() => {
                setHintModalShow(false);
              }}
            />
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
