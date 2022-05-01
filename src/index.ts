import { UserForm } from './views/UserForm';
import { User, UserProps, rootUrl } from './models/User';
import { UserEdit } from './views/UserEdit';
import { Collection } from './models/Collection';
import { UserList } from './views/UserList';

const userCollection = new Collection<User, UserProps>(rootUrl, (json: UserProps): User => {
    return User.buildUser(json);
});

userCollection.on('change', () => {
    const root = document.getElementById('root');
    if (root) {
        new UserList(root, userCollection).render();
    }
});

userCollection.fetch();