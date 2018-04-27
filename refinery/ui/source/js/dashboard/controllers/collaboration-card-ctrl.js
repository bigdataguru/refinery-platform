/**
 * Collaboration Card Ctrl
 * @namespace CollaborationCardCtrl
 * @desc Controller for events card component on dashboard component.
 * @memberOf refineryApp.CollaborationCardCtrl
 */
(function () {
  'use strict';

  angular
    .module('refineryDashboard')
    .controller('CollaborationCardCtrl', CollaborationCardCtrl);

  CollaborationCardCtrl.$inject = [
    '$scope',
    '$uibModal',
    'groupInviteService',
  ];

  function CollaborationCardCtrl (
    $scope,
    $uibModal,
    groupInviteService
  ) {
    var vm = this;
    vm.userGroups = [];
    vm.invitation = {};
    vm.openGroupAdd = openGroupAdd;
    vm.openGroupEditor = openGroupEditor;
    vm.openGroupMemberAdd = openGroupMemberAdd;
    vm.openGroupMemberEditor = openGroupMemberEditor;
    vm.resendInvitation = resendInvitation;
    vm.revokeInvitation = revokeInvitation;

    function openGroupAdd () {
      var modalInstance = $uibModal.open({
        component: 'rpGroupAddModal'
      });

      modalInstance.result.then(function (response) {
        if (response === 'success') {
          vm.dashboardParentCtrl.getGroups();
        }
      });
    }

    function openGroupEditor (group, member) {
      var modalInstance = $uibModal.open({
        component: 'rpGroupEditModal',
        resolve: {
          config: function () {
            return {
              group: group,
              activeMember: member
            };
          }
        }
      });

      modalInstance.result.then(function (response) {
        if (response === 'success') {
          vm.dashboardParentCtrl.getGroups();
        }
      });
    }

    function openGroupMemberEditor (member, totalMembers, group) {
      var modalInstance = $uibModal.open({
        component: 'rpGroupMemberEditModal',
        resolve: {
          config: function () {
            return {
              activeMember: member,
              activeGroup: group,
              totalMember: totalMembers
            };
          }
        }
      });
      modalInstance.result.then(function (response) {
        if (response === 'success') {
          vm.dashboardParentCtrl.getGroups();
        }
      });
    }

    function openGroupMemberAdd (group) {
      var modalInstance = $uibModal.open({
        component: 'rpGroupMemberAddModal',
        resolve: {
          config: function () {
            return {
              group: group
            };
          }
        }
      });
      modalInstance.result.then(function (response) {
        if (response === 'success') {
          vm.dashboardParentCtrl.getGroups();
        }
      });
    }

    function resendInvitation (tokenUuid) {
      groupInviteService.resend({
        token: tokenUuid
      }).$promise.then(function () {
        vm.dashboardParentCtrl.getGroups();
        // alert use to sent mail
      }).catch(function () {
        console.log('Invitation sending failed');
      });
    }

    function revokeInvitation (tokenUuid) {
      groupInviteService.revoke({ token: tokenUuid }).$promise.then(function () {
        vm.dashboardParentCtrl.getGroups();
      }).catch(function () {
        console.log('Invitation could not be revoked');
      });
    }
     /*
   * ---------------------------------------------------------
   * Watchers
   * ---------------------------------------------------------
   */
    vm.$onInit = function () {
      $scope.$watchCollection(
        function () {
          return vm.dashboardParentCtrl.groups;
        },
        function () {
          vm.userGroups = vm.dashboardParentCtrl.groups;
        }
      );

      $scope.$watchCollection(
        function () {
          return vm.dashboardParentCtrl.groupInvites;
        },
        function () {
          vm.invitations = vm.dashboardParentCtrl.groupInvites;
          console.log('collab ctrl');
          console.log(vm.invitations);
        }
      );
    };
  }
})();
