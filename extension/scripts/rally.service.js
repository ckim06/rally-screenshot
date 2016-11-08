'use strict';
rallyService.$inject = ['$http', '$q'];

function rallyService($http, $q) {
  var service = this;
  service.savedLogin = '';
  service.savedPassword = '';

  service.login = function (login, password) {
    service.savedLogin = login;
    service.savedPassword = password;
    return authenticate();
  };

  function authenticate() {
    AUTH_URL = AUTH_URL.replace('<LOGIN>', service.savedLogin).replace('<PASSWORD>', service.savedPassword);

    return $q(function (resolve, reject) {
      $http.get(AUTH_URL).then(function (result) {
        if (result.data.OperationResult) {
          resolve(result);
        } else {
          reject('Cannot login');
        }
      }, function (reason) {
        reject(reason);
      });
    });
  }

  service.create = function (defect) {

    var createDefectData = {
      Defect: {
        name: defect.name,
        description: defect.description
      }
    };

    var createAttachmentContentData = {
      attachmentContent: {
        content: defect.screenshot
      }
    };

    var createAttachmentData = {
      attachment: {
        Name: 'screenshot.jpg',
        ContentType: 'image/jpeg'
      }
    };

    return $q(function (resolve, reject) {
      service.createDefect(createDefectData).then(function (defectResult) {
        service.createAttachmentContent(createAttachmentContentData).then(function (contentResult) {
          createAttachmentData.attachment.artifact = defectResult._ref;
          createAttachmentData.attachment.Content = contentResult._ref;
          service.createAttachment(createAttachmentData).then(function (attachmentResult) {
            resolve("success");
          });
        });
      });
    });
  };

  service.createDefect = function (createDefectData) {
    return $q(function (resolve, reject) {
      authenticate().then(function (result) {
        var defectUrl = CREATE_DEFECT_URL;

        defectUrl = defectUrl + '?key=' + result.data.OperationResult.SecurityToken;


        $http.post(defectUrl, createDefectData).then(function (result) {
          resolve(result.data.CreateResult.Object);
        }, function (reason) {
          reject(reason);
        });
      }, function (reason) {
        reject(reason);
      });
    });
  };

  service.createAttachmentContent = function (createAttachmentContentData) {
    createAttachmentContentData.attachmentContent.content = createAttachmentContentData.attachmentContent.content.replace('data:image/jpeg;base64,', '');
    return $q(function (resolve, reject) {
      authenticate().then(function (result) {
        var contentUrl = CREATE_ATTACHMENT_CONTENT_URL;

        contentUrl = contentUrl + '?key=' + result.data.OperationResult.SecurityToken;

        $http.post(contentUrl, createAttachmentContentData).then(function (result) {
          resolve(result.data.CreateResult.Object);
        }, function (reason) {
          reject(reason);
        });
      }, function (reason) {
        reject(reason);
      });
    });
  };

  service.createAttachment = function (createAttachmentData) {
    return $q(function (resolve, reject) {
      authenticate().then(function (result) {
        var attachmentUrl = CREATE_ATTACHMENT_URL;

        attachmentUrl = attachmentUrl + '?key=' + result.data.OperationResult.SecurityToken;

        $http.post(attachmentUrl, createAttachmentData).then(function (result) {
          resolve(result.data.CreateResult.Object);
        }, function (reason) {
          reject(reason);
        });
      }, function (reason) {
        reject(reason);
      });
    });
  };

  return service;
}
