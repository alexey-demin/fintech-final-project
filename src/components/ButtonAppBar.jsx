import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from 'react-modal';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';
import { changeThemeSettings } from '../actions/appAction';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true
  }
});

class ButtonAppBar extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      anchorEl: null
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal = () => {
    const { onStopEditNode } = this.props;

    onStopEditNode();

    this.setState({
      anchorEl: null,
      showModal: true
    });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  saveSettings = () => {
    const { onChangeThemeSettings, themeSettings } = this.props;

    onChangeThemeSettings({
      id: themeSettings.id,
      connectionsColor: this.connectionsColorPicker.state.hex,
      nodesColor: this.nodesColorPicker.state.hex,
      backgroundColor: this.backgroundColorPicker.state.hex
    });
  }

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  createAppBar = () => {
    const { createNew } = this.props;
    const { anchorEl } = this.state;

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className="menuButton"
            color="inherit"
            aria-label="Menu"
            onClick={this.openMenu}
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
          >
            <MenuIcon />
          </IconButton>
          <Button color="inherit" onClick={createNew}>Создать новое дерево</Button>
        </Toolbar>
      </AppBar>
    );
  }

  createMenu = () => {
    const { anchorEl } = this.state;

    return (
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.closeMenu}
      >
        <MenuItem onClick={this.openModal}>Настройки темы</MenuItem>
      </Menu>
    );
  }

  createModalWindow = () => {
    const { themeSettings } = this.props;
    const { anchorEl, showModal } = this.state;

    return (
      <Modal
        isOpen={showModal}
        appElement={anchorEl}
        ariaHideApp={false}
      >
        <p>Цвет рёбер:</p>
        <CompactPicker color={themeSettings.connectionsColor} ref={a => this.connectionsColorPicker = a} />
        <p>Цвет новых вершин:</p>
        <CompactPicker color={themeSettings.nodesColor} ref={a => this.nodesColorPicker = a} />
        <p>Цвет фона:</p>
        <CompactPicker color={themeSettings.backgroundColor} ref={a => this.backgroundColorPicker = a} />
        <div>
          <button type="button" onClick={this.closeModal}>Закрыть</button>
          <button type="button" onClick={this.saveSettings}>Применить</button>
        </div>
      </Modal>
    );
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="ButtonAppBar">
          {this.createAppBar()}
          {this.createMenu()}
          {this.createModalWindow()}
        </div>
      </MuiThemeProvider>
    );
  }
}

ButtonAppBar.propTypes = {
  createNew: PropTypes.func.isRequired,
  onChangeThemeSettings: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  themeSettings: PropTypes.object.isRequired,
  onStopEditNode: PropTypes.func.isRequired
};

export default connect(
  state => ({
    themeSettings: state.themeSettings
  }),
  dispatch => ({
    onChangeThemeSettings: settings => {
      dispatch(changeThemeSettings(settings));
    },
    onStopEditNode: () => {
      dispatch({ type: 'STOP_EDIT_NODE' });
    }
  })
)(ButtonAppBar);
