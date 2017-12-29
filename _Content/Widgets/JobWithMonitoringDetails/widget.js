// Namespacing
var JH = JH || {};
JH.Widgets = JH.Widgets || {};

// View model
JH.Widgets.JobWithMonitoringDetails = function (element, configuration) {
    var self = this;

    var defaults = {};
    self.widgetId = element.id;
    self.options = $.extend(defaults, configuration);

    self.loaded = ko.observable(false);

    // Data model
    self.bookingId = self.options.bookingId;
    self.jobId = self.options.jobId;
    self.loadJobMonitoringTasks = ko.observable(false);
    self.job = {
        monitoringDetails: {
            clientName: ko.observable(),
            clientPassword: ko.observable(),
            passengerLeadPassengerName: ko.observable(),
            pickupAsap: ko.observable(),
            pickUpDateTime: ko.observable(),
            supplierAccountNumber: ko.observable(),
            supplierId: ko.observable(),
            supplierName: ko.observable(),
            supplierTelephoneNumber: ko.observable(),
            vehicleFulfillmentId: ko.observable()
        },
        bookingLocation: {
            locationFrom: ko.observable(),
            locationTo: ko.observable()
        },
        monitoringTasks: ko.observableArray(),
        title: ko.pureComputed(function () {
            var job = self.job.monitoringDetails;
            return job.supplierName() + " (" + job.supplierAccountNumber() + ")";
        })
    };
};

JH.Widgets.JobWithMonitoringDetails.prototype.loadAndBind = function () {
    var self = this;

    $ui.widgets.lock(self);

    $ajax.get("/api/bookings/" + self.bookingId + "/jobMonitoring/" + self.jobId, {}, function (data) {
        ko.mapping.fromJS(data.monitoringDetails, {}, self.job.monitoringDetails);
        ko.mapping.fromJS(data.bookingLocation, {}, self.job.bookingLocation);
        ko.mapping.fromJS(data.monitoringTasks, {}, self.job.monitoringTasks);

        self.loadJobMonitoringTasks(self.options.loadJobMonitoringTasks || false);

        self.loaded(true);
        $ui.widgets.unlock(self);
    });
};

JH.Widgets.JobWithMonitoringDetails.prototype.showJobMonitoringTasksWidget = function () {
    var self = this;

    $ui.widgets.loadWidget("JH.Widgets.JobMonitoringTasks", "#jobmonitoringtaskswidget_" + self.jobId,
    {
        withChrome: false
    },
    {
        bookingId: self.bookingId,
        jobId: self.jobId,
        monitoringDetails: self.job.monitoringDetails,
        monitoringTasks: self.job.monitoringTasks
    },
    function () {
    });
};
