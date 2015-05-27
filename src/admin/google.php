<?php namespace Lti\Sitemap;

use Lti\Google\Google_Helper;

class Admin_Google {
	public $can_send_curl_requests;
	public $error;
	public static $console_url = 'https://www.google.com/webmasters/tools/home?hl=%s&siteUrl=%s';
	private $site_url;

	/**
	 * @var \Lti\Google\Google_Helper
	 */
	public $helper;

	public function __construct( Admin $admin ) {
		$this->admin                  = $admin;
		$this->can_send_curl_requests = function_exists( 'curl_version' );
		if ( $this->can_send_curl_requests === true ) {
			$this->helper = new Google_Helper( array(
				'https://www.googleapis.com/auth/webmasters'
			) );

			$access_token = $this->admin->get_setting( 'google_access_token' );
			if ( ! is_null( $access_token ) && ! empty( $access_token ) ) {
				$this->helper->set_access_token( $access_token );

				if ( $this->helper->assess_token_validity() !== true ) {
					$this->admin->remove_setting( 'google_access_token' );
				}
			}
		}
	}

	public function get_site_info() {
		$this->helper->init_sitemap_service( 'http://caprica.linguisticteam.org', 'http://caprica.linguisticteam.org' );
		$obj          = new \stdClass();
		$obj->sitemap = $this->helper->get_sitemap_service();
		try {
			$obj->sitemap->request_site_info();
			$obj->is_listed = true;
		} catch ( \Google_Service_Exception $e ) {
			$obj->is_listed = false;
		}

		return $obj;
	}

	public function google_auth( $post_variables ) {
		try {
			$this->admin->set_setting( 'google_access_token',
				$this->helper->authenticate( $post_variables['google_auth_token'] ) );
			$this->message = ltint( 'msg.google_logged_in' );
		} catch ( \Google_Auth_Exception $e ) {
			$this->error = array(
				'error'           => ltint( 'err.google_auth_failure' ),
				'google_response' => $e->getMessage()
			);
			$this->admin->remove_setting( 'google_access_token' );
		}
	}

	public function google_logout() {
		$this->admin->remove_setting( 'google_access_token' );
		$this->message = ltint( 'google.msg.logout' );
		$this->helper->revoke_token();
	}

	public function google_submit() {
		$sitemap = $this->helper->get_sitemap_service();
		$sitemap->submit_sitemap();
		$this->message = lsmint( 'google.msg.submit' );
	}

	public function google_resubmit() {
		$sitemap = $this->helper->get_sitemap_service();
		$sitemap->submit_sitemap();
		$this->message = lsmint( 'google.msg.resubmit' );
	}

	public function google_delete() {
		$sitemap = $this->helper->get_sitemap_service();
		$sitemap->delete_sitemap();
		$this->message = lsmint( 'google.msg.delete' );
	}

//	public function get_console_url(){
//		return Google_Helper::get_site_console_url($this->url)
//	}

}