const mockUser: MockType = {
  _id: 123,
  username: "admin",
  password: "admin",
};

interface MockType {
  username: string;
  password: string;
  _id?: number;
}
export default mockUser;
