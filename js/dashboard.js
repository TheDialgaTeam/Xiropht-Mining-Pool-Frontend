(function ($) {

    var networkHashrate = $('.networkHashrate');
    var poolHashrate = $('.poolHashrate');
    var version = $('.version');
    var poolTotalBlockFound = $('.poolTotalBlockFound');
    var networkDifficulty = $('.networkDifficulty');
    var networkHeight = $('.networkHeight');
    var networkLastBlockReward = $('.networkLastBlockReward');
    var poolTotalMinerConnected = $('.poolTotalMinerConnected');
    var poolTotalWorkerConnected = $('.poolTotalWorkerConnected');
    var poolFee = $('.poolFee');
    var poolMinimumPayment = $('.poolMinimumPayment');
    var poolStatus = $('.poolStatus');
    var poolLastBlockFoundDateAgo = $('.poolLastBlockFoundDateAgo');
    var networkLastBlockHash = $('.networkLastBlockHash');
    var networkLastBlockFoundTimestampAgo = $('.networkLastBlockFoundTimestampAgo');
    var poolBlockFoundEvery = $('.poolBlockFoundEvery');

    var walletTotalBalance = $('.walletTotalBalance');
    var walletTotalPaid = $('.walletTotalPaid');
    var walletTotalHashrate = $('.walletTotalHashrate');
    var walletTotalGoodShare = $('.walletTotalGoodShare');
    var walletTotalInvalidShare = $('.walletTotalInvalidShare');
    var walletTotalPayment = $('.walletTotalPayment');

    // Input form
    var walletAddress = $('#walletAddress');
    var currentWalletAddress = null;

    // Wallet information
    var walletStats = $('.walletStats');
    var walletStatsLoading = $('.walletStatsLoading');

    // Wallet event
    var walletStatsUpdateEvent = null;

    // Payment information
    var walletPaymentInformation = $('.walletPaymentInformation');
    var walletPaymentCurrentMaxIndex = 0;
    var walletPaymentDownloadedMaxIndex = 0;
    var walletPaymentDownloaded = 0;
    var walletPaymentMaxToDownload = 10;

    function getPoolStats() {
        getPoolStatsAjax().done(function (data) {
            networkHashrate.html(parseHashRate(data.network_hashrate));
            poolHashrate.html(parseHashRate(data.pool_hashrate));
            version.html(data.version);
            poolTotalBlockFound.html(data.pool_total_block_found);
            networkDifficulty.html(data.network_difficulty);
            networkHeight.html(data.network_height);
            networkLastBlockReward.html(parseBalance(data.network_last_block_reward));
            poolTotalMinerConnected.html(data.pool_total_miner_connected);
            poolTotalWorkerConnected.html(data.pool_total_worker_connected);
            poolFee.html(data.pool_fee + '%');
            poolMinimumPayment.html(parseBalance(data.pool_minimum_payment));
            poolStatus.html('ONLINE');
            poolLastBlockFoundDateAgo.html(parseTimeAgo(data.pool_last_block_found_date));
            networkLastBlockHash.html(parseBlockHash(data.network_last_block_hash));
            networkLastBlockFoundTimestampAgo.html(parseTimeAgo(data.network_last_block_found_timestamp));
            poolBlockFoundEvery.html(parseDuration((getAmountOfCalculationPossibility(data.network_difficulty) / parseFloat(data.pool_hashrate)) * 60 * 24));
        });
    }

    function getWalletStats() {
        var ajax = getWalletStatsAjax(currentWalletAddress);

        ajax.done(function (data) {
            if (data.result != null) {
                Cookies.remove('mining_address')

                if (walletStatsUpdateEvent != null) {
                    clearInterval(walletStatsUpdateEvent);
                }

                return;
            }

            walletStats.addClass('active');
            Cookies.set('mining_address', currentWalletAddress, {expires: Infinity});

            walletTotalBalance.html(parseBalance(data.wallet_total_balance));
            walletTotalPaid.html(parseBalance(data.wallet_total_paid));
            walletTotalHashrate.html(parseHashRate(data.wallet_total_hashrate));
            walletTotalGoodShare.html(data.wallet_total_good_share);
            walletTotalInvalidShare.html(data.wallet_total_invalid_share);
            walletTotalPayment.html(data.wallet_total_payment);

            walletPaymentCurrentMaxIndex = data.wallet_total_payment;
            checkWalletPayment();
        });

        ajax.always(function () {
            walletStatsLoading.removeClass('active');
        });
    }

    function getWalletPayment(id) {
        var ajax = getWalletPaymentByIdAjax(currentWalletAddress, id);

        ajax.done(function (data) {
            var newRow = document.createElement("tr");

            var newDataId = document.createElement("th");
            newDataId.setAttribute('scope', 'row');
            newDataId.appendChild(document.createTextNode(id));

            var newDataDate = document.createElement("td");
            newDataDate.appendChild(document.createTextNode(new Date(data.payment_date_sent * 1000).toLocaleString()));

            var newDataTxHash = document.createElement("td");
            newDataTxHash.setAttribute('class', 'paymentHash');
            newDataTxHash.innerHTML = parseTransactionHash(data.payment_hash);

            var newDataAmount = document.createElement("td");
            newDataAmount.appendChild(document.createTextNode(parseBalance(data.payment_amount)));

            var newDataFee = document.createElement("td");
            newDataFee.appendChild(document.createTextNode(parseBalance(data.payment_fee)));

            newRow.appendChild(newDataId);
            newRow.appendChild(newDataDate);
            newRow.appendChild(newDataTxHash);
            newRow.appendChild(newDataAmount);
            newRow.appendChild(newDataFee);

            doInsertionSort(walletPaymentInformation, newRow, walletPaymentMaxToDownload);
        });
    }

    function checkWalletPayment() {
        if (walletAddress.val() == "") {
            return;
        }

        if (walletPaymentDownloaded === 0) {
            var maxIndex = walletPaymentCurrentMaxIndex;

            // First time downloading, let's download to 10.
            for (var i = 0; i < walletPaymentMaxToDownload; i++) {
                // If you have downloaded all of the possible payment, stop.
                if (walletPaymentDownloaded > maxIndex) {
                    break;
                }

                if (maxIndex - i < 1) {
                    break;
                }

                getWalletPayment(maxIndex - i);
                walletPaymentDownloaded++;

                if (walletPaymentDownloaded > walletPaymentMaxToDownload) {
                    walletPaymentDownloaded = walletPaymentMaxToDownload;
                }
            }

            walletPaymentDownloadedMaxIndex = maxIndex;
            return;
        }

        if (walletPaymentCurrentMaxIndex !== walletPaymentDownloadedMaxIndex) {
            var maxIndex = walletPaymentCurrentMaxIndex;

            for (var i = parseInt(walletPaymentDownloadedMaxIndex, 10) + 1; i <= maxIndex; i++) {
                getWalletPayment(i);
                walletPaymentDownloaded++;

                if (walletPaymentDownloaded > walletPaymentMaxToDownload) {
                    walletPaymentDownloaded = walletPaymentMaxToDownload;
                }
            }

            walletPaymentDownloadedMaxIndex = maxIndex;
            return;
        }

        if (walletPaymentDownloaded < walletPaymentMaxToDownload) {
            for (var i = walletPaymentDownloaded; i <= walletPaymentMaxToDownload; i++) {
                if (walletPaymentDownloadedMaxIndex - walletPaymentDownloaded === 0) {
                    break;
                }

                getWalletPayment(walletPaymentDownloadedMaxIndex - walletPaymentDownloaded);
                walletPaymentDownloaded++;

                if (walletPaymentDownloaded > walletPaymentMaxToDownload) {
                    walletPaymentDownloaded = walletPaymentMaxToDownload;
                }
            }
        }
    }

    function checkWalletAddress() {
        if (walletAddress.val() == "") {
            return;
        }

        if (currentWalletAddress == walletAddress.val()) {
            return;
        }

        currentWalletAddress = walletAddress.val();

        if (walletStatsUpdateEvent != null) {
            clearInterval(walletStatsUpdateEvent);
        }

        walletStatsLoading.addClass('active');
        walletStats.removeClass('active');

        getWalletStats();
        walletStatsUpdateEvent = setInterval(getWalletStats, 5000);
    }

    function onLookupClick() {
        checkWalletAddress();
    }

    function onWalletAddressKeyUp(e) {
        if (e.which === 13) {
            checkWalletAddress();
        }
    }

    $(document).ready(function () {
        networkHashrate.html(parseHashRate(0));
        poolHashrate.html(parseHashRate(0));
        version.html('0.0.0.0');
        poolTotalBlockFound.html(0);
        networkDifficulty.html(0);
        networkHeight.html(0);
        networkLastBlockReward.html(parseBalance(0));
        poolTotalMinerConnected.html(0);
        poolTotalWorkerConnected.html(0);
        poolFee.html(0 + '%');
        poolMinimumPayment.html(parseBalance(0));
        poolStatus.html('OFFLINE');
        poolLastBlockFoundDateAgo.html(parseTimeAgo(-1));
        poolBlockFoundEvery.html(parseDuration(-1));
        networkLastBlockHash.html('NOTHING');
        networkLastBlockFoundTimestampAgo.html(parseTimeAgo(-1));

        walletTotalBalance.html(parseBalance(0));
        walletTotalPaid.html(parseBalance(0));
        walletTotalHashrate.html(parseHashRate(0));
        walletTotalGoodShare.html(0);
        walletTotalInvalidShare.html(0);
        walletTotalPayment.html(0);

        $("#lookup").click(onLookupClick);
        walletAddress.keyup(onWalletAddressKeyUp);

        $("#loadMore").click(function () {
            walletPaymentMaxToDownload += 10;
            checkWalletPayment();
        });

        getPoolStats();
        setInterval(getPoolStats, 5000);

        walletAddress.val(Cookies.get('mining_address'));
        checkWalletAddress();
    });

})(jQuery);