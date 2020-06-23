import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryMusicOutlinedIcon from '@material-ui/icons/LibraryMusicOutlined';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import InputBase from '@material-ui/core/InputBase';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import { managerOpen, localMode, addSongs } from '../actions';
import Snackbar from './Snackbar';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  rootPaper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 100,
  },
  inputhere: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const mapStateToProps = (state) => ({
  manager: state.stuffle.manager,
  localMode: state.stuffle.localMode,
});

const mapDispatchToProps = (dispatch) => ({
  managerOpen: (m) => dispatch(managerOpen(m)),
  localModeFun: (l) => dispatch(localMode(l)),
  addSongs: (songs) => dispatch(addSongs(songs)),
});

function Navbar(props) {
  const classes = useStyles();
  const [open, setopen] = useState(false);
  const [codeBox, setcodeBox] = useState(false);
  const [code, setcode] = useState('');
  const [snackbar, setsnackbar] = useState({
    isOpen: false,
    severity: '',
    snackMessage: '',
  });

  const {
    managerOpen,
    manager,
    localMode,
    addSongs,
    localModeFun,
    updateData,
  } = props;

  const { snackMessage, isOpen, severity } = snackbar;

  const handleClose = () => {
    setcodeBox(false);
  };

  const handleChange = (e) => {
    setcode(e.target.value);
  };

  const codeSubmit = (e) => {
    e.preventDefault();
    const s = process.env.REACT_APP_NOT_SECRET_CODE;
    if (code === s) {
      setsnackbar({
        ...snackbar,
        isOpen: true,
        severity: 'success',
        snackMessage: 'You are Go-IN successfully.',
      });
      managerOpen(true);
      setcodeBox(false);
      localModeFun(false);
      localStorage.removeItem('local');
      setcode('');
    } else {
      setsnackbar({
        ...snackbar,
        isOpen: true,
        severity: 'warning',
        snackMessage: 'Please enter Valid Code.',
      });
      setcode('');
    }
  };

  const openCodeBox = () => {
    if (manager) {
      managerOpen(false);
      setopen(false);
      return;
    }
    setcodeBox(true);
    setopen(false);
  };

  const backHome = () => {
    managerOpen(false);
    localModeFun(false);
    localStorage.removeItem('local');
    setopen(false);
    updateData();
  };

  const goLocal = () => {
    localModeFun(true);
    localStorage.setItem('local', true);
    setopen(false);
    managerOpen(false);
    updateData();
  };

  return (
    <div>
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            style={{ marginRight: 15 }}
            color="inherit"
            aria-label="menu"
            onClick={() => setopen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography style={{ flex: 1 }} variant="h6">
            Quora Music
          </Typography>
          {localMode && (
            <IconButton
              color="inherit"
              aria-label="Add"
              component="label"
              htmlFor="song-input"
            >
              <input
                style={{ display: 'none' }}
                id="song-input"
                onChange={(e) => addSongs(e.currentTarget.files)}
                type="file"
                multiple
                accept="audio/mp3"
              />
              <AddIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Snackbar
        snackMessage={snackMessage}
        snackClose={() => setsnackbar({ ...snackbar, isOpen: false })}
        isOpen={isOpen}
        severity={severity}
      />
      <Drawer anchor="left" open={open} onClose={() => setopen(false)}>
        <div style={{ width: 250 }} role="presentation">
          <List>
            <ListItem button onClick={backHome}>
              <ListItemIcon>
                <LibraryMusicOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItem>
            <ListItem button onClick={goLocal}>
              <ListItemIcon>
                <LibraryMusicOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={'Local Songs'} />
            </ListItem>
            <ListItem button onClick={openCodeBox}>
              <ListItemIcon>
                {manager ? <ExitToAppIcon /> : <LibraryAddOutlinedIcon />}
              </ListItemIcon>
              <ListItemText primary={manager ? 'Logout' : 'Manager'} />
            </ListItem>
          </List>
        </div>
      </Drawer>

      <Dialog
        open={codeBox}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Paper component="form" className={classes.rootPaper}>
          <InputBase
            type="password"
            value={code}
            name="code"
            onChange={handleChange}
            autoFocus
            className={classes.inputhere}
          />
          <Button onClick={codeSubmit} color="secondary">
            GoIN
          </Button>
        </Paper>
      </Dialog>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
