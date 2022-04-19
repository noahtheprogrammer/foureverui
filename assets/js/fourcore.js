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
                $('#pool_hr').text(formatSymbol(value.poolStats.poolHashrate, 3, 'H/s'));
                $('#global_hr').text(formatSymbol(value.networkStats.networkHashrate, 3, 'H/s'));
                $('#global_diff').text(formatSymbol(value.networkStats.networkDifficulty, 3, ''));
            });
        });
    }

    function loadPoolStatistics() {
        return $.ajax(API + 'pools/' + current + '/performance')
            .done(function (data) {
                let new_chart_labels = [];
                let new_chart_data = [];
                $.each(data.stats, function (index, value) {
                    new_chart_data.push(value.poolHashrate);
                    new_chart_labels.push(value.created);
                });
                redrawChartBig1(new_chart_labels, new_chart_data);
            });
    };

    function loadPoolStatistics() {
        return $.ajax(API + 'pools/' + current + '/performance')
            .done(function (data) {
                let new_chart_labels = [];
                let new_chart_data = [];
                $.each(data.stats, function (index, value) {
                    new_chart_data.push(value.poolHashrate);
                    new_chart_labels.push(value.created);
                });
                redrawChartBig1(new_chart_labels, new_chart_data);
            });
    };

    function redrawChartBig1(chart_labels, chart_data) {
        var ctx = document.getElementById("poolhr_chart").getContext('2d');

        var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    
        gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
        gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
        gradientStroke.addColorStop(0, 'rgba(119,52,169,0)');
        var config = {
          type: 'line',
          data: {
            labels: chart_labels,
            datasets: [{
              label: '',
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: '#d346b1',
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: '#d346b1',
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: '#d346b1',
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 0,
              data: chart_data,
            }]
          }
        };
        new Chart(ctx, config);
    }