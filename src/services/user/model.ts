import {AppOptions} from "#root/src/types/app";

class User {
  uuid: string;
  phoneNumber?: string;
  constructor({uuid, phoneNumber}: AppOptions["userData"]) {
    this.uuid = uuid;
    this.phoneNumber = phoneNumber;
  }
}
export {User};
