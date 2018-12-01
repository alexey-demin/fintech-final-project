import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { connect } from 'react-redux';
import { CompactPicker } from 'react-color';
import { changeNode } from '../actions/nodeAction';

class EditNodePanel extends Component {
  componentDidMount() {
    document.getElementById('editNodeDescription').addEventListener('focusout', this.changeDescriptionNode);
  }

  changeColor = color => {
    const { editNode, onChangeNode } = this.props;

    editNode.color = color.hex;
    onChangeNode(editNode);
  }

  stopEditNode = () => {
    const { onStopEditNode } = this.props;

    onStopEditNode();
  }

  changeDescriptionNode = () => {
    const { editNode, onChangeNode } = this.props;

    if (editNode.description !== this.descriptionTextArea.value) {
      editNode.description = this.descriptionTextArea.value;
      onChangeNode(editNode);
    }
  }

  addComment = () => {
    const { editNode, onChangeNode } = this.props;

    if (this.commentTextArea.value.length !== 0) {
      editNode.comments.push({
        text: this.commentTextArea.value,
        date: Date.now()
      });
      onChangeNode(editNode);
      this.commentTextArea.value = '';
    }
  }

  render() {
    const { editNode } = this.props;

    return (
      <div id="editNodePanel">
        <CompactPicker color={editNode.color} onChangeComplete={this.changeColor} />
        <p align="left">Описание:</p>
        <textarea id="editNodeDescription" className="editNodeTextArea" defaultValue={editNode.description} ref={a => this.descriptionTextArea = a} />
        <p align="left">Комментарий:</p>
        <textarea className="editNodeTextArea" ref={a => this.commentTextArea = a} />
        <button id="addCommentButton" type="button" onClick={this.addComment}>Добавить комментарий</button>
        <button id="closeButton" type="button" onClick={this.stopEditNode}>Закрыть</button>
      </div>
    );
  }
}

EditNodePanel.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  editNode: PropTypes.object.isRequired,
  onChangeNode: PropTypes.func.isRequired,
  onStopEditNode: PropTypes.func.isRequired
};

export default connect(
  state => ({
    editNode: state.editNode
  }),
  dispatch => ({
    onStopEditNode: () => {
      dispatch({ type: 'STOP_EDIT_NODE' });
    },
    onChangeNode: node => {
      dispatch(changeNode(node));
    }
  })
)(EditNodePanel);
