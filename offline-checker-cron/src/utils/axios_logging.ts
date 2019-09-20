import axios from "axios";
import { logger } from "./logger";

// "Reserved" words on Axios config.headers
const reservedHeadersWords = [
  "common",
  "delete",
  "get",
  "head",
  "post",
  "put",
  "patch",
];

const formatHeaders = (headers) => {
  const cleanedHeaders = Object.getOwnPropertyNames(headers)
    .filter((headerName) => reservedHeadersWords.indexOf(headerName.toLowerCase()) === -1)
    .reduce((acc, headerName) => acc + headerName + ": " + headers[headerName] + "\n", "");

  return cleanedHeaders;
};

export const setupAxiosLogging = () => {
  axios.interceptors.request.use((config: any) => {
    config.requestStartTime = Date.now();
    const headers = formatHeaders(config.headers);
    logger.info(`
      ##  HTTP client request ##
      ${config.method.toUpperCase()} ${config.url}

      HEADERS:
      ${headers}
      BODY:
      ${config.data ? JSON.stringify(config.data) : ""}
    `);

    return config;
  });

  axios.interceptors.response.use((response: any) => {
    logger.info(`
      ##  HTTP client response  ##
      ${response.config.method.toUpperCase()} ${response.config.url}
      Elapsed time: ${Date.now() - response.config.requestStartTime} ms
      STATUS: ${response.status}

      HEADERS: ${Object.keys(response.headers).reduce((acc, curr) => acc + curr + ": " + response.headers[curr] + "\n", "\n") }
      BODY:
      ${response.data ? JSON.stringify(response.data) : ""}
    `);
    return response;
  });
};
