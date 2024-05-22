import { User } from "./schemas/user.js";

export async function findUser(email) {
  return User.findOne({ email });
}

export async function findUserById(_id) {
  return User.findOne({ _id });
}

export async function setUserToken(id, token) {
  return User.findByIdAndUpdate({ _id: id }, token);
}

export async function updateSubscription(userId, body) {
  return User.findByIdAndUpdate({ _id: userId }, body, {new: true});
}