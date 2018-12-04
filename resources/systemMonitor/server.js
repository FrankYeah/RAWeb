function pageHandler(pageName) {

    var restartEnabled = (pageName === "RestartService");

    var doRestart = function(nodeName) {
        var ajaxData = {node: nodeName};
        $.ajax({
            type: 'POST',
            url: 'nodeRestart',
            contentType : 'application/json',
            data: JSON.stringify(ajaxData),
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            BootstrapDialog.show({
                message: "重啟成功 !"
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            ShowExceptionDialog(jqXHR.responseText);
        });
    };

    var createMonitorBlock = function(nodeName, status, serverType, restart) {
        var imagePath = fubon.contextPath + "/resources/picture/systemMonitor/";
        var appendRestartBtn = function($container){
            if (restart) {
                var $restartBtn = $('<button type="button" class="btn btn-primary"/>').html("重啟服務");
                $restartBtn.click(function () {
                    doRestart(nodeName);
                });
                $restartBtn = $("<div/>").append($restartBtn);
                $container.append($restartBtn);
            }
        };
        return function() {
            var lightFilename = status ? "green.png" : "red.png";
            var serverFilename;
            if (serverType=="database") {
                serverFilename = "db.png";
            } else if (serverType=="api") {
                serverFilename = "api.png";
            } else {
                serverFilename = "web.png";
            }

            var $light = $('<img class="server_img1" alt="*" width="50%",height="50%"/>')
                                .attr("src", imagePath + lightFilename);
            var $server = $('<img class="server_img2" alt="*"/>')
                                .attr("src", imagePath + serverFilename);

            var $result = $("<div class='server_wrapper'/>");
            $result.append( $("<div/>").append($light) );
            $result.append( $("<div/>").append($server) );
            appendRestartBtn($result);
            $result.append( $("<div/>").html(nodeName) );
			return $result;
		};
    };

    var createMonitorBlocks = function(type, config, restart) {
        return function(updater) {
            for (var name in config) {
                var status = config[name];
                var $block = createMonitorBlock(name, status, type, restart);
                if (updater)
                    updater($block);
            }
        }
    };

    var buildWebMonitorBlocks = function(config, restart) {
        return function(updater) {
            createMonitorBlocks("web", config, restart)(updater);
        }
    };

    var buildApiMonitorBlocks = function(config, restart) {
        return function(updater) {
            createMonitorBlocks("api", config, restart)(updater);
        }
    };

    var buildDatabaseMonitorBlocks = function(config, restart) {
        return function(updater) {
            createMonitorBlocks("database", config, restart)(updater);
        }
    };

    var currentDateTimeStr = function() {
        return  new Date().toLocaleString();
    };

    var updateSystemStatus = function(doLog) {
        $(".date_wrapper>span").html( currentDateTimeStr );

        $('.web_wrapper, .api_wrapper, .database_wrapper').empty();

        var ajaxData = {adminLog: doLog};
        $.ajax({
            type: 'POST',
            url: 'getSystemMonitor',
            contentType : 'application/json',
            data: JSON.stringify(ajaxData),
            dataType: 'json',
            success: function(respData) {
                buildWebMonitorBlocks(respData.web, restartEnabled)(function($block) {
                    $('.web_wrapper').append($block);
                });

                buildApiMonitorBlocks(respData.api, restartEnabled)(function($block) {
                    $('.api_wrapper').append($block);
                });

                buildDatabaseMonitorBlocks(respData.database, false)(function($block) {
                    $('.database_wrapper').append($block);
                });
            }
        });
    };

    var scheduleUpdate = function() {
        var interval = 60 * 1000;
        return setInterval(function() {
            updateSystemStatus(false);
        }, interval);
    };

    var timer = scheduleUpdate();

    updateSystemStatus(!restartEnabled);

    $(".refresh_btn").on("click", function() {
        updateSystemStatus(!restartEnabled);

		clearInterval(timer);
        timer = scheduleUpdate();
	});

}
