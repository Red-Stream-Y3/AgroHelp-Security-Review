import axios from 'axios';

axios.defaults.withCredentials = true;

// get all crops
export const getAllCrops = async () => {
  try {
    const response = await axios.get('/api/crops');
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// get all crops in short form
export const getAllCropsShort = async () => {
  try {
    const response = await axios.get('/api/crops/short');
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// get crop by id
export const getCropById = async (id) => {
  try {
    const response = await axios.get(`/api/crops/${id}`);
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// create crop
export const createCrop = async (crop) => {
  try {
    const response = await axios.post('/api/crops', crop);
    return response;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
  }
};

// update crop
export const updateCrop = async (id, crop) => {
  try {
    const response = await axios.put(`/api/crops/${id}`, crop);

    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// delete crop
export const deleteCrop = async (id) => {
  try {
    const response = await axios.delete(`/api/crops/${id}`);

    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// search crop
export const searchCrop = async (name) => {
  try {
    const response = await axios.get(`/api/crops/search/q=${name}`);

    return response;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// update crop as accept
export const updateCropAccept = async (id, crop) => {
  try {
    const response = await axios.put(`/api/crops/${id}/accept`, crop);
    return response;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
  }
};

// get crops by author
export const getCropsByAuthor = async (id) => {
  try {
    const response = await axios.get('/api/crops/author/' + id);
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// get all diseases
export const getAllDiseases = async () => {
  try {
    const response = await axios.get('/api/diseases');
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// get random diseases
export const getRandomDiseases = async () => {
  try {
    const response = await axios.get('/api/diseases/random');
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// get disease by id
export const getDiseaseById = async (id) => {
  try {
    const response = await axios.get(`/api/diseases/${id}`);
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// create disease
export const createDisease = async (disease) => {
  try {
    const response = await axios.post('/api/diseases', disease);
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// update disease
export const updateDisease = async (id, disease) => {
  try {
    const response = await axios.put(`/api/diseases/${id}`, disease);
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// delete disease
export const deleteDisease = async (id) => {
  try {
    const response = await axios.delete(`/api/diseases/${id}`);
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// search disease
export const searchDisease = async (name) => {
  try {
    const response = await axios.get(`/api/diseases/search/q=${name}`);
    return response;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

// update disease as accept
export const updateDiseaseAccept = async (id, crop) => {
  try {
    const response = await axios.put(`/api/diseases/${id}/accept`, crop);
    return response;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
  }
};

// get diseases by author
export const getDiseasesByAuthor = async (id) => {
  try {
    const response = await axios.get('/api/diseases/author/' + id);
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

export const addRemoveCropBookmarks = async (id, userId) => {
  try {
    const response = await axios.put(`/api/crops/bookmark/${id}`, { userId });
    return response;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
  }
};

export const addRemoveDiseaseBookmarks = async (id, userId) => {
  try {
    const response = await axios.put(`/api/diseases/bookmark/${id}`, {
      userId,
    });
    return response;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
  }
};

export const getCropBookmarksByUser = async (id) => {
  try {
    const response = await axios.get(`/api/crops/bookmarks/${id}`);
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

export const getDiseaseBookmarksByUser = async (id) => {
  try {
    const response = await axios.get('/api/diseases/bookmarks/' + id);
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

export const getAllAcceptedCrops = async () => {
  try {
    const response = await axios.get('/api/crops/accepted');
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};

export const getAllAcceptedDiseases = async () => {
  try {
    const response = await axios.get('/api/diseases/accepted');
    return response.data;
  } catch (error) {
    console.log('KNOWLEDGEBASE', error.message);
    return [];
  }
};
