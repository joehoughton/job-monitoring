// Namespacing
var JH = JH || {};
JH.Widgets = JH.Widgets || {};
JH.Widgets.JobMonitoringTasksScope = {};

// View model
JH.Widgets.JobMonitoringTasks = function (element, configuration) {
    var self = this;
    JH.Widgets.JobMonitoringTasksScope = self;

    var defaults = {};
    self.widgetId = element.id;
    self.options = $.extend(defaults, configuration);

    // Data model
    self.bookingId = self.options.bookingId;
    self.jobId = self.options.jobId;
    self.monitoringDetails = self.options.monitoringDetails;
    self.monitoringTasks = ko.observableArray(self.sortTasks(self.options.monitoringTasks(), ["First Contact", "Second Contact", "Final Contact"], "title"));

    self.monitoringTasks().forEach(function (task) {
        task.panelActive = ko.observable(false);
        task.taskDate = ko.observable(self.setTaskDate(task.frameworkTypeSystemName(), self.monitoringDetails.pickUpDateTime(), self.monitoringDetails.pickupAsap()));
        task.requiresMonitoring = ko.observable(self.checkIfTaskRequiresMonitoring(task.taskDate(), self.monitoringDetails.pickupAsap()));
        task.isFlagged = ko.observable(false);
        task.taskDateColour = ko.observable(self.setTaskDateColour(task.requiresMonitoring(), task.isFlagged()));
        task.commentsExist = self.checkIfCommentsExist(task.id());
        task.isFinalContact = task.frameworkTypeSystemName() === "task-job-monitoring-final-contact" ? true : false;
        task.flaggedTaskDetails = {
            username: ko.observable(),
            transitionDateTime: ko.observable()
        };
    });

    self.loaded = ko.observable(false);
};

JH.Widgets.JobMonitoringTasks.prototype.loadAndBind = function () {
    var self = this;

    self.monitoringTasks().forEach(function (task) {
        self.getFlaggedTaskDetails(task)
            .then(self.updateFlaggedTaskDetails);
    });

    self.loaded(true);
};

JH.Widgets.JobMonitoringTasks.prototype.sortTasks = function (tasks, orderToSortTasks, propertyToSortBy) {
    var sortedTasks = _.sortBy(tasks, function (task) {
        return _.indexOf(orderToSortTasks, ko.utils.unwrapObservable(task[propertyToSortBy]()));
    });

    return sortedTasks;
};

JH.Widgets.JobMonitoringTasks.prototype.collapseTask = function (collapseBodyId) {
    if (collapseBodyId.length) {
        $("#" + collapseBodyId).toggle(false);
    }
};

JH.Widgets.JobMonitoringTasks.prototype.setTaskDate = function (frameworkTypeSystemName, taskDate) {
    var newTaskDate;

    switch (frameworkTypeSystemName) {
        case "task-job-monitoring-first-contact":
            newTaskDate = subtractTimeFromDate(taskDate, 1, "days");
            break;
        case "task-job-monitoring-second-contact":
            newTaskDate = subtractTimeFromDate(taskDate, 1, "hours");
            break;
        default:
            newTaskDate = taskDate;
    }

    function subtractTimeFromDate(date, value, unit) {
        var taskDateMoment = moment(date);
        var taskDateWithTimeSubtracted = moment(taskDateMoment).subtract(value, unit);
        var formattedDate = taskDateWithTimeSubtracted.toDate().toISOString();
        var formattedDateWithoutMilliseconds = formattedDate.split(".")[0] + "Z";

        return formattedDateWithoutMilliseconds;
    };

    return newTaskDate;
};

JH.Widgets.JobMonitoringTasks.prototype.checkIfTaskRequiresMonitoring = function (taskDateTime, pickupAsap) {
    var taskRequiresMonitoring, differenceInMinutes;
    var now = moment();
    var taskDateTimeMoment = moment(taskDateTime);

    if (pickupAsap) {
        var twentyMinutesAfterPickUpDateTime = moment(taskDateTimeMoment).add(20, "minutes");
        differenceInMinutes = moment.duration(now.diff(twentyMinutesAfterPickUpDateTime)).asMinutes();
        taskRequiresMonitoring = differenceInMinutes >= 0 ? true : false;
    } else {
        var tenMinutesBeforeTaskDate = moment(taskDateTimeMoment).subtract(10, "minutes");
        differenceInMinutes = moment.duration(now.diff(tenMinutesBeforeTaskDate)).asMinutes();
        taskRequiresMonitoring = differenceInMinutes >= 0 ? true : false;
    }

    return taskRequiresMonitoring;
};

