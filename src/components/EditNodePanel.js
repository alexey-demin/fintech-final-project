import React, { Component } from 'react';
import '../App.css'
import { connect } from 'react-redux';
import { GithubPicker  } from 'react-color';
import { changeColorNode, changeCommentNode } from '../actions/nodeAction'

class EditNodePanel extends Component {
  changeColor = (color) => {
    this.props.editNode[0].color = color.hex;
    this.props.onChangeColorNode(this.props.editNode[0]);
  }

  stopEditNode = () => {
    this.props.onStopEditNode();
  }

  componentDidMount() {
    document.getElementById("editNodeComment").addEventListener("focusout", this.changeCommentNode);
  }

  changeCommentNode = () => {
    if (this.props.editNode[0].comment !== this.inputText){
      this.props.editNode[0].comment = this.inputText.value;
      this.props.onChangeCommentNode(this.props.editNode[0]);
    }
  }

  render() {
    return (
      <div className = "editNodePanel" align="right">
        <GithubPicker onChangeComplete={this.changeColor}></GithubPicker>
        <textarea id = "editNodeComment" defaultValue={this.props.editNode[0].comment} ref={(a) => this.inputText = a}></textarea>
        <button onClick={this.stopEditNode}>Закрыть</button>
      </div>
    );
  }
}

export default connect(
  state => ({
    editNode: state.editNode
  }),
  dispatch => ({
      onChangeColorNode: (node) => {
        dispatch(changeColorNode(node));
      },
      onStopEditNode: () => {
        dispatch({ type: 'STOP_EDIT_NODE'});
      },
      onChangeCommentNode: (node) => {
        dispatch(changeCommentNode(node));
      }
  })
)(EditNodePanel);
