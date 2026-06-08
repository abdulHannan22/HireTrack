import api from "./axios";

export const register = (data) =>
  api.post("/auth/signup", data).then((r) => r.data);
// returns { token, user: { id, firstname, email } }

export const login = (data) =>
  api.post("/auth/signin", data).then((r) => r.data);
// returns { token, user: { id, firstname, email } }
