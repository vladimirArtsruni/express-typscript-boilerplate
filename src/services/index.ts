import { UserService } from './UserService';
import { User } from "../typeorm/entities/users/User";

export default {
    userService: new UserService(User)
}