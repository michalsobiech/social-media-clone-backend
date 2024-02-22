export type APIErrorType = {
  /** HTTP status code */
  status: number;
  /** Short human readable form */
  title: string;
  /** Explanation of why the problem occurred */
  detail: string;
  /** Link to the problem section in the API documentation */
  link?: string;
};

export default class APIError extends Error {
  status: number;
  error: APIErrorType;

  constructor(error: APIErrorType) {
    super();

    this.status = error.status;
    this.error = error;
    Error.captureStackTrace(this);
  }
}
