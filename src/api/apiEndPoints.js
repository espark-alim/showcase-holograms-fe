// User Endpoints
const IMAGES = "/users/original-photos";
const UPLOAD_IMAGE = "/users/upload-original-photos";
const SUBMIT_FORM = "/users/submit-form";
const SINGLE_IMAGE = "/users/original-photo/";
const SUBMIT_IMAGES = "/users/upload-processed-photos";

// Reviewer Endpoints
const REVIEWER_LOGIN = "/reviewer/login";
const REVIEWER_UPDATE_PHOTO_STATUS = "/reviewer/update-photo-status/";
const REVIEWER_EDIT_PHOTO = "/reviewer/photos/";
const REVIEWER_GET_PHOTO_BY_ID = "/reviewer/photos/";
const REVIEWER_DELETE_PHOTO_BY_ID = "/reviewer/photos/";
const REVIEWER_CREATE_VIDEO = "/reviewer/create-video";
const REVIEWER_DASHBOARD = "/reviewer/dashboard";

export {
  SUBMIT_FORM,
  IMAGES,
  UPLOAD_IMAGE,
  SINGLE_IMAGE,
  SUBMIT_IMAGES,
  REVIEWER_LOGIN,
  REVIEWER_UPDATE_PHOTO_STATUS,
  REVIEWER_EDIT_PHOTO,
  REVIEWER_GET_PHOTO_BY_ID,
  REVIEWER_DELETE_PHOTO_BY_ID,
  REVIEWER_CREATE_VIDEO,
  REVIEWER_DASHBOARD,
};
