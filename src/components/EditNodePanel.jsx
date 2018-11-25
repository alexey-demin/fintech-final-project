import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { connect } from 'react-redux';
import { GithubPicker } from 'react-color';
import { changeColorNode, changeCommentNode } from '../actions/nodeAction';

class EditNodePanel extends Component {
  componentDidMount() {
    document.getElementById('editNodeComment').addEventListener('focusout', this.changeCommentNode);
  }

  changeColor = color => {
    const { editNode, onChangeColorNode } = this.props;

    editNode[0].color = color.hex;
    onChangeColorNode(editNode[0]);
  }

  stopEditNode = () => {
    const { onStopEditNode } = this.props;

    onStopEditNode();
  }

  changeCommentNode = () => {
    const { editNode, onChangeCommentNode } = this.props;

    if (editNode[0].comment !== this.inputText) {
      editNode[0].comment = this.inputText.value;
      onChangeCommentNode(editNode[0]);
    }
  }

  render() {
    const { editNode } = this.props;

    return (
      <div className="editNodePanel" align="right">
        <GithubPicker onChangeComplete={this.changeColor} />
        <textarea id="editNodeComment" defaultValue={editNode[0].comment} ref={a => this.inputText = a} />
        <button type="button" onClick={this.stopEditNode}>Закрыть</button>
      </div>
    );
  }
}

EditNodePanel.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  editNode: PropTypes.array.isRequired,
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
