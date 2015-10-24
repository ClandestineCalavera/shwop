

// describe('shwop.Services', function() {

//   var Products;

//   beforeEach(angular.mock.module('shwop'));
//   beforeEach(inject(function($injector) {
//     Products = $injector.get('Products');
//   }));

//   beforeEach(angular.mock.inject(function($httpBackend) {
//     backend = $httpBackend;
//     backend.expect('GET','/api/products').respond([
//       {"name": " Bob", "age": 18}
//     ]);
//   }));

//   it('Makes an AJAX request', function(){
//     Products.getAllProducts();
//     backend.verifyNoOutstandingExpectation();
//   });

//   it('Should expect 0 to equal 0', function() {
//     Products.setCurrentProduct('hot dog');
//     expect(Products.getCurrentProduct()).to.equal('hot dog');
//   });

//   it('Should expect 1 to equal 1', function() {
//     expect(1).to.equal(1);
//   });

// });



//BELOW CODE TRIES TO TEST BOTH CONTROLLER AND SERVICE FROM SAME FILE, CAUSING ISSUES.


// describe('ProductController', function() {
//   beforeEach(angular.mock.module('shwop'));
//   describe('getAllProducts', function() {
//     var $httpBackend, $rootScope, createController;

//     beforeEach(inject(function($injector){

//       $httpBackend = $injector.get('$httpBackend')

//       $rootScope = $injector.get('$rootScope');
//       var $controller = $injector.get('$controller');
//       var Products = $injector.get('Products');

//       createController = function() {
//         return $controller('ProductController', {
//           '$scope': $rootScope
//         });
//       };
//     }));


//     it('should give back the data I want', function(){
//       $httpBackend.when('GET', '/api/products').respond( 
//         {'products':
//           [{url: '../../photos/chessboard.jpg', price: 60}, 
//           {url: '../../photos/decoration.jpg', price: 100}, 
//           {url: '../../photos/drone.jpg', price: 300}, 
//           {url: '../../photos/plane.jpg', price: 35000}]
//         });
//       createController();
//       $rootScope.getAllProducts(
//         function(output){
//           console.log('\n\n\n*** fasdf',output);
//           //expect($rootScope.data.products[0]['name']).to.equal('fleevasdgasdgsadg');
//         }
//       );
//       $rootScope.$apply();
      
//     });
//   })
// })
