/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { jsPlumb } from 'jsplumb';
import Node from './components/Node';
import ButtonAppBar from './components/ButtonAppBar';
import './App.css';
import { addNode } from './actions/nodeAction';
import { addConnection, deleteConnection } from './actions/connectionAction';
import { createNewMindMap } from './actions/appAction';
import EditNodePanel from './components/EditNodePanel';

class App extends Component {
  componentDidMount() {
    jsPlumb.bind('connection', info => {
      const { connections, onAddConnection, onDeleteConnection } = this.props;
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

      info.connection.bind('dblclick', conn => {
        const endPointsConn = info.connection.getUuids();
        // eslint-disable-next-line no-shadow
        const { connections } = this.props;

        const connection = connections.find(x => x.sourceId.toString() === endPointsConn[0].toString()
          && x.targetId.toString() === endPointsConn[1].toString());

        onDeleteConnection(connection);
        jsPlumb.deleteConnection(conn);
      });
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

  updateConnections = () => {
    const { connections, themeSettings } = this.props;

    connections.forEach(connection => {
      const connectionsJsPlumb = jsPlumb.getConnections({
        source: connection.sourceId.slice(0, -1),
        target: connection.targetId.slice(0, -1)
      });

      if (connectionsJsPlumb.length < 1) {
        jsPlumb.connect({
          uuids: [connection.sourceId.toString(), connection.targetId.toString()],
          paintStyle: { stroke: themeSettings.connectionsColor, strokeWidth: 2 },
          hoverPaintStyle: { strokeWidth: 4 }
        });
      } else {
        connectionsJsPlumb[0].setPaintStyle({
          stroke: themeSettings.connectionsColor,
          fill: themeSettings.connectionsColor,
          strokeWidth: 2,
          doNotRepaint: true
        });
        connectionsJsPlumb[0].setHoverPaintStyle({
          stroke: themeSettings.connectionsColor,
          fill: themeSettings.connectionsColor,
          strokeWidth: 4,
          doNotRepaint: true
        });
      }
    });
  }

  updateNode = node => {
    const style = {
      position: 'absolute',
      left: `${node.position.x}px`,
      top: `${node.position.y}px`,
      backgroundColor: node.color
    };

    return <Node key={node.id} item={node} style={style} />;
  }

  showEditNodePanel = () => {
    const { editNode } = this.props;

    if (Object.keys(editNode).length !== 0) {
      return <EditNodePanel />;
    }
  }

  createNode = event => {
    const { onCreateNode, themeSettings } = this.props;

    const node = {
      id: Date.now().toString(),
      text: 'text',
      description: '',
      comments: [],
      position: { x: event.clientX, y: event.clientY },
      color: themeSettings.nodesColor
    };

    onCreateNode(node);
  }

  render() {
    const { nodes, themeSettings } = this.props;

    return (
      <div id="mainDiv" style={{ backgroundColor: themeSettings.backgroundColor }} onDoubleClick={event => { this.createNode(event); }}>
        <ButtonAppBar createNew={this.createNew} />
        {nodes.map(node => this.updateNode(node))}
        {this.updateConnections()}
        {this.showEditNodePanel()}
      </div>
    );
  }
}

App.propTypes = {
  nodes: PropTypes.array.isRequired,
  connections: PropTypes.array.isRequired,
  editNode: PropTypes.object.isRequired,
  themeSettings: PropTypes.object.isRequired,
  onCreateNode: PropTypes.func.isRequired,
  onCreateNewMindmap: PropTypes.func.isRequired,
  onAddConnection: PropTypes.func.isRequired,
  onDeleteConnection: PropTypes.func.isRequired
};

export default connect(
  state => ({
    nodes: state.nodes,
    connections: state.connections,
    editNode: state.editNode,
    editConnection: state.editConnection,
    themeSettings: state.themeSettings
  }),
  dispatch => ({
    onCreateNewMindmap: () => {
      dispatch(createNewMindMap());
    },
    onCreateNode: node => {
      dispatch(addNode(node));
    },
    onAddConnection: connection => {
      dispatch(addConnection(connection));
    },
    onDeleteConnection: connection => {
      dispatch(deleteConnection(connection));
    }
  })
)(App);
