// Namespacing
var JH = JH || {};
JH.Panels = JH.Panels || {};
JH.Panels.panelScope = {};

// View model
JH.Panels.JobMonitoringTask = function (element, configuration) {
    var self = this;
    JH.Panels.panelScope = self;

    var defaults = {};
    self.options = $.extend(defaults, configuration, configuration.options);

    // Data model
    self.task = self.options.task;
    self.bookingId = self.options.bookingId;
    self.jobId = self.options.jobId;
    self.vehicleFulfillmentId = self.options.vehicleFulfillmentId;
    self.supplierId = self.options.supplierId;
    self.isFinalContactForFlagging = self.options.isFinalContactForFlagging;
    self.finalContactSelectMenu = ko.observableArray();
    self.selectedSelectMenuName = ko.observable();
    self.comment = ko.observable();

    // Validation
    self.validation = {
        finalContactSelectMenu: Validator.required(self, self.selectedSelectMenuName, "A reason is required to mark the final contact task as complete"),
        comment: Validator.required(self, self.comment, "A comment is required")
    };

    self.validation.isValidForm = ko.pureComputed(function () {
        var count = 0;

        if (self.isFinalContactForFlagging && self.validation.finalContactSelectMenu()) count++;
        if (self.validation.comment()) count++;

        return count === 0;
    });
};

JH.Panels.JobMonitoringTask.prototype.loadAndBind = function () {
    var self = this;

    self.getFinalContactSelectMenuValues();
};

JH.Panels.JobMonitoringTask.prototype.getFinalContactSelectMenuValues = function () {
    var self = this;

    $ui.startWaiting();

    $ajax.get("/api/selectMenus/job-monitoring-status-types", {}, function (data) {
        self.finalContactSelectMenu(data);
        $ui.stopWaiting();
    });
};

JH.Panels.JobMonitoringTask.prototype.save = function () {
    var self = this;

    if (self.isFinalContactForFlagging) {
        self.saveMonitoringStatus()
            .then(self.saveComment())
            .then(self.closeForm());
    } else {
        self.saveComment();
        self.closeForm();
    }
};

JH.Panels.JobMonitoringTask.prototype.saveMonitoringStatus = function () {
    var self = JH.Panels.panelScope;

    return new Promise(function (resolve, reject) {
        $ui.stacks.lock(self);

        var postModel = {
            "Id": self.jobId,
            "VehicleFulfillmentId": self.vehicleFulfillmentId,
            "SupplierId": self.supplierId,
            "MonitoringStatus": self.selectedSelectMenuName()
        };

        $ajax.post("/api/jobs/" + self.jobId + "/updateJob", postModel, function (data) {
            $ui.stacks.unlock(self);
            if (JSON.stringify(data) !== false) {
                resolve();
            } else {
                reject(new Error("Failed to set Monitoring Status for job id: " + self.jobId));
            }
        });
    });
};

JH.Panels.JobMonitoringTask.prototype.saveComment = function () {
    var self = this;

    $ui.stacks.lock(self);

    $ajax.post("/api/framework/" + self.task.id() + "/comments/", { comment: self.comment() }, function () {
        self.comment("");
        $ui.stacks.unlock(self);
    });
};

JH.Panels.JobMonitoringTask.prototype.cancelForm = function () {
    var self = this;

    $ui.stacks.cancel(self);
};

JH.Panels.JobMonitoringTask.prototype.closeForm = function () {
    var self = this;

    $ui.stacks.close(self,
    {
        task: self.task
    });
};