var getPoolStatsAjax, getPoolBlockByIdAjax, getPoolPaymentByIdAjax, getWalletStatsAjax, getWalletPaymentByIdAjax;
var getAmountOfCalculationPossibility;
var parseHashRate, parseBalance, parseTimeAgo, parseDuration, parseBlockHash, parseTransactionHash;

(function ($) {

    var GET_POOL_STATS_API = "get_pool_stats";
    var GET_POOL_BLOCK_BY_ID_API = "get_pool_block_by_id";
    var GET_POOL_PAYMENT_BY_ID_API = "get_pool_payment_by_id";

    var GET_WALLET_STATS_API = "get_wallet_stats";
    var GET_WALLET_PAYMENT_BY_ID_API = "get_wallet_payment_by_id";

    getPoolStatsAjax = function () {
        return $.getJSON(miningPoolApi + GET_POOL_STATS_API);
    };

    getPoolBlockByIdAjax = function (id) {
        return $.getJSON(miningPoolApi + GET_POOL_BLOCK_BY_ID_API + "|" + id);
    };

    getPoolPaymentByIdAjax = function (id) {
        return $.getJSON(miningPoolApi + GET_POOL_PAYMENT_BY_ID_API + "|" + id);
    };

    getWalletStatsAjax = function (address) {
        return $.getJSON(miningPoolApi + GET_WALLET_STATS_API + "|" + address);
    };

    getWalletPaymentByIdAjax = function (address, id) {
        return $.getJSON(miningPoolApi + GET_WALLET_PAYMENT_BY_ID_API + "|" + address + "|" + id);
    };

    getAmountOfCalculationPossibility = function (networkDifficulty) {
        networkDifficulty = parseInt(networkDifficulty, 10);

        if (isNaN(networkDifficulty)) {
            networkDifficulty = 0;
        }

        var mathOperator = 5; // Always { + / * % - }.
        var minRange = 2; // Always.

        return (networkDifficulty / minRange) * mathOperator;
    };

    parseHashRate = function (hashRate) {
        var currentHashRate = parseFloat(hashRate);

        if (isNaN(currentHashRate)) {
            currentHashRate = 0;
        }

        var hashRateSymbol = [' H/s', ' KH/s', ' MH/s', ' GH/s', ' TH/s', ' PH/s'];
        var index = 0;

        while (currentHashRate >= 1000) {
            currentHashRate /= 1000;
            index++;
        }

        return currentHashRate.toFixed(2) + hashRateSymbol[index];
    };

    parseBalance = function (balance) {
        var currentBalance = parseFloat(balance);

        if (isNaN(currentBalance)) {
            currentBalance = 0;
        }

        return currentBalance.toFixed(coinDecimalPlaces) + " " + coinSymbol;
    };

    parseTimeAgo = function (time) {
        var currentTime = parseInt(time, 10);

        if (isNaN(currentTime)) {
            currentTime = -1;
        }

        if (currentTime < 0) {
            return "never";
        }

        var timeAgo = Math.floor(Date.now() / 1000) - currentTime;

        if (timeAgo < 60) {
            return "about a minute ago";
        } else if (timeAgo >= 60 && timeAgo < 3600) {
            timeAgo = (timeAgo / 60);

            if (timeAgo < 2) {
                return "about " + timeAgo.toFixed(0) + " minute ago";
            } else {
                return "about " + timeAgo.toFixed(0) + " minutes ago";
            }
        } else if (timeAgo >= 3600 && timeAgo < 84600) {
            timeAgo = (timeAgo / 3600);

            if (timeAgo < 2) {
                return "about " + timeAgo.toFixed(0) + " hour ago";
            } else {
                return "about " + timeAgo.toFixed(0) + " hours ago";
            }
        } else if (timeAgo >= 84600 && timeAgo < 592200) {
            timeAgo = (timeAgo / 84600);

            if (timeAgo < 2) {
                return "about " + timeAgo.toFixed(0) + " day ago";
            } else {
                return "about " + timeAgo.toFixed(0) + " days ago";
            }
        } else if (timeAgo >= 592200 && timeAgo < 2368800) {
            timeAgo = (timeAgo / 592200);

            if (timeAgo < 2) {
                return "about " + timeAgo.toFixed(0) + " week ago";
            } else {
                return "about " + timeAgo.toFixed(0) + " weeks ago";
            }
        } else if (timeAgo >= 2368800 && timeAgo < 28425600) {
            timeAgo = (timeAgo / 2368800);

            if (timeAgo < 2) {
                return "about " + timeAgo.toFixed(0) + " month ago";
            } else {
                return "about " + timeAgo.toFixed(0) + " months ago";
            }
        } else if (timeAgo >= 28425600) {
            timeAgo = (timeAgo / 28425600);

            if (timeAgo < 2) {
                return "about " + timeAgo.toFixed(0) + " year ago";
            } else {
                return "about " + timeAgo.toFixed(0) + " years ago";
            }
        }
    };

    parseDuration = function (time) {
        var currentTime = parseFloat(time);

        if (isNaN(currentTime)) {
            currentTime = -1;
        }

        if (currentTime < 0) {
            return "never";
        } else if (currentTime < 60) {
            if (currentTime < 2) {
                return currentTime.toFixed(0) + " second";
            } else {
                return currentTime.toFixed(0) + " seconds";
            }
        } else if (currentTime >= 60 && currentTime < 3600) {
            currentTime = (currentTime / 60);

            if (currentTime < 2) {
                return currentTime.toFixed(0) + " minute";
            } else {
                return currentTime.toFixed(0) + " minutes";
            }
        } else if (currentTime >= 3600 && currentTime < 84600) {
            currentTime = (currentTime / 3600);

            if (currentTime < 2) {
                return currentTime.toFixed(0) + " hour";
            } else {
                return currentTime.toFixed(0) + " hours";
            }
        } else if (currentTime >= 84600 && currentTime < 592200) {
            currentTime = (currentTime / 84600);

            if (currentTime < 2) {
                return currentTime.toFixed(0) + " day";
            } else {
                return currentTime.toFixed(0) + " days";
            }
        } else if (currentTime >= 592200 && currentTime < 2368800) {
            currentTime = (currentTime / 592200);

            if (currentTime < 2) {
                return currentTime.toFixed(0) + " week";
            } else {
                return currentTime.toFixed(0) + " weeks";
            }
        } else if (currentTime >= 2368800 && currentTime < 28425600) {
            currentTime = (currentTime / 2368800);

            if (currentTime < 2) {
                return currentTime.toFixed(0) + " month";
            } else {
                return currentTime.toFixed(0) + " months";
            }
        } else if (currentTime >= 28425600) {
            currentTime = (currentTime / 28425600);

            if (currentTime < 2) {
                return currentTime.toFixed(0) + " year";
            } else {
                return currentTime.toFixed(0) + " years";
            }
        }
    };

    parseBlockHash = function (hash) {
        return '<a href="' + blockExplorerApi + hash + '" target="_blank">' + hash + "</a>";
    };

    parseTransactionHash = function (hash) {
        return '<a href="' + transactionExplorerApi + hash + '" target="_blank">' + hash + "</a>";
    };

})(jQuery);