<?php

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'a');

/** MySQL database username */
define('DB_USER', 'a');

/** MySQL database password */
define('DB_PASSWORD', 'a');

/** MySQL hostname */
define('DB_HOST', 'a');

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'a';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', true);

if( $_SERVER['HTTP_HOST'] == 'a' ) {
	define('WP_HOME','a');
	define('WP_SITEURL','a');
} else {
	define('WP_HOME','a');
	define('WP_SITEURL','a');
}

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ':dLxy,@IoNiVKexGU U,Atq;#0RD[/P*%*!>Ytyx5+e*y5|tvkpE8m+w+<|R2Sf0');
define('SECURE_AUTH_KEY',  'Igc{ee0hxR.x?V^Qb1`C*T~2r%`Hd]B?m#(RcB^8:F/+L|x$>m^r5Y=h{z%^e-:,');
define('LOGGED_IN_KEY',    '^$Kc47g9b~Y2c+UXiR*pbxp{qe |G;x9;bO~E?^ A9c_A~O/xn0$+p3@AprOh<Q.');
define('NONCE_KEY',        'OyZ:#I)AjctxdCdp2XjzUN4[|Io|?6l?5ls;Q1,W=(,/a9U86.aZ|bkheY.Cf(Sq');
define('AUTH_SALT',        ',Oye^TveTIKPr>-V`BR|<dfS1:C1_;/nli~>=DsRV>?OS,(+ WiBX!*NV9ro&%b{');
define('SECURE_AUTH_SALT', 'Ep:u~Xlr*VLh<Y-0If*0w!c[u5#lEV69[ _(lp9m13lW=Xiz~IbVVmztI4VUx+@]');
define('LOGGED_IN_SALT',   'e=Ub{Be?TI6RD-[M@.MKjMS+:v_3P?LA%rlh1&z|bhoF`/3tlPv~:CXa3YnFF;dP');
define('NONCE_SALT',       'yA,}{vbYSoIa{1(0wC+nLmH}J;xi@Yr|i~5u~q9+GWjLR*%g15euMj.{M_h4h>%%');

