import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { jsPlumb } from 'jsplumb';
import Node from './components/Node';
import ButtonAppBar from './components/ButtonAppBar';
import './App.css';
import { addNode } from './actions/nodeAction';
import { addConnection } from './actions/connectionAction';
import { createNewMindMap } from './actions/appAction';
import EditNodePanel from './components/EditNodePanel';
import EditConnectionPanel from './components/EditConnectionPanel';

class App extends Component {
  componentDidMount() {
    jsPlumb.bind('connection', info => {
      const { connections, onAddConnection } = this.props;
      // info.connection.bind("click", (conn) => {
      //   const connection = this.props.connections.find(x => x.sourceId === conn.sourceId && x.targetId === conn.targetId);
      //   this.props.onEditConnection(connection);
      // });
      const endPoints = info.connection.getUuids();

      if (!connections.find(x => x.sourceId.slice(0, -1) === endPoints[0].slice(0, -1)
        && x.targetId.slice(0, -1) === endPoints[1].slice(0, -1))) {
        onAddConnection({ id: Date.now().toString(), sourceId: endPoints[0], targetId: endPoints[1] });
      } else {
        const conn = jsPlumb.getConnections({
          source: endPoints[0].slice(0, -1),
          target: endPoints[1].slice(0, -1)
        });

        if (conn.length > 1) {
          jsPlumb.deleteConnection(conn[conn.length - 1]);
        }
      }
    });
  }

  createNew = () => {
    const { nodes, onCreateNewMindmap } = this.props;

    nodes.forEach(node => {
      jsPlumb.deleteEndpoint(`${node.id.toString()}l`);
      jsPlumb.deleteEndpoint(`${node.id.toString()}r`);
      jsPlumb.deleteEndpoint(`${node.id.toString()}b`);
      jsPlumb.deleteEndpoint(`${node.id.toString()}t`);
    });
    onCreateNewMindmap();
  }

  showEditConnectionPanel() {
    const { editConnection } = this.props;

    if (editConnection.length !== 0) {
      return <EditConnectionPanel />;
    }
  }

  showEditNodePanel() {
    const { editNode } = this.props;

    if (editNode.length !== 0) {
      return <EditNodePanel />;
    }
  }

  createNode(event) {
    const { onCreateNode } = this.props;

    onCreateNode(event.clientX, event.clientY);
  }

  render() {
    const { nodes, connections } = this.props;

    return (
      <div id="mainDiv" onDoubleClick={event => { this.createNode(event); }}>
        <ButtonAppBar createNew={this.createNew} />
        {nodes.map(node => {
          const style = {
            position: 'absolute',
            left: `${node.position.x}px`,
            top: `${node.position.y}px`,
            backgroundColor: node.color
          };

          return <Node key={node.id} item={node} style={style} />;
        })}
        {connections.forEach(connection => {
          if (jsPlumb.getConnections({ source: connection.sourceId.slice(0, -1), target: connection.targetId.slice(0, -1) }).length < 1) {
            jsPlumb.connect({ uuids: [connection.sourceId.toString(), connection.targetId.toString()] });
          }
        })}
        {this.showEditNodePanel()}
        {this.showEditConnectionPanel()}
      </div>
    );
  }
}

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  nodes: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  connections: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  editNode: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  editConnection: PropTypes.array.isRequired,
  onCreateNode: PropTypes.func.isRequired,
  onCreateNewMindmap: PropTypes.func.isRequired,
  onAddConnection: PropTypes.func.isRequired
};

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
    onCreateNode: (x, y) => {
      dispatch(addNode({
        id: Date.now().toString(),
        text: 'text',
        comment: '',
        childIds: [],
        position: { x, y },
        color: '#0693E3'
      }));
    },
    onAddConnection: connection => {
      dispatch(addConnection(connection));
    },
    onEditConnection: connection => {
      dispatch({ type: 'START_EDIT_CONNECTION', connection });
    }
  })
)(App);
