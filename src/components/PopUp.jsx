import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Button } from '@material-ui/core';
import { FaRegWindowClose } from 'react-icons/fa';

export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup, onSubmit } = props;

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(); // Execute the submit logic
    }
    setOpenPopup(false); // Close the dialog
  };

  return (
    <Dialog open={openPopup} onClose={() => setOpenPopup(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {title}
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => setOpenPopup(false)}
          aria-label="close"
          style={{ position: 'absolute', right: 8, top: 8, color: 'gray' }} // Adjust positioning as needed
        >
          <FaRegWindowClose />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {children}
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit} // Use the handleSubmit function
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
