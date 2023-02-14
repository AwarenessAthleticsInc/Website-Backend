exports.config = (app) => {
  require('./react').getRoutes(app);

  /**
   * Data Collection Routes for React Application
   */
  require('./dataCollection/startup').api(app);
  require('./standardRoutes/user').api(app);
  require('./dataCollection/admin').api(app);
  require('./dataCollection/convener').api(app);

  /**
   * Standard Routes
   */
  require('./standardRoutes/payments').api(app);
  require('./standardRoutes/cart').api(app);
  require('./standardRoutes/register').api(app);
  require('./standardRoutes/search').api(app);
  require('./standardRoutes/shipping').api(app);
  require('./standardRoutes/ordering').api(app);
  require('./standardRoutes/contact').api(app);
  /**
   * Member Routes
   */
  require('./memberRoutes/login').api(app);


  /**
   * Dashboard Routes
   */
  require('./AdminRoutes/registrations').api(app);
  require('./AdminRoutes/upload').api(app);
  require('./AdminRoutes/toc').api(app);
  require('./AdminRoutes/tournaments').api(app);
  require('./AdminRoutes/teams').api(app);
  require('./AdminRoutes/orders').api(app);
  require('./AdminRoutes/product').api(app);
  require('./AdminRoutes/stock').api(app);
  require('./AdminRoutes/users').api(app);
  require('./AdminRoutes/rulesInfo').api(app);
  require('./AdminRoutes/faq').api(app);
  require('./AdminRoutes/staff').api(app);

  /**
   * Convener Panel Routes
   */

  /**
   * check connection to warn users of a disconnectionon
   */
  app.get('/checkConnection', (req, res) => {
    res.status(200).send('connected');
  });
}