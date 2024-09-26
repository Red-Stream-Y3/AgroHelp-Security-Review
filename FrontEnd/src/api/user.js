import axios from 'axios';

axios.defaults.withCredentials = true;

// user login
export const login = async (email, password) => {
  try {
    const response = await axios.post('/api/users/login', {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

// user register
export const register = async (
  username,
  firstName,
  lastName,
  email,
  password
) => {
  try {
    const response = await axios.post('/api/users', {
      username,
      firstName,
      lastName,
      email,
      password,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

// user logout
export const logout = async () => {
    try {
    const response = await axios.get('/api/users/logout');
    return response;
  } catch (error) {
    console.log('Error logging out user:', error);
  }
  localStorage.removeItem('userInfo');
  document.location.href = '/';
};

// get users
export const getUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    return response;
  } catch (error) {
    console.log(error);
  }
};

// get user details
export const getUserDetails = async () => {
  try {
    const response = await axios.get('/api/users/profile');
    return response.data;
  } catch (error) {
    console.log('Error fetching user details:', error);
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.get('/api/users/logout');
    return response;
  } catch (error) {
    console.log('Error logging out user:', error);
  }
};


// update profile details
export const updateProfile = async (user) => {
  try {
    const response = await axios.put('/api/users/profile', user);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// update user
export const updateUser = async (user) => {
  try {
    const response = await axios.put(`/api/users/${user._id}`, user);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// request role
export const requestRole = async (user) => {
  try {
    const response = await axios.put(
      `/api/users/${user._id}/request`,
      user
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`/api/users/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// get site visits
export const getSiteVisits = async () => {
  try {
    const response = await axios.get('/api/visits');
    return response;
  } catch (error) {
    console.log(error);
  }
};

// get author info
export const getAuthorInfo = async (id) => {
  try {
    const response = await axios.get(`/api/users/${id}/author`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
