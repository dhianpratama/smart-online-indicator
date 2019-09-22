console.log(mqtt);

const app = angular.module("myApp", []);
app.controller("clientSampleController", ($scope) => {
  $scope.data = {
    selectedUser: null,
    availableUsers: [
        "Dhian",
        "John",
        "Wenhan",
        "Sabrina",
        "Tony"
    ],
    availableStatusOptions: [
        {
            "id": "online",
            "name": "Online (Logged in)",
            "description": "Normal online connection. Will send alive report every 1 min"
        },
        {
            "id": "logout",
            "name": "Offline (Logged out)",
            "description": "Logged out from app. Will not send alive report"
        },
        {
            "id": "offline",
            "name": "Offline (Logged in, Internet problem)",
            "description": "Logged in. Will send alive report every 1 min. But it has internet problem, so alive report will not reach to server"
        }
    ]
  };

  $scope.actions = {

  };
});