/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { jsPlumb } from 'jsplumb';
import Input from '@material-ui/core/Input';
import Popover from '@material-ui/core/Popover';
import { deleteNode, updatePositionNodeFromDB, changeNode } from '../actions/nodeAction';
import CommentsIcon from '../image/comments.png';
import DescriptionIcon from '../image/description.png';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true
  }
});

class Node extends Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    text: this.props.item.text,
    anchorComments: null,
    anchorDescription: null
  }

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
        paintStyle: { fill: 'white', outlineStroke: 'blue', strokeWidth: 1 },
        hoverPaintStyle: { strokeWidth: 3 },
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

    const leftElementID = `${data.id.toString()}l`;

    jsPlumb.deleteConnectionsForElement(leftElementID);
    jsPlumb.deleteEndpoint(leftElementID);

    const rightElementID = `${data.id.toString()}r`;

    jsPlumb.deleteConnectionsForElement(rightElementID);
    jsPlumb.deleteEndpoint(rightElementID);

    const topElementID = `${data.id.toString()}t`;

    jsPlumb.deleteConnectionsForElement(topElementID);
    jsPlumb.deleteEndpoint(topElementID);

    const bottomElementID = `${data.id.toString()}b`;

    jsPlumb.deleteConnectionsForElement(bottomElementID);
    jsPlumb.deleteEndpoint(bottomElementID);

    onDeleteNode(data.id, connections.filter(x => x.sourceId === leftElementID
      || x.sourceId === rightElementID
      || x.sourceId === topElementID
      || x.sourceId === bottomElementID
      || x.targetId === leftElementID
      || x.targetId === rightElementID
      || x.targetId === topElementID
      || x.targetId === bottomElementID));
  }

  editNode = (e, data) => {
    const { onEditNode } = this.props;

    onEditNode(data.item);
  }

  changeTextNode = () => {
    const { item, onChangeNode } = this.props;
    const { text } = this.state;

    if (item.text !== text) {
      item.text = text;
      onChangeNode(item);
    }
  }

  showDescription = event => {
    const { item } = this.props;
    const { text, anchorComments } = this.state;

    if (item.description.length > 0) {
      this.setState({
        anchorComments,
        text,
        anchorDescription: event.currentTarget
      });
    }
  };

  showComments = event => {
    const { item } = this.props;
    const { text, anchorDescription } = this.state;

    if (item.comments.length > 0) {
      this.setState({
        anchorComments: event.currentTarget,
        text,
        anchorDescription
      });
    }
  };

  handleClose = () => {
    const { text } = this.state;

    this.setState({
      anchorComments: null,
      anchorDescription: null,
      text
    });
  }

  createComment = comment => (
    <div key={comment.date} className="multiline">
      {comment.text}
      <br />
      {'Дата: '}
      {(new Date(comment.date)).toLocaleString()}
    </div>)


  createPopoverComments = () => {
    const { anchorComments } = this.state;
    const { item } = this.props;
    const open = Boolean(anchorComments);

    return (
      <Popover
        id="simple-popper"
        open={open}
        anchorEl={anchorComments}
        onClose={this.handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        {item.comments.map(this.createComment)}
      </Popover>);
  }

  createPopoverDescription = () => {
    const { anchorDescription } = this.state;
    const open = Boolean(anchorDescription);
    const { item } = this.props;

    return (
      <Popover
        id="simple-popper"
        open={open}
        anchorEl={anchorDescription}
        onClose={this.handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <div className="multiline">
          {item.description}
        </div>
      </Popover>);
  }

  render() {
    const { item, style } = this.props;
    const { text } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <ContextMenuTrigger id={item.id.toString()}>
            <div id={item.id.toString()} className="node" style={style} onContextMenu={this.handleOnContextMenu}>
              <Input value={text.toString()} onChange={e => this.setState({ text: e.target.value })} style={{ width: '70%' }} />
              <button type="button" className="nodeButton" onClick={this.showDescription}>
                <img alt="Описание" src={DescriptionIcon} />
              </button>
              <button type="button" className="nodeButton" onClick={this.showComments}>
                <img alt="Комментарии" src={CommentsIcon} />
              </button>
            </div>
          </ContextMenuTrigger>

          <ContextMenu id={item.id.toString()}>
            <MenuItem data={{ id: item.id }} onClick={this.deleteNode}>Удалить</MenuItem>
            <MenuItem data={{ item }} onClick={this.editNode}>Редактировать</MenuItem>
          </ContextMenu>
          {this.createPopoverDescription()}
          {this.createPopoverComments()}
        </div>
      </MuiThemeProvider>
    );
  }
}

Node.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  connections: PropTypes.array.isRequired,
  onChangeNode: PropTypes.func.isRequired,
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
    onChangeNode: node => {
      dispatch(changeNode(node));
    }
  })
)(Node);
