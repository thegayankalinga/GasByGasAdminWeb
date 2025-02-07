import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

const ConfirmPopup = ({ open, handleClose, handleAgree, handleDisagree, title, content, yesOptionTxt, noOptionTxt }) => {
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDisagree}>{noOptionTxt}</Button>
                    <Button onClick={handleAgree} autoFocus>
                        {yesOptionTxt}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default ConfirmPopup;