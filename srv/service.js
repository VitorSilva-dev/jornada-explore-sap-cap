const cds = require('@sap/cds');

module.exports = async (srv) => {

    const sord = await cds.connect.to('API_SALES_ORDER_SRV');

    srv.on('READ', 'A_SalesOrder', (req) => {
        const data = sord.transaction(req).send({
            query: req.query,
            headers: {
                apikey: 'qoEAeuXP7akHyXblJY6ez9egb3v91iLP'
            }
        });

        return data;
    });

    srv.on('getSalesOrderAmountBySoldToParty', async (req) => {
        const data = await sord.transaction(req).send({
            query: SELECT.from(sord.entities.A_SalesOrder).limit(1000),
            headers: {
                apikey: 'qoEAeuXP7akHyXblJY6ez9egb3v91iLP'
            }
        });

        const salesOrderAmountBySoldToParty = data.reduce((acc, curr) => {
            if (acc[curr.SoldToParty]) {
                acc[curr.SoldToParty] = Number(Number(acc[curr.SoldToParty]) + curr.TotalNetAmount).toFixed(2);

                return acc;
            }

            acc[curr.SoldToParty] = curr.TotalNetAmount.toFixed(2);

            return acc;
        }, {});

        return salesOrderAmountBySoldToParty;
    })

}