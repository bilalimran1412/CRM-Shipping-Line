import React, {useState} from "react";
import {Button, Menu, MenuItem} from "@mui/material";
import {useLocales} from "../../../../locales";
import {useFormContext} from "react-hook-form";

const TemplateButton = ({formData, replace}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const {translate, currentLang} = useLocales()
  const {setValue, getValues} = useFormContext()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the dropdown
  };

  const handleMenuItemClick = (option) => {
    handleClose(); // Close the dropdown after selection
  };
  const handleTemplateSelect = (items) => {
    replace([])
    const timeout = setTimeout(() => {
      const details = items.map(item => ({
        description: item.description,
        currency: formData?.primary_currency?.id,
        exchange_rate: 1,
        amount_in_currency: 0,
        amount_in_default: 0,
      }))
      replace(details)
      clearTimeout(timeout)
    }, 1)
    handleClose();
  }
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        {translate('customer-invoice.form.templates')}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {formData?.detail_templates?.map?.((item, index) => {
          return (
            <MenuItem key={index} onClick={() => handleTemplateSelect(item.items)}>{item.name}</MenuItem>
          )
        })}
      </Menu>
    </div>
  );
};

export default TemplateButton;
