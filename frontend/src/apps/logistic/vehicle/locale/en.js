// ----------------------------------------------------------------------

// IF THIS TRANSLATION IS INCORRECT PLEASE IGNORE THIS AS THIS TRANSLATION IS FOR DEMO PURPOSES ONLY
// We are happy if you can help improve the translation by sending an email to support@minimals.cc.

// ----------------------------------------------------------------------

import * as yup from "yup";

const en = {
  title: {
    page: 'Vehicles',
    navigation: 'Vehicles',
    list: 'Vehicle list',
    edit: 'Edit vehicle',
    create: 'New vehicle',
    view: 'View vehicle',
  },
  create: 'Add',
  pcs: 'pcs.',
  form: {
    main_data: 'Main Data',
    characteristics: 'Vehicle Characteristics',
    manufacturer: 'Manufacturer',
    model: 'Model',
    vin: 'VIN Number',
    customer: 'Customer',
    destination: 'Delivery Destination',
    year: 'Year of Manufacture',
    color: 'Color',
    lot_id: 'Lot ID',
    buyer_id: 'Buyer ID',
    history: {
      title: 'Delivery History',
      status: 'Status',
      datetime: 'Date and Time',
    },
    photos: {
      title: 'Photos',
      select_category: 'Select a category to view and upload photos'
    },
    documents: {
      title: 'Documents',
      name: 'Name',
      file: 'File'
    },
    edit_button: 'Save',
    create_button: 'Create',
  },
  view: {
    timeline: 'Delivery History',
    photos: 'Photos',
    documents: 'Documents',
    empty_photos: 'No photos available.',
    empty_documents: 'No documents available.'
  },
  breadcrumb: {
    main: 'Vehicles',
    list: 'List',
    edit: 'Edit',
    create: 'Create',
    view: 'View',
  },
  validator: {
    manufacturer_required: 'Manufacturer is required',
    model_required: 'Model is required',
    vin_required: 'VIN is required',
    characteristics: {
      year_required: 'Year is required',
      color_required: 'Color is required',
    },
    history: {
      status_required: 'Status is required',
      datetime_required: 'Date and time are required',
    },
    documents: {
      name_required: 'Name is required',
      file_required: 'File is required',
    },
  },
  filter: {
    status: 'Vehicle Status',
    destination: 'Delivery Destination',
    customer: 'Customer',
    search: 'Search...',
    vin: 'VIN Number (separated by spaces)',
  },
  table: {
    make: 'Vehicle Make',
    vin: 'VIN',
    destination: 'Delivery Destination',
    customer: 'Customer',
    status: 'Status',
  },
  error: {
    create: 'Error occurred while creating data',
    edit: 'Error occurred while saving data',
    delete: 'Error occurred while deleting data',
    import: 'Error occurred while importing data',
  },
  success: {
    create: 'Data successfully created',
    edit: 'Data successfully saved',
    delete: 'Data successfully deleted',
    import: 'Data successfully imported',
  },
  delete: {
    title: 'Delete Confirmation',
    description: 'Are you sure you want to delete this data? \nThis action is irreversible.',
  },
}

export default en
