# Testing Strategy

- AddStudentToGroupService -
    - Needs to be re-written : All the logic needs to be in the Service , and not in the controller.
    - Rewrite All the test Cases too Please.
- AuthenticateInstructorService -
    - Needs to be moved to Instructor Api
- checkIdDuplicateService -
- 

### Proof of Concept for Testing reusable data on the database.

## If we want to test , that a function is creating / Deleting a new record in the data base properly , then we can use the methods below. For Select methods , we can rely on the data that is already in the database.

### If data needs to be created before Each test .

```jsx
import { beforeEach , test  } from 'vitest'
const { User } = require('./models');

// Run before every test , to create some mock data
beforeEach(async () => {
  // Clear the DB and add mock data.
  await User.sync({ force: true });
  await User.create({ username: 'testUser', password: 'testPassword' });
});

afterEach(async () => {
  // Clear the DB after each test.
  await User.destroy({ where: {} });
});

test('find a user', async () => {
  const user = await User.findOne({ where: { username: 'testUser' } });
  expect(user).not.toBeNull();
  expect(user.username).toBe('testUser');
});
```

### If data needs to be created only before one test

```jsx
import { beforeEach , test  } from 'vitest'
const { User } = require('./models');

test('find a user', async () => {
	// Create A new test data Right before the test 
	await User.create({
      name: 'testUser',
      password: 'testUser'
    });
	// Use The test Data , to test the behavior of the function 
  const user = await User.findOne({ where: { username: 'testUser' } });
	// Test if the function is returning the right data
  expect(user).not.toBeNull();
  expect(user.username).toBe('testUser');

	// Clear the test Data 
	await User.destroy({
      where: {
        name: 'testUser',
        password: 'testUser'
      };

});
```