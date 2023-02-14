
exports.config = () => {
    require('../auto/archiveTournaments').startArchiveTimer();
    require('../auto/priceChangeAdjuster').startPriceAdjustTimer();
}