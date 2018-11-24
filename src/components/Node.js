import React, { Component } from 'react';
import '../App.css'
import { connect } from 'react-redux';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {jsPlumb} from 'jsplumb'
import { deleteNode, updatePositionNodeFromDB, changeTextNode } from '../actions/nodeAction'
import ReactTooltip from 'react-tooltip'
import Input from '@material-ui/core/Input';

class Node extends Component {
  state = { text: this.props.item.text }
  
  addDragDrop = () => {
    jsPlumb.ready(() => {
      const els = document.querySelectorAll(".wrapper");

      const common = {
        isSource: true,
        isTarget: true,
        connector: "Flowchart",
        endpoint: "Rectangle",
        maxConnections: -1,
        paintStyle: { fill: "white", outlineStroke: "blue", strokeWidth: 3 },
        hoverPaintStyle: { outlineStroke: "lightblue" },
        connectorStyle: { outlineStroke: "green", strokeWidth: 1 },
        connectorHoverStyle: { strokeWidth: 2 },
        dropOptions:{}
      };
      
      jsPlumb.draggable(this.props.item.id.toString(), 
      {
        stop: params => {
          this.props.item.position = {x: params.finalPos[0], y: params.finalPos[1]}
          this.props.onUpdatePosition(this.props.item);
        }
      });

      const c = jsPlumb.addEndpoint(this.props.item.id.toString(), {
        anchors: "Left",
        uuid: this.props.item.id.toString() + 'l',
        allowLoopback: false
      }, common);
      console.log(c.getId());
      jsPlumb.addEndpoint(this.props.item.id.toString(), {
        anchors: "Right",
        uuid: this.props.item.id.toString() + 'r',
        allowLoopback: false
      }, common);
      jsPlumb.addEndpoint(this.props.item.id.toString(), {
        anchors: "Top",
        uuid: this.props.item.id.toString() + 't',
        allowLoopback: false
      }, common);
      jsPlumb.addEndpoint(this.props.item.id.toString(), {
        anchors: "Bottom",
        uuid: this.props.item.id.toString() + 'b',
        allowLoopback: false
      }, common);

      jsPlumb.draggable(els);
    });
  }

  componentDidMount(){
    this.addDragDrop();
    document.getElementById(this.props.item.id.toString()).addEventListener("focusout", this.changeTextNode);
  }

  deleteNode = (e, data) => {
    let elementID = data.id.toString()+'l';
    jsPlumb.deleteConnectionsForElement(elementID);
    jsPlumb.deleteEndpoint(elementID);
    elementID = data.id.toString()+'r';
    jsPlumb.deleteConnectionsForElement(elementID);
    jsPlumb.deleteEndpoint(elementID);
    elementID = data.id.toString()+'t';
    jsPlumb.deleteConnectionsForElement(elementID);
    jsPlumb.deleteEndpoint(elementID);
    elementID = data.id.toString()+'b';
    jsPlumb.deleteConnectionsForElement(elementID);
    jsPlumb.deleteEndpoint(elementID);
    this.props.onDeleteNode(data.id, this.props.connections.filter(x => x.sourceId === data.id || x.targetId === data.id));
  }
  
  editNode = (e, data) => {
    this.props.onEditNode(data.item)
  }

  changeTextNode = () => {
    if (this.props.item.text !== this.state.text){
      this.props.item.text = this.state.text;
      this.props.onChangeTextNode(this.props.item);
    }
  }

  render() {
    return (
      <div>
        <ReactTooltip />
        <ContextMenuTrigger id={this.props.item.id.toString()}>
          <div id={this.props.item.id.toString()} className="node" style={this.props.style} onContextMenu={this.handleOnContextMenu}>
            <Input value = {this.state.text.toString()} onChange={e => this.setState({ text: e.target.value })}></Input>
            <button id="commentButton" data-event='click' data-tip={this.props.item.comment}>Комментарий</button>
          </div>
        </ContextMenuTrigger>

        <ContextMenu id={this.props.item.id.toString()}>
          <MenuItem data={{id: this.props.item.id}} onClick={this.deleteNode}>
            Удалить
          </MenuItem>
          <MenuItem data={{item: this.props.item}} onClick={this.editNode}>
            Редактировать
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}

export default connect(
  state => ({
    connections: state.connections
  }),
  dispatch => ({
    onUpdatePosition: (node) => {
      dispatch(updatePositionNodeFromDB(node));
    },
    onDeleteNode: (id, connections) => {
      dispatch(deleteNode(id, connections));
    },
    onEditNode: (node) => {
      dispatch({ type: 'START_EDIT_NODE', node: node});
    },
    onChangeTextNode: (node) => {
      dispatch(changeTextNode(node));
    }
  })
)(Node);
