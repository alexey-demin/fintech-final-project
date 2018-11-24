import React, { Component } from 'react';
import '../App.css'
import { connect } from 'react-redux';
import { GithubPicker  } from 'react-color';
import { changeColorConnection } from '../actions/connectionAction'

class EditNodePanel extends Component {
  changeColor = (color) => {
    this.props.editConnection[0].color = color.hex;
    this.props.onChangeColorConnection(this.props.editNode[0]);
  }

  render() {
    return (
      <div className = "editConnectionPanel" align="left">
        <GithubPicker onChangeComplete={this.changeColor}></GithubPicker>
        <button>Закрыть</button>
      </div>
    );
  }
}

export default connect(
  state => ({
    editConnection: state.editConnection
  }),
  dispatch => ({
      onChangeColorConnection: (connection) => {
        dispatch(changeColorConnection(connection));
      }
  })
)(EditNodePanel);