JH.Widgets.JobMonitoringTasks.prototype.setTaskDateColour = function (requiresMonitoring, isFlagged) {
    var taskDateColour;

    if (isFlagged) {
        taskDateColour = "task-date-colour-green";
    } else {
        taskDateColour = requiresMonitoring ? "task-date-colour-amber" : "task-date-colour-black";
    }

    return taskDateColour;
};

JH.Widgets.JobMonitoringTasks.prototype.checkIfCommentsExist = function (taskId) {
    var result = ko.observable();

    var request = {
        startPage: 1,
        endPage: 1,
        rowsPerPage : 5,
        frameworkIds: [taskId],
        showDescendantsComments: true
    };

    $ajax.post("/api/comments/list", request, function (data) {
        result(data.rows.length > 0 ? true: false);
    });

    return result;
};

JH.Widgets.JobMonitoringTasks.prototype.flagTaskAsTracked = function (task) {
    var self = JH.Widgets.JobMonitoringTasksScope;

    var flagTask = function (task) {
        return new Promise(function(resolve, reject) {
            var toPhaseSystemName = task.phaseSystemName().replace("incomplete", "complete");

            $ajax.post("/api/framework/" + task.id() + "/setPhase/" + toPhaseSystemName, {}, function () {
                $ui.events.broadcast("framework.updated");
                resolve(task);
            });
        });
    };

    flagTask(task)
        .then(self.getFlaggedTaskDetails)
        .then(self.updateFlaggedTaskDetails);
};

JH.Widgets.JobMonitoringTasks.prototype.getFlaggedTaskDetails = function (task) {
    var self = this;

    return new Promise(function (resolve, reject) {
        $ui.widgets.lock(self);

        $ajax.get("/api/framework/" + task.id() + "/getLatestPhaseHistory", {}, function (data) {
            $ui.widgets.unlock(self);

            if (data) {
                resolve([data, task]);
            }
        });
    });
};

JH.Widgets.JobMonitoringTasks.prototype.updateFlaggedTaskDetails = function (result) {
    var self = JH.Widgets.JobMonitoringTasksScope;

    var data = result[0];
    var task = result[1];

    return new Promise(function (resolve, reject) {
        if (_.isEmpty(data)) {
            task.isFlagged(false);
        } else {
            task.flaggedTaskDetails.username(data.username);
            task.flaggedTaskDetails.transitionDateTime(data.transitionDateTime);
            task.isFlagged(data.toPhaseSystemName.includes("-complete") ? true : false);
            task.requiresMonitoring(self.checkIfTaskRequiresMonitoring(task.taskDate(), self.monitoringDetails.pickupAsap()));
        }

        task.taskDateColour(self.setTaskDateColour(task.requiresMonitoring(), task.isFlagged()));
        resolve();
    });
};

JH.Widgets.JobMonitoringTasks.prototype.loadTaskComments = function (taskId) {
    $ui.widgets.loadWidget("Framework.Widgets.Comments", "#comments-widget-host_" + taskId,
    {
        withChrome: false
    },
    {
        frameworkId: taskId
    },
    function () {
    });
};

JH.Widgets.JobMonitoringTasks.prototype.openJobMonitoringPanel = function (task, isFinalContactForFlagging) {
    var self = this;

    $ui.stacks.openPanel("JH.Panels.JobMonitoringTask",
    {
        task: task,
        bookingId: self.bookingId,
        jobId: self.jobId,
        vehicleFulfillmentId: self.monitoringDetails.vehicleFulfillmentId(),
        supplierId: self.monitoringDetails.supplierId(),
        isFinalContactForFlagging: isFinalContactForFlagging
    },
    {
        closing: function (result) {
            task.commentsExist(true);

            if (isFinalContactForFlagging) {
                self.flagTaskAsTracked(result.task);
            }
        }
    });
};

JH.Widgets.JobMonitoringTasks.prototype.unflagFlaggedTask = function (task) {
    var self = JH.Widgets.JobMonitoringTasksScope;

    var unflagTask = function (task) {
        return new Promise(function (resolve, reject) {
            var toPhaseSystemName = task.phaseSystemName().replace("-complete", "-incomplete");

            $ajax.post("/api/framework/" + task.id() + "/setPhase/" + toPhaseSystemName, {}, function () {
                $ui.events.broadcast("framework.updated");
                resolve(task);
            });
        });
    };

    unflagTask(task)
        .then(self.getFlaggedTaskDetails)
        .then(self.updateFlaggedTaskDetails);
};