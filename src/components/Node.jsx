import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { jsPlumb } from 'jsplumb';
import ReactTooltip from 'react-tooltip';
import Input from '@material-ui/core/Input';
import { deleteNode, updatePositionNodeFromDB, changeTextNode } from '../actions/nodeAction';

class Node extends Component {
  // eslint-disable-next-line react/destructuring-assignment
  state = { text: this.props.item.text }

  componentDidMount() {
    const { item } = this.props;

    this.addDragDrop();
    document.getElementById(item.id.toString()).addEventListener('focusout', this.changeTextNode);
  }

  addDragDrop = () => {
    jsPlumb.ready(() => {
      const { item, onUpdatePosition } = this.props;
      const els = document.querySelectorAll('.wrapper');

      const common = {
        isSource: true,
        isTarget: true,
        connector: 'Flowchart',
        endpoint: 'Rectangle',
        maxConnections: -1,
        paintStyle: { fill: 'white', outlineStroke: 'blue', strokeWidth: 3 },
        hoverPaintStyle: { outlineStroke: 'lightblue' },
        connectorStyle: { outlineStroke: 'green', strokeWidth: 1 },
        connectorHoverStyle: { strokeWidth: 2 },
        dropOptions: {}
      };

      jsPlumb.draggable(item.id.toString(),
        {
          stop: params => {
            item.position = { x: params.finalPos[0], y: params.finalPos[1] };
            onUpdatePosition(item);
          }
        });

      jsPlumb.addEndpoint(item.id.toString(), {
        anchors: 'Left',
        uuid: `${item.id.toString()}l`,
        allowLoopback: false
      }, common);

      jsPlumb.addEndpoint(item.id.toString(), {
        anchors: 'Right',
        uuid: `${item.id.toString()}r`,
        allowLoopback: false
      }, common);
      jsPlumb.addEndpoint(item.id.toString(), {
        anchors: 'Top',
        uuid: `${item.id.toString()}t`,
        allowLoopback: false
      }, common);
      jsPlumb.addEndpoint(item.id.toString(), {
        anchors: 'Bottom',
        uuid: `${item.id.toString()}b`,
        allowLoopback: false
      }, common);

      jsPlumb.draggable(els);
    });
  }

  deleteNode = (e, data) => {
    const { connections, onDeleteNode } = this.props;

    let elementID = `${data.id.toString()}l`;

    jsPlumb.deleteConnectionsForElement(elementID);
    jsPlumb.deleteEndpoint(elementID);
    elementID = `${data.id.toString()}r`;
    jsPlumb.deleteConnectionsForElement(elementID);
    jsPlumb.deleteEndpoint(elementID);
    elementID = `${data.id.toString()}t`;
    jsPlumb.deleteConnectionsForElement(elementID);
    jsPlumb.deleteEndpoint(elementID);
    elementID = `${data.id.toString()}b`;
    jsPlumb.deleteConnectionsForElement(elementID);
    jsPlumb.deleteEndpoint(elementID);
    onDeleteNode(data.id, connections.filter(x => x.sourceId === data.id || x.targetId === data.id));
  }

  editNode = (e, data) => {
    const { onEditNode } = this.props;

    onEditNode(data.item);
  }

  changeTextNode = () => {
    const { item, onChangeTextNode } = this.props;
    const { text } = this.state;

    if (item.text !== text) {
      item.text = text;
      onChangeTextNode(item);
    }
  }

  render() {
    const { item, style } = this.props;
    const { text } = this.state;

    return (
      <div>
        <ReactTooltip />
        <ContextMenuTrigger id={item.id.toString()}>
          <div id={item.id.toString()} className="node" style={style} onContextMenu={this.handleOnContextMenu}>
            <Input value={text.toString()} onChange={e => this.setState({ text: e.target.value })} />
            <button type="button" id="commentButton" data-event="click" data-tip={item.comment}>Комментарий</button>
          </div>
        </ContextMenuTrigger>

        <ContextMenu id={item.id.toString()}>
          <MenuItem data={{ id: item.id }} onClick={this.deleteNode}>Удалить</MenuItem>
          <MenuItem data={{ item }} onClick={this.editNode}>Редактировать</MenuItem>
        </ContextMenu>
      </div>
    );
  }
}

Node.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  item: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  connections: PropTypes.array.isRequired,
  onChangeTextNode: PropTypes.func.isRequired,
  onEditNode: PropTypes.func.isRequired,
  onDeleteNode: PropTypes.func.isRequired,
  onUpdatePosition: PropTypes.func.isRequired
};

export default connect(
  state => ({
    connections: state.connections
  }),
  dispatch => ({
    onUpdatePosition: node => {
      dispatch(updatePositionNodeFromDB(node));
    },
    onDeleteNode: (id, connections) => {
      dispatch(deleteNode(id, connections));
    },
    onEditNode: node => {
      dispatch({ type: 'START_EDIT_NODE', node });
    },
    onChangeTextNode: node => {
      dispatch(changeTextNode(node));
    }
  })
)(Node);
