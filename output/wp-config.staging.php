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
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

define('WP_HOME','a');
define('WP_SITEURL','a');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '.~r1V%y`Eho[D_M8(x8b[H;c+abXKDvXv)T{1K%oP8o+kWR1,;/c{_Vk9Y}k~*G1');
define('SECURE_AUTH_KEY',  '>W11Kw15wFe<.[}C mE/Oph&~2_Y>Fs8@4}cMTjwfui<voZ}k8V+~*!YaywN2>h~');
define('LOGGED_IN_KEY',    'cU8q+Ozta<}Ry!,W76L*MaKic Wx#/(8`-}BU~gXdZn~g*:x{;[=eU0  p_5B@7Y');
define('NONCE_KEY',        'AR7@6Ep1+d$MY5Y2o|7(i]0pQ.?VZ}>PDr{.3JmM@d-xCJ##FKLUTKQY_B&e6G]b');
define('AUTH_SALT',        '#LNsZ`i*tqh5=b_k!w4{)h8FJwCG>aKJTkhy$Wbl)[F0 *vLdD$ppp4[(rY0%jB!');
define('SECURE_AUTH_SALT', 'aDDqN!g;fW9dQdf#IN<T]^][P;+GgXZv5mMj:URL^k-X/vX[oJ67]D.Y7:p)z-!e');
define('LOGGED_IN_SALT',   's,K)-dhGQR;Wr:vDH+pO,K[GK#|v(.g1-tHNcYyLLfrM:LS<sxf:)*fdTyKj*~da');
define('NONCE_SALT',       'GOxMu3g?B%~)Cj/0H|*mWa.UYnS*pZ&GHY/u_xqEr%o!H)-iVVRnNQZ{snuspm{S');

