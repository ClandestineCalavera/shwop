

describe('Users Service', function() {

  var Users;
  var exampleUser = {
    id: 42,
    firstName: 'Han',
    lastName: 'Solo',
    phoneNumber: '1234567890',
    email: 'hansolo@milleniumf.io',
    password: 'Chewie',
    address1: '1122 Alderaan Way',
    address2: 'Suite 601',
    city: 'Trading Outpost',
    state: 'Tatooine',
    zip: '10001',
    country: 'Tatooine',
    latitude: 29.7604,
    longitude: 95.3698
  };

  beforeEach(angular.mock.module('shwop'));
  beforeEach(inject(function($injector) {
    Users = $injector.get('Users');
  }));


  beforeEach(angular.mock.inject(function($httpBackend) {
    backend = $httpBackend;
  }));

  afterEach(function() {
    backend.verifyNoOutstandingExpectation();
    backend.verifyNoOutstandingRequest();
  });

  it('Should make a GET request to /api/users when getUsers is called', function(){
    backend.expectGET('/api/users').respond(200,'');
    Users.getUsers();
    backend.flush();
  });

  it('Should make a GET to /api/users/profile when getUserInfo is called', function() {
    backend.expectGET('/api/users/profile').respond(200,'');
    Users.getUserInfo();
    backend.flush();
  });

  it('Should post correct data to /api/users when addUser is called', function() {
    backend.expectPOST('/api/users', exampleUser).respond(200,'');
    Users.addUser(exampleUser);
    backend.flush();
  });

  it('Should post correct data to /api/users/update when updateUser is called', function() {
    backend.expectPOST('/api/users/update', exampleUser).respond(200,'');
    Users.updateUser('superSecretToken111', exampleUser);
    backend.flush();
  });

  it('Should make a GET request to "/api/users/ + UserId" when getUserLocation is called', function() {
    backend.expectGET('/api/users/42').respond(200,'');
    Users.getUserLocation(42);
    backend.flush();
  });

});
