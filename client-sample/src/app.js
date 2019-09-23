console.log(mqtt);

const app = angular.module("myApp", []);
app.controller("clientSampleController", ($scope, $interval) => {
    let MQTT_CLIENT;
    let KEEP_ALIVE_INTERVAL;

    $scope.data = {
        selectedUser: null,
        selectedStatus: null,
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
        ],
        usersData: []
    };

    $scope.actions = {
        init: () => {
            $scope.actions.setDefaultOptions();
        },
        setDefaultOptions: () => {
            $scope.data.selectedUser = $scope.data.availableUsers[0];
            $scope.data.selectedStatus = $scope.data.availableStatusOptions[1];
        },
        onLogin: () => {
            $scope.actions.mqtt(() => {
                $scope.data.selectedStatus = $scope.data.availableStatusOptions[0];
                $scope.actions.getFriendStatuses();
                $scope.actions.runKeepAliveReporter();
                $scope.$apply();
            });
        },
        onLogout: () => {
            $scope.data.selectedStatus = $scope.data.availableStatusOptions[1];
            if (MQTT_CLIENT) {
                $scope.actions.unsubscribeFromFriends();
                $scope.actions.publishMyPresenceLogout();
                MQTT_CLIENT.end()
            }

            $scope.actions.destroyInterval();
        },
        mqtt: (callback) => {
            MQTT_CLIENT = mqtt.connect("mqtt://104.248.155.37:1884", {
                clientId: `mqtt_app_user_${$scope.data.selectedUser}`
            })
            MQTT_CLIENT.on("connect", () => {
                console.log("connected to mqtt. will subscribe for client/<userid>/presence")
                $scope.actions.publishMyPresenceLogin();
                $scope.actions.subscribeToFriends();
                callback();
            })
            MQTT_CLIENT.on("message", (topic, message) => {
                const data = JSON.parse(message.toString());
                if (topic.startsWith("client/")) {
                    $scope.actions.handleOtherUserPresence(data);
                }
            })
            MQTT_CLIENT.on("reconnect", () => {
                console.log("should reconnect")
            })
            MQTT_CLIENT.on("close", () => {
                console.log("should end mqtt connection")
            })
            MQTT_CLIENT.on("offline", () => {
                console.log("should offline")
            })
        },
        subscribeToFriends: () => {
            const topics = $scope.data.availableUsers
                .filter((user) => user !== $scope.data.selectedUser)
                .map((user) => `client/${user}/presence`);
            MQTT_CLIENT.subscribe(topics);
        },
        unsubscribeFromFriends: () => {
            const topics = $scope.data.availableUsers
                .filter((user) => user !== $scope.data.selectedUser)
                .map((user) => `client/${user}/presence`);
            MQTT_CLIENT.unsubscribe(topics);
        },
        publishMyPresenceLogin: () => {
            const presenceData = $scope.actions.constructPresenceData("online", "login");
            MQTT_CLIENT.publish("presence", JSON.stringify(presenceData))   
        },
        publishMyPresenceLogout: () => {
            const presenceData = $scope.actions.constructPresenceData("offline", "logout");
            MQTT_CLIENT.publish("presence", JSON.stringify(presenceData))   
        },
        publishMyPresenceOnline: () => {
            const presenceData = $scope.actions.constructPresenceData("online", "online");
            MQTT_CLIENT.publish("presence", JSON.stringify(presenceData))   
        },
        runKeepAliveReporter: () => {
            KEEP_ALIVE_INTERVAL = $interval(() => {
                console.log("will report alive")
                $scope.actions.publishMyPresenceOnline();
            }, 1 * 60 * 1000);
        },
        destroyInterval: () => {
            if (KEEP_ALIVE_INTERVAL) {
                $interval.stop(KEEP_ALIVE_INTERVAL);
                KEEP_ALIVE_INTERVAL = undefined;
            }
        },
        constructPresenceData: (status, onlineType) => {
            return {
                user_id: $scope.data.selectedUser,
                status,
                last_online_type: onlineType,
                last_online_time: new Date().toISOString()
            }
        },
        handleOtherUserPresence: (user) => {
            console.log("Other user status changed => ", user)
            for (let i=0; i < $scope.data.usersData.length; i++) {
                if ($scope.data.usersData[i].user_id === user.user_id) {
                    $scope.data.usersData[i] = user
                }
            }
            $scope.$apply();
        },
        getFriendStatuses: () => {
            $.get("http://104.248.155.37:8080/users/status", (response) => {
                $scope.data.usersData = response.data.users_statuses
                    .filter((u) => u.user_id !== $scope.data.selectedUser);
                $scope.$apply();
            });
        }
    };

    $scope.$on('$destroy', function() {
        $scope.actions.destroyInterval();
    });

    $scope.actions.init();

});