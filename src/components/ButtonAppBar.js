import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

class ButtonAppBar extends Component {
  render() {
    return (
      <div className='ButtonAppBar'>
        <AppBar position="static">
          <Toolbar>
            <IconButton className='menuButton' color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className='grow'>
            </Typography>
            <Button color="inherit" onClick={this.props.createNew}>Создать новое дерево</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default ButtonAppBar;