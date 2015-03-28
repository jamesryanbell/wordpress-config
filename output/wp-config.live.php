<?php

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'aa');

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
define('AUTH_KEY',         '7!JwER<T_Ca;RgmIX}0NYwCDPX|!Q<kV00tal/rFydwPqzq6+u}vrGg1|(b7DVj2');
define('SECURE_AUTH_KEY',  'g/SbBm|SJr*-P=P]hYzJVL}g+xf|EV0C/kjbywm>1!8vY?nf-z>G +mBOo<)6V~~');
define('LOGGED_IN_KEY',    'O-/a|vdYEpZp?=jk47w+j:Z/MahTIOQ/aUPYg$$cS|3$q2e]21J6;MGk(  urJA+');
define('NONCE_KEY',        'yw1|XicK8O:iSE|$^h5tjOE-l|4_`Rz (|2o XkZZ(U4;C~HyM*mTa1YSh^}8ow#');
define('AUTH_SALT',        'MMj~u|/W3x !0`7MW.h$i$INJPjz8CFmF`*euyBxHls?q|>.GaNs1~FsxQxmf9QL');
define('SECURE_AUTH_SALT', '_wX%8p+_J|+Y})33Jyw-VUapQ,Ykt8w!Ui;trH]ULC$F@-!]SCutfp$([+83|rUt');
define('LOGGED_IN_SALT',   'T{fA(L=4t`w#b5u$F;_n)Roh7/]a$0kS:+7uAG|?P@bh?U{DH_k|Cfk~Df!a1KLp');
define('NONCE_SALT',       'g |NnEsJaYq.4_s;<JRQJ3OQw#UyVU,%|*Nq+]>+K ,C,&.NRDOOVHFR7^X^8KYW');

