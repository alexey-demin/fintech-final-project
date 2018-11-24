import React, { Component } from 'react';
import { connect } from 'react-redux';
import Node from './components/Node';
import ButtonAppBar from './components/ButtonAppBar';
import './App.css'
import { addNode } from './actions/nodeAction'
import { addConnection } from './actions/connectionAction'
import { createNewMindMap } from './actions/appAction'
import { jsPlumb } from 'jsplumb'
import EditNodePanel from './components/EditNodePanel';
import EditConnectionPanel from './components/EditConnectionPanel'

class App extends Component {
  createNode(event) {
      this.props.onCreateNode(event.clientX, event.clientY);
  }

  componentDidMount() {
    jsPlumb.bind("connection", (info) => {
      // info.connection.bind("click", (conn) => {
      //   const connection = this.props.connections.find(x => x.sourceId === conn.sourceId && x.targetId === conn.targetId);
      //   this.props.onEditConnection(connection);
      // });
      const endPoints = info.connection.getUuids();
      if (!this.props.connections.find(x => x.sourceId.slice(0, -1) === endPoints[0].slice(0, -1) && x.targetId.slice(0, -1) === endPoints[1].slice(0, -1))) {
        this.props.onAddConnection({id: Date.now().toString(), sourceId: endPoints[0], targetId: endPoints[1]});
      }
      else {
        const conn = jsPlumb.getConnections({
          source: endPoints[0].slice(0, -1),
          target: endPoints[1].slice(0, -1)
        });
        if (conn.length > 1) {
          jsPlumb.deleteConnection(conn[conn.length -1]);
        }
      }
    });
  }

  showEditNodePanel() {
    if (this.props.editNode.length !== 0) {
      return <EditNodePanel/>
    }
  }

  showEditConnectionPanel() {
    if (this.props.editConnection.length !== 0) {
      return <EditConnectionPanel/>
    }
  }

  createNew = () => {
    this.props.nodes.map(node => {
      jsPlumb.deleteEndpoint(node.id.toString() + 'l');
      jsPlumb.deleteEndpoint(node.id.toString() + 'r');
      jsPlumb.deleteEndpoint(node.id.toString() + 'b');
      jsPlumb.deleteEndpoint(node.id.toString() + 't');
    });
    this.props.onCreateNewMindmap();
  }

  render() {
    return (
      <div id="mainDiv" onDoubleClick ={(event) => {this.createNode(event)}}>
        <ButtonAppBar createNew = {this.createNew}/>
          {this.props.nodes.map((node, index) => {
            const style = {
              position: 'absolute',
              left: node.position.x + 'px',
              top: node.position.y + 'px',
              backgroundColor: node.color,
            }
          return <Node key={node.id} item = {node} style={style}></Node>;
          })}
          {this.props.connections.map((connection) => {
            console.log(connection.sourceId);
            if(jsPlumb.getConnections({ source:connection.sourceId.slice(0, -1), target:connection.targetId.slice(0, -1) }).length < 1) {
              jsPlumb.connect({ uuids:[connection.sourceId.toString(), connection.targetId.toString()] });
            }
          })}
          {this.showEditNodePanel()}
          {this.showEditConnectionPanel()}
      </div>
    );
  }
}

export default connect(
  state => ({
    nodes: state.nodes,
    connections: state.connections,
    editNode: state.editNode,
    editConnection: state.editConnection
  }),
  dispatch => ({
    onCreateNewMindmap: () => {
      dispatch(createNewMindMap());
    },
    onCreateNode: (x,y) => {
      dispatch(addNode({
        id: Date.now().toString(),
        text: 'text',
        comment: '',
        childIds: [],
        position: {x: x, y: y},
        color: '#0693E3'
      })
    )},
    onAddConnection: (connection) => {
      dispatch(addConnection(connection));
    },
    onEditConnection: (connection) => {
      dispatch({ type: 'START_EDIT_CONNECTION', connection: connection})
    }
  })
)(App);
