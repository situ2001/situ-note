import axios from "axios";

export const getFetcher = (url: string) =>
  axios.get(url).then((result) => result.data);

export const postFetcher = (url: string) =>
  axios.post(url).then((result) => result.data);
