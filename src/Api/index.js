// General api to access data
import ApiConstants from './ApiConstants';

const errorHandler = response => {
  if (!response.ok) return { error: Error(), status: response.status };
  return response.json();
};

export default function api(path, params, method, token) {
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    method,
    ...(params && { body: JSON.stringify(params) })
  };

  return fetch(ApiConstants.BASE_URL + path, options)
    .then(resp => errorHandler(resp))
    .catch(error => ({ error }));
}
