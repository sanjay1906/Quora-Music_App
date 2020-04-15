import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars(props) {
  const { isOpen, snackClose, severity, snackMessage } = { ...props };
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={snackClose}
      >
        <Alert onClose={snackClose} severity={severity}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
