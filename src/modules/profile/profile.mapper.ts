import { UserRecord } from "../users/user.types";
import { ProfileResponse } from "./profile.types";

export function mapUserRecordToProfile(user: UserRecord): ProfileResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    imageUrl: user.imageUrl,
  };
}
