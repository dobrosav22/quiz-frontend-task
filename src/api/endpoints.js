import api from './api';

const apiReq = async (method, url, data) => {
  try {
    const response = await api[method](url, data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}

/**A get request for retrieving all the quizzes. */
export const getAllQuizzes = () => apiReq('get', '/quizzes')

/**Getting all the available questions. */
export const getAllQuestions = () => apiReq('get', '/questions')

/**Deleting a quiz entry by ID. */
export const deleteQuiz = (id) => apiReq('delete', `/quizzes/${id}`)

/**Getting a single quiz entry by ID. */
export const getQuizById = (id) => apiReq('get', `/quizzes/${id}`)

/**A post request for creating a new quiz entry. */
export const createQuiz = (data) => apiReq('post', '/quizzes', data)

/**Updating a quiz by ID with a payload with new data. */
export const updateQuiz = (id, data) => apiReq('put', `/quizzes/${id}`, data)
