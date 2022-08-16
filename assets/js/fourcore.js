// This needs to be changed in order to point towards the proper API
var API = 'https://4rtm.com/api/';

// This value can be entered as null whenever the API points to the proper JSON by default
var current = 'Raptoreum-TESTNET';

    // Function used to format statistics depending on size of variable
    function formatSymbol(value, decimal, unit) {
        if (value === 0) {
            return '0 ' + unit;
        } else {
            var si = [
                { value: 1, symbol: "" },
                { value: 1e3, symbol: "k" },
                { value: 1e6, symbol: "M" },
                { value: 1e9, symbol: "G" },
                { value: 1e12, symbol: "T" },
                { value: 1e15, symbol: "P" },
                { value: 1e18, symbol: "E" },
                { value: 1e21, symbol: "Z" },
                { value: 1e24, symbol: "Y" },
            ];
            for (var i = si.length - 1; i > 0; i--) {
                if (value >= si[i].value) {
                    break;
                }
            }
            return (value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + ' ' + si[i].symbol + unit;
        }
    }

    // Function used to load general statistics
    function loadStatistics() {
        return $.ajax(API + 'pools')
            .done(function (data) {
                $.each(data.pools, function (index, value) {
                    $('#workers').text(formatSymbol(value.poolStats.connectedMiners, 0, ''));
                    $('#pool_hr').text(formatSymbol(value.poolStats.poolHashrate, 1, ' '));
                    $('#global_hr').text(formatSymbol(value.networkStats.networkHashrate, 1, ' '));
                    $('#global_diff').text(formatSymbol(value.networkStats.networkDifficulty, 1, ''));
                });
            });
        }

	// Function used to load the pool graph function
    function loadPoolGraph() {
        return $.ajax(API + 'pools/' + current + '/performance')
            .done(function (data) {
                let new_chart_labels = [];
                let new_chart_data = [];
                $.each(data.stats, function (index, value) {
                    new_chart_data.push(value.poolHashrate);
                    new_chart_labels.push(value.created);
                });
                drawPoolGraph(new_chart_labels, new_chart_data);
            });
    }

	// Private function used to draw the graph information in a line
    function drawPoolGraph(chart_labels, chart_data) {
        var ctx = document.getElementById("hr_chart").getContext('2d');
        var config = {
          type: 'line',
          options: {  
            layout: {
            	padding: 16,
        	},
			responsive: true,
    		maintainAspectRatio: false,
            scales: {
                x: {
                   display: false,
                },
                y: {
                   display: true,
                }
             },
             plugins: {   
                legend: 
                {
                  display: false,
                },
             }
          },
          data: {
            labels: chart_labels,
            datasets: [{
              label: '',
              fill: true,
              backgroundColor: 'transparent',
              borderColor: '#6667AB',
              borderWidth: 2,
              pointRadius: 0,
              data: chart_data,
            }],
          }
        };
        new Chart(ctx, config);
    }

    // Function used to load all miner statistics and create graph
    function loadMinerStatistics(miner) {
			$.ajax(API + 'pools/' + current + '/miners/' + miner)
            .done(function (data) {
                var workerHashRate = 0;
                var workerSharesRate = 0;
                var workerNames = [];
                var hashrateList = [];
				try {
					$.each(data.performance.workers, function (index, value) {
	                if (value) {
	                        workerHashRate += value.hashrate;
	                        workerSharesRate += value.sharesPerSecond;
	                        workerNames.push(index);
                            for (var i=0; i < workerNames.length; i++) {
                                hashrateList[i] = value.hashrate;
                            }
	                    }
	                });
				}

			catch(err) {
				window.alert("Oops, we can't seem to find any information about this miner. Are you sure you have submitted a share?");
				}

                $('#minershares').text(formatSymbol(data.pendingShares, 0, ''));
                $('#minerhashrate').text(formatSymbol(workerHashRate, 2, ' '));
                $('#minerpending').text(formatSymbol(data.pendingBalance, 2, ''));
                $('#minerrewarded').text(formatSymbol(data.totalPaid, 2, ''));
                $('#minerlifetime').text(formatSymbol(data.pendingBalance + data.totalPaid, 2, ''));
                $('#minerworkers').text(formatSymbol(workerNames.length, 0, ''));
                if (workerNames.length != 0) {
                    document.getElementById("workerplaceholder").style.display = "none";
                    for (var i=0; i < workerNames.length; i++) {
                        $('#workerlist').append('<p>' + workerNames[i] + ' is currently contributing ' +formatSymbol(hashrateList[i], 2, 'H/s') + '</p>');
                    }
                }
                
                document.getElementById("graphplaceholder").style.display = "none";

                // This is used to retrieve the information for the line chart
                let new_chart_labels = [];
                let new_chart_data = [];
                $.each(data.performanceSamples, function (index, sample) {
                    if (sample) {
                        let workerHashRateForChart = 0;
                        let workerSharesRateForChart = 0;
                        new_chart_labels.push(sample.created.replace(/:00:00/g, ""))
                        $.each(sample.workers, function (index, worker) {
                            if (worker) {
                                workerHashRateForChart += worker.hashrate;
                                workerSharesRateForChart += worker.sharesPerSecond;
                            }
                        });
                        new_chart_data.push(workerHashRateForChart);
                    }
                });
                drawPoolGraph(new_chart_labels, new_chart_data);
            })
		}