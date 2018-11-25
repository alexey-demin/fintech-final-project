import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


// eslint-disable-next-line react/prefer-stateless-function
class ButtonAppBar extends Component {
  render() {
    const { createNew } = this.props;

    return (
      <div className="ButtonAppBar">
        <AppBar position="static">
          <Toolbar>
            <IconButton className="menuButton" color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className="grow" />
            <Button color="inherit" onClick={createNew}>Создать новое дерево</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  createNew: PropTypes.func.isRequired
};

export default ButtonAppBar;
