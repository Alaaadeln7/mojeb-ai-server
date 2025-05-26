import responseHandler from '../utils/response.js';
export const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return responseHandler(
      res,
      403,
      'Forbidden',
      'You do not have permission to access this resource.'
    );
  }
}
export const checkClientRole = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    next();
  } else {
    return responseHandler(
      res,
      403,
      'Forbidden',
      'You do not have permission to access this resource.'
    );
  }
}