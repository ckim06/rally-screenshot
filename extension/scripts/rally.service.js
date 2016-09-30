'use strict';
rallyService.$inject = ['$http', '$q'];

function rallyService($http, $q) {
  var service = this;
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
      $http.get(AUTH_URL).then(function (result) {
        var defectUrl = CREATE_DEFECT_URL;
        if (result.data.OperationResult) {
          defectUrl = defectUrl + '?key=' + result.data.OperationResult.SecurityToken;
        }

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
      $http.get(AUTH_URL).then(function (result) {
        var contentUrl = CREATE_ATTACHMENT_CONTENT_URL;
        if (result.data.OperationResult) {
          contentUrl = contentUrl + '?key=' + result.data.OperationResult.SecurityToken;
        }
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
      $http.get(AUTH_URL).then(function (result) {
        var attachmentUrl = CREATE_ATTACHMENT_URL;
        if (result.data.OperationResult) {
          attachmentUrl = attachmentUrl + '?key=' + result.data.OperationResult.SecurityToken;
        }
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
