export const DB_MOCK = {}

export const getUsersFromDB = () => {
  return DB_MOCK.users || [];
}

export const setUsersToDB = (users) => {
  DB_MOCK.users = users;
}