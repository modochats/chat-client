import {BASE_API_URL} from "#src/constants/index.js";
import {ofetch} from "ofetch";

let $fetch = ofetch.create({
  baseURL: BASE_API_URL
});

const updateFetchTool = () => {
  $fetch = ofetch.create({
    baseURL: BASE_API_URL
  });
};

export {updateFetchTool};
export {$fetch};
