import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { connect } from 'react-redux';
import { GithubPicker } from 'react-color';
import { changeColorConnection } from '../actions/connectionAction';

class EditConnectionPanel extends Component {
  changeColor = color => {
    const { editConnection, onChangeColorConnection } = this.props;

    editConnection[0].color = color.hex;
    onChangeColorConnection(editConnection[0]);
  }

  render() {
    return (
      <div className="editConnectionPanel" align="left">
        <GithubPicker onChangeComplete={this.changeColor} />
        <button type="button">Закрыть</button>
      </div>
    );
  }
}

EditConnectionPanel.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  editConnection: PropTypes.array.isRequired,
  onChangeColorConnection: PropTypes.func.isRequired
};

export default connect(
  state => ({
    editConnection: state.editConnection
  }),
  dispatch => ({
    onChangeColorConnection: connection => {
      dispatch(changeColorConnection(connection));
    }
  })
)(EditConnectionPanel);
