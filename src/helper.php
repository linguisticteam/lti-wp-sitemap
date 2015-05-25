<?php

/**
 * Lti + sitemap + i8n = lsmint
 *
 * @param $text
 * @param string $domain
 *
 * @return string|void
 */
function lsmint( $text, $domain = 'lti-sitemap' ) {
	return __( $text, $domain );
}

/**
 * Retarded way of having certain fields being picked up by poedit
 * without having to use the translation domain
 *
 * @param $value
 * @return mixed
 */
function lsmint_po($value){
	return $value;
}

/**
 * Displays input text values
 *
 * @param $value
 *
 * @return mixed|null|string|void
 */
function lsmopt( $value ) {
	$admin = \Lti\Sitemap\LTI_Sitemap::get_instance()->get_admin();
	return esc_attr($admin->get_setting( $value ));
}

/**
 * Displays input checkbox values
 *
 * @param $value
 *
 * @return null|string
 */
function lsmchk( $value ) {
	$val = lsmopt( $value );
	if ( $val == true ) {
		return 'checked="checked"';
	} else {
		return null;
	}
}

/**
 * Displays input radio values
 *
 * @param $key
 * @param $currentValue
 *
 * @return null|string
 */
function lsmrad( $key, $currentValue ) {
	$storedValue = lsmopt( $key );
	if ( $storedValue == $currentValue ) {
		return 'checked="checked"';
	} else {
		return null;
	}
}

/**
 * Retrieves page type so we can display error/info messages properly
 * @return string
 */
function lsmpagetype() {
	$admin = \Lti\Sitemap\LTI_Sitemap::get_instance()->get_admin();
	return $admin->get_page_type();
}

/**
 * Gets the right info/error message
 *
 * @return string
 */
function lsmessage() {
	$admin = \Lti\Sitemap\LTI_Sitemap::get_instance()->get_admin();
	return $admin->get_message();
}

if(!function_exists('lti_iso8601_date')){
function lti_iso8601_date( $date ) {
	return mysql2date( 'c', $date );
}
}

if(!function_exists('lti_mysql_date_year')) {
	function lti_mysql_date_year($date){
		return mysql2date( 'Y', $date );
	}
}

function lti_mysql_to_date($date){
	$dt = new DateTime($date, new DateTimeZone('UTC'));
	$dt->setTimezone(new DateTimeZone(get_option('timezone_string')));
	return date_format($dt, get_option('date_format') . ' ' . get_option('time_format'));
}
