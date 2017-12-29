// Namespacing
var JH = JH || {};
JH.Widgets = JH.Widgets || {};

// View model
JH.Widgets.JobMonitoring = function (element, configuration) {
    var self = this;
    
    var defaults = {};
    self.widgetId = element.id;
    self.options = $.extend(defaults, configuration);

    self.loaded = ko.observable(false);

    // Data model
    self.bookingId = $ui.pageContext.frameworkId();
    self.jobIds = ko.observableArray();
};

JH.Widgets.JobMonitoring.prototype.loadAndBind = function () {
    var self = this;

    $ajax.get("/api/bookings/" + self.bookingId + "/jobids/", {}, function (data) {
        self.jobIds(data);
        self.loaded(true);
        $ui.widgets.unlock(self);
    });
};

JH.Widgets.JobMonitoring.prototype.showJobWithMonitoringDetailsWidget = function (jobId) {
    var self = this;

    $ui.widgets.loadWidget("JH.Widgets.JobWithMonitoringDetails", "#jobwithmonitoringdetailswidget_" + jobId,
    {
        withChrome: false
    },
    {
        bookingId: self.bookingId,
        jobId: jobId,
        loadJobMonitoringTasks: true
    },
    function () {
    });
};