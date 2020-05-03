import React, { useState } from 'react';
import {
  makeStyles,
  Dialog,
  TextField,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Fab,
  Tooltip,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Avatar,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import ImageIcon from '@material-ui/icons/Image';
import AddIcon from '@material-ui/icons/Add';
import ExpressFirebase from 'express-firebase';
import moment from 'moment';
import Snackbar from './Snackbar';
import axios from 'axios';

const FirebaseConfig = {
  apiKey: 'AIzaSyCcVeC75EcRSTahjkwqjUA7faGeS-nFssI',
  authDomain: 'my-music-app-9dfc8.firebaseapp.com',
  databaseURL: 'https://my-music-app-9dfc8.firebaseio.com',
  projectId: 'my-music-app-9dfc8',
  storageBucket: 'my-music-app-9dfc8.appspot.com',
  messagingSenderId: '54441801733',
  appId: '1:54441801733:web:9cccf74a980ba1ea4dc46c',
  measurementId: 'G-512LLWJQWX',
};

ExpressFirebase.connect(FirebaseConfig);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    background:
      'linear-gradient(60deg, #43a047 10%,#7b1fa2 40%, #7e57c2 20%, #21CBF3 100%)',
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(10),
  },
  loading: {
    position: 'absolute',
    bottom: theme.spacing(40),
    right: theme.spacing(80),
  },
  input: {
    display: 'none',
  },
  green: {
    color: '#fff',
    backgroundColor: green[500],
  },
  root: {
    width: '35rem',
    '& > * + *': {},
  },
}));

export default function DenseTable(props) {
  const classes = useStyles();
  const { songs, updateData } = props;
  const [open, setOpen] = useState(false);
  const [music, setmusic] = useState(null);
  const [image, setimage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [snackbar, setsnackbar] = useState({
    isOpen: false,
    severity: '',
    snackMessage: '',
  });
  const [form, setform] = useState({
    title: '',
    artist: '',
  });

  const { snackMessage, isOpen, severity } = snackbar;

  const handleChage = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setform({
      ...form,
      [name]: value,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSave = async () => {
    const { title, artist } = form;
    if (!title || !artist || !music || !image) {
      setsnackbar({
        ...snackbar,
        isOpen: true,
        severity: 'error',
        snackMessage: 'Please Fill all field',
      });
      return false;
    }
    let musicURL;
    let ImageURL;
    if (!musicURL || !ImageURL) {
      setSuccess(true);
    }
    try {
      musicURL = await ExpressFirebase.uploadFile(
        `musics/${music.name}`,
        music
      );
      ImageURL = await ExpressFirebase.uploadFile(
        `images/${image.name}`,
        image
      );
      if (musicURL) {
        let audio = new Audio(musicURL);
        audio.addEventListener('loadedmetadata', async (e) => {
          let dateObj = new Date(e.target.duration * 1000);
          let minutes = dateObj.getUTCMinutes();
          let seconds = dateObj.getSeconds();
          let time =
            minutes.toString().padStart(2, '0') +
            ':' +
            seconds.toString().padStart(2, '0');

          await axios.post(`music`, {
            title,
            artist,
            music: musicURL,
            musicImage: ImageURL,
            time,
          });
          setsnackbar({
            ...snackbar,
            isOpen: true,
            severity: 'success',
            snackMessage: 'Music Added SuccessFully',
          });
          updateData();
          setmusic(null);
          setimage(null);
          setSuccess(false);
          setOpen(false);
        });
      }
    } catch (error) {
      setsnackbar({
        ...snackbar,
        isOpen: true,
        severity: 'warning',
        snackMessage: 'Uploading problem...!',
      });
      setmusic(null);
      setimage(null);
      setSuccess(false);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMusicFile = (e) => {
    const music = e.target.files[0];
    setmusic(music);
  };
  const handleMImageFile = (e) => {
    const image = e.target.files[0];
    setimage(image);
  };

  const handleDaleteMusic = async (musicId, musicName) => {
    await axios.delete(`music/${musicId}`);
    setsnackbar({
      ...snackbar,
      isOpen: true,
      severity: 'success',
      snackMessage: `${musicName}-song Deleted`,
    });
    updateData();
  };

  return (
    <div>
      <Snackbar
        snackMessage={snackMessage}
        snackClose={() => setsnackbar({ ...snackbar, isOpen: false })}
        isOpen={isOpen}
        severity={severity}
      />
      <Dialog
        style={{ background: '#7e57c2' }}
        open={open}
        aria-labelledby="form-dialog-title"
      >
        {success ? (
          <div className={classes.root}>
            <LinearProgress variant="query" color="secondary" />
            <LinearProgress variant="indeterminate" />
            <LinearProgress variant="indeterminate" color="secondary" />
            <LinearProgress variant="query" />
          </div>
        ) : (
          <div>
            <DialogTitle id="form-dialog-title">Add Music</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                name="title"
                margin="dense"
                id="title"
                label="Title"
                type="text"
                fullWidth
                onChange={handleChage}
              />
              <TextField
                name="artist"
                margin="dense"
                id="title"
                label="Artist"
                type="text"
                fullWidth
                onChange={handleChage}
              />

              <div>
                <input
                  className={classes.input}
                  type="file"
                  id="soundFile"
                  capture="user"
                  accept="audio/*|media_type"
                  onChange={handleMusicFile}
                />
                <label htmlFor="soundFile">
                  <IconButton color="primary" component="span">
                    <Avatar className={classes.green}>
                      <MusicNoteIcon />
                    </Avatar>
                  </IconButton>
                  {(music || {}).name || 'Choose Music'}
                </label>
              </div>
              <div>
                <input
                  className={classes.input}
                  type="file"
                  id="imageFile"
                  capture="user"
                  accept="image/*|media_type"
                  onChange={handleMImageFile}
                />
                <label htmlFor="imageFile">
                  <IconButton color="primary" component="span">
                    <Avatar className={classes.green}>
                      <ImageIcon />
                    </Avatar>
                  </IconButton>
                  {(image || {}).name || 'Choose Music Image'}
                </label>
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleSave} color="primary">
                Save
              </Button>
              <Button autoFocus onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </div>
        )}
      </Dialog>
      <TableContainer component={Paper}>
        <Tooltip onClick={handleClickOpen} title="Add" aria-label="add">
          <Fab color="secondary" className={classes.absolute}>
            <AddIcon />
          </Fab>
        </Tooltip>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Music Name</TableCell>
              <TableCell>Artists</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((row) => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell>{row.artist}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>
                  {moment(row.created).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell align="center">
                  <DeleteForeverIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDaleteMusic(row._id, row.title)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
