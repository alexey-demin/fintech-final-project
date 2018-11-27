import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { connect } from 'react-redux';
import { CompactPicker } from 'react-color';
import { changeColorNode, changeCommentNode } from '../actions/nodeAction';

class EditNodePanel extends Component {
  componentDidMount() {
    document.getElementById('editNodeComment').addEventListener('focusout', this.changeCommentNode);
  }

  changeColor = color => {
    const { editNode, onChangeColorNode } = this.props;

    editNode.color = color.hex;
    onChangeColorNode(editNode);
  }

  stopEditNode = () => {
    const { onStopEditNode } = this.props;

    onStopEditNode();
  }

  changeCommentNode = () => {
    const { editNode, onChangeCommentNode } = this.props;

    if (editNode.comment !== this.inputText) {
      editNode.comment = this.inputText.value;
      onChangeCommentNode(editNode);
    }
  }

  render() {
    const { editNode } = this.props;

    return (
      <div id="editNodePanel">
        <CompactPicker color={editNode.color} onChangeComplete={this.changeColor} />
        <p align="left">Комментарий:</p>
        <textarea id="editNodeComment" defaultValue={editNode.comment} ref={a => this.inputText = a} />
        <button className="closeButton" type="button" onClick={this.stopEditNode}>Закрыть</button>
      </div>
    );
  }
}

EditNodePanel.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  editNode: PropTypes.object.isRequired,
  onChangeColorNode: PropTypes.func.isRequired,
  onStopEditNode: PropTypes.func.isRequired,
  onChangeCommentNode: PropTypes.func.isRequired
};

export default connect(
  state => ({
    editNode: state.editNode
  }),
  dispatch => ({
    onChangeColorNode: node => {
      dispatch(changeColorNode(node));
    },
    onStopEditNode: () => {
      dispatch({ type: 'STOP_EDIT_NODE' });
    },
    onChangeCommentNode: node => {
      dispatch(changeCommentNode(node));
    }
  })
)(EditNodePanel);
