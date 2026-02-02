<?php
defined('BASEPATH') or exit('No direct script access allowed');

use setasign\Fpdi\PdfParser\StreamReader;

class Services extends CI_Controller
{
	public function verify_mobile_number()
	{
		$mobile_no = $this->input->post('mobile_no');
		$is_login = $this->input->post('is_login');
		$device_id = $this->input->post('device_id');
		if (!empty($mobile_no)) {
			if ($is_login) {
				$q = $this->db->where('phone', $mobile_no)->get('users');
				$response = array();
				if ($q->num_rows() > 0) {
					if ($mobile_no == "9768308924" || $mobile_no == "6353846662" || $mobile_no == "7490077997") {
						$otp = 123456;
					} else {
						$otp = rand(100000, 999999);
					}
					$message = $otp . ' is your Onespace Verification Code for Login or to SignUp. Enjoy Making Your Dream Home Interior With Onespace';
					$apiKey = urlencode('6348eda2cf8cf');
					// Message details
					$numbers = array($mobile_no);
					$sender = urlencode('ONESPC');
					$message = rawurlencode($message);

					$numbers = implode(',', $numbers);

					$curl = curl_init();

					curl_setopt_array($curl, array(
						CURLOPT_URL => 'https://sms.mobileadz.in/api/push?apikey=' . $apiKey . '&sender=' . $sender . '&mobileno=' . $numbers . '&text=' . $message,
						CURLOPT_RETURNTRANSFER => true,
						// CURLOPT_ENCODING => '',
						// CURLOPT_MAXREDIRS => 10,
						// CURLOPT_TIMEOUT => 0,
						// CURLOPT_FOLLOWLOCATION => true,
						// CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
						CURLOPT_CUSTOMREQUEST => 'GET',
					));

					$curl_response = curl_exec($curl);
					$decoded_res = json_decode($curl_response);
					// echo "<pre>";print_r($decoded_res);die();

					// echo $q->row()->email;
					$this->sendEmail($q->row()->email, 'Onespace interiors - OTP', 'Dear ' . $q->row()->first_name . ',

					' . $otp . ' is your Onespace verification code. Enjoy making your dream space with Onespace 
					

					Regards,
					Onespace Interiors');
					// if($decoded_res) {
					// if ($mobile_no == "9768308924" || $mobile_no == "6353846662" || $mobile_no == "7490077997") {
					// 	$this->db->where('phone', $mobile_no)->update('users', array('otp' => "123456"));
					// } else {
					$this->db->where('phone', $mobile_no)->update('users', array('otp' => $otp));
					// }
					$response['success'] = true;
					$response['message'] = 'Your OTP has been Sent.';
					header('Content-Type: application/json; charset=utf-8');
					$this->sendWhatsappMessage($otp, '91' . $mobile_no . '', 'otp_verify_');
					echo json_encode($response);
					exit();
					// } else {
					// 	$response['success'] = false;
					// 	$response['message'] = 'Error Occurred While Sending OTP.';
					// 	header('Content-Type: application/json; charset=utf-8');
					// 	$this->sendWhatsappMessage($otp,'91'.$mobile_no.'','otp_verify_');
					// 	echo json_encode($response);exit();
					// }
					curl_close($curl);
				} else {
					$response['success'] = false;
					$response['message'] = 'Your Mobile Number is Not Registered.';
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
				}
			} else {
				$q = $this->db->insert('signup_otp', array('mobile_number' => $mobile_no, 'device_id' => $device_id));

				$response = array();
				if ($q) {
					$otp = rand(100000, 999999);
					$message = $otp . ' is your Onespace Verification Code for Login or to SignUp. Enjoy Making Your Dream Home Interior With Onespace';
					$apiKey = urlencode('6348eda2cf8cf');
					// Message details
					$numbers = array($mobile_no);
					$sender = urlencode('ONESPC');
					$message = rawurlencode($message);

					$numbers = implode(',', $numbers);

					$curl = curl_init();
					curl_setopt_array($curl, array(
						CURLOPT_URL => 'https://sms.mobileadz.in/api/push?apikey=' . $apiKey . '&sender=' . $sender . '&mobileno=' . $numbers . '&text=' . $message,
						CURLOPT_RETURNTRANSFER => true,
						// CURLOPT_ENCODING => '',
						// CURLOPT_MAXREDIRS => 10,
						// CURLOPT_TIMEOUT => 0,
						// CURLOPT_FOLLOWLOCATION => true,
						// CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
						CURLOPT_CUSTOMREQUEST => 'GET',
					));

					$curl_response = curl_exec($curl);

					$decoded_res = json_decode($curl_response);
					// echo "<pre>";print_r($decoded_res);die();
					// if($curl_response) {



					$this->db->where('mobile_number', $mobile_no)->update('signup_otp', array('otp' => $otp));
					$this->sendWhatsappMessage($otp, '91' . $mobile_no . '', 'otp_verify_');
					$response['success'] = true;
					$response['message'] = 'Your OTP has been Sent.';
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
					// } else {
					// 	$response['success'] = false;
					// 	$this->sendWhatsappMessage($otp,'91'.$mobile_no.'','otp_verify_');
					// 	$response['message'] = 'Error Occurred While Sending OTP.';
					// 	header('Content-Type: application/json; charset=utf-8');
					// 	echo json_encode($response);exit();
					// }

					//  echo "siddhamt12";
					curl_close($curl);
				} else {
					$response['success'] = false;
					$response['message'] = 'Error Occurred While Register.';
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
				}
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'Please Enter Mobile Number.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function verify_otp()
	{
		$mobile_no = $this->input->post('mobile_no');
		$otp = $this->input->post('otp');
		$is_login = $this->input->post('is_login');
		if (empty($mobile_no)) {
			$response['success'] = false;
			$response['message'] = 'Please Enter Mobile Number.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($otp)) {
			$response['success'] = false;
			$response['message'] = 'Please Enter OTP.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if ($is_login) {
			$q = $this->db->select('id AS customer_id, first_name AS firstname, last_name AS lastname, email, phone AS telephone')->where(array('phone' => $mobile_no, 'otp' => $otp))->get('users');
			$response = array();
			if ($q->num_rows() > 0) {

				$customer_id = (int) $q->row()->customer_id;
				$firstname = $q->row()->firstname;
				$lastname = $q->row()->lastname;
				$email = $q->row()->email;
				$telephone = $q->row()->telephone;

				$data = array('customer_id' => $customer_id, 'firstname' => $firstname, 'lastname' => $lastname, 'email' => $email, 'telephone' => $telephone,);

				$this->db->where('phone', $mobile_no)->update('users', array('otp' => 0));

				$response['success'] = true;
				$response['message'] =  'Logged in Successfully.';
				$response['response'] = $data;
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			} else {
				$response['success'] = false;
				$response['message'] = 'Invalid OTP.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} else {
			$q = $this->db->where(array('mobile_number' => $mobile_no, 'otp' => $otp))->get('signup_otp');
			$response = array();
			if ($q->num_rows() > 0) {

				$this->db->where('mobile_number', $mobile_no)->delete('signup_otp');

				$response['success'] = true;
				$response['message'] =  'Verified Successfully.';
				// $response['response'] = $q->row();
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			} else {
				$response['success'] = false;
				$response['message'] = 'Invalid OTP.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		}
	}

	public function fetch_cities()
	{
		$q = $this->db->select('id, name')->get('cities');
		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No City Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function register()
	{
		$first_name = $this->input->post('first_name');
		$last_name = $this->input->post('last_name');
		$email = $this->input->post('email');
		$mobile_no = $this->input->post('mobile_no');
		$city_id = $this->input->post('signup_location_id');
		$flat_type = $this->input->post('flat_type');
		// $project_type = $this->input->post('project_type');
		$referred_from = $this->input->post('referred_from');
		$device_id = $this->input->post('device_id');
		$device_type = $this->input->post('device_type');
		$fcm_token = $this->input->post('fcm_token');
		$other_reference = $this->input->post('other_reference');
		$country_code = $this->input->post('country_code');

		if (empty($first_name)) {
			$response['success'] = false;
			$response['message'] = 'Please Enter First Name.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($last_name)) {
			$response['success'] = false;
			$response['message'] = 'Please Enter Last Name.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($email)) {
			$response['success'] = false;
			$response['message'] = 'Please Enter Email Id.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($mobile_no)) {
			$response['success'] = false;
			$response['message'] = 'Please Enter Mobile Number.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($city_id)) {
			$response['success'] = false;
			$response['message'] = 'Please Select City.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->where('phone', $mobile_no)->get('users');
		$response = array();
		if ($q->num_rows() > 0) {
			$response['success'] = false;
			$response['message'] = 'Mobile Number Already Exist.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q2 = $this->db->where('email', $email)->get('users');
		if ($q2->num_rows() > 0) {
			$response['success'] = false;
			$response['message'] = 'Email Id Already Exist.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		// else {
		$q = $this->db->insert('users', array('name' => $first_name . ' ' . $last_name, 'first_name' => $first_name, 'last_name' => $last_name, 'email' => $email, 'phone' => $mobile_no, 'city_id' => $city_id, 'device_id' => $device_id, 'device_type' => $device_type, 'fcm_token' => $fcm_token, 'referred_from' => $referred_from, 'other_reference' => $other_reference, 'room_type_id' => $flat_type, 'country_code' => $country_code, 'created_at' => date('Y-m-d H:i:s')));
		if ($q) {
			$customer_id = $this->db->insert_id();
			$q2 = $this->db->select('id')->where('name', 'Customer')->get('roles');
			$role_id = $q2->row()->id;
			$this->db->insert('model_has_roles', array('model_id' => $customer_id, 'model_type' => 'App\Models\User', 'role_id' => $role_id));

			// $this->verify_mobile_number($mobile_no);

			$data = array('customer_id' => $customer_id, 'firstname' => $first_name, 'lastname' => $last_name, 'email' => $email, 'telephone' => $mobile_no);
			$this->sendEmail($email, 'Congratulations *Name* for first step towards designing
				your Dream Home.', 'Greetings!
				Welcome to ONE SPACE INTERIOR. We look forward to decor your
				space and make it more liveable.
				Hi ' . $first_name . '
				Let’s unleash the potential of your living space with your vision, and
				our expertise.
				In the next 24 hours our potential team will get in touch with you. Until
				then you can take inspiration from our executed dream space.

				https://onespaceinterior.com/projects
				Connect with us and discover the world of home designs.
				We await your housewarming
				Love Onespace.
				In case of any queries contact us on +91 7969108016');

			$this->sendWhatsappMessage($first_name, '91' . $mobile_no . '', 'welcome_message_onespace_interior__clone');
			$response['success'] = true;
			$response['message'] = 'Registered Successfully.';
			$response['response'] = $data;
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While Register.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		// }
	}

	public function fetch_packages()
	{
		$city_id = $this->input->post('signup_location_id');
		if (empty($city_id)) {
			$response['success'] = false;
			$response['message'] = 'City Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$q = $this->db->select('id, name, description, city_id, budget, image_path AS image, room_type_id AS room_type')->where(['is_active' => 1])->get('packages');
		$response = array();
		if ($q->num_rows() > 0) {

			foreach ($q->result() as $key => $value) {
				if ($value->image) {
					$value->image = "https://onespaceinterior.com/" . '' . $value->image;
				} else {
					$value->image = '';
				}
			}

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Package Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_partner_projects()
	{
		$q = $this->db->select('id, name')->get('project_partners');
		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Partner Project Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_brand_sheets()
	{
		$q = $this->db->select('id, name, image_path AS image')->get('brandsheets');
		$response = array();
		if ($q->num_rows() > 0) {

			foreach ($q->result() as $key => $value) {
				if ($value->image) {
					$value->image = "https://onespaceinterior.com/" . 'image/brand_sheets/' . $value->image;
				} else {
					$value->image = '';
				}
			}

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Brand Sheet Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_room_types()
	{
		$q = $this->db->select('id, REPLACE(name, "_", " ") AS name')->where('is_active', 1)->get('room_types');

		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Room Type Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function store_project()
	{
		$user_id = $this->input->post('user_id');
		$property_name = $this->input->post('property_name');
		$package = $this->input->post('package');
		$brandsheet = $this->input->post('brandsheet');
		$property_type = $this->input->post('property_type');
		$partner_project = $this->input->post('partner_project');
		$room_type = $this->input->post('room_type');
		$project_type = $this->input->post('project_type');
		$project_start_from = $this->input->post('project_start_from');
		$budget = $this->input->post('budget');
		$total_area = $this->input->post('total_area');
		$theme_id = $this->input->post('theme_id');
		$city_id = $this->input->post('city_id');
		$package_id = $this->input->post('package_id');

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($property_name)) {
			$response['success'] = false;
			$response['message'] = 'Please Enter Property Name.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($package)) {
			// $response['success'] = false;
			// $response['message'] = 'Please Select Package.';
			// header('Content-Type: application/json; charset=utf-8');
			// echo json_encode($response);exit();
			$package = NULL;
		}
		if (empty($brandsheet)) {
			// $response['success'] = false;
			// $response['message'] = 'Please Select Brand Sheet.';
			// header('Content-Type: application/json; charset=utf-8');
			// echo json_encode($response);exit();
			$brandsheet = null;
		}
		if (empty($property_type)) {
			// $response['success'] = false;
			// $response['message'] = 'Please Select Property Type.';
			// header('Content-Type: application/json; charset=utf-8');
			// echo json_encode($response);exit();
			$property_type = null;
		}
		if (empty($partner_project)) {
			// $response['success'] = false;
			// $response['message'] = 'Please Select Partner Project.';
			// header('Content-Type: application/json; charset=utf-8');
			// echo json_encode($response);exit();
			$partner_project = NULL;
		}
		if (empty($room_type)) {
			// $response['success'] = false;
			// $response['message'] = 'Please Select Room Type.';
			// header('Content-Type: application/json; charset=utf-8');
			// echo json_encode($response);exit();
			$room_type = null;
		}
		if (empty($project_type)) {
			// $response['success'] = false;
			// $response['message'] = 'Please Select Project Type.';
			// header('Content-Type: application/json; charset=utf-8');
			// echo json_encode($response);exit();
			$project_type = null;
		}
		if (empty($project_start_from)) {
			// $response['success'] = false;
			// $response['message'] = 'Please Select When to Start.';
			// header('Content-Type: application/json; charset=utf-8');
			// echo json_encode($response);exit();
			$project_start_from = null;
		}
		if (empty($budget)) {
			$response['success'] = false;
			$response['message'] = 'Please Select Budget.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($total_area)) {
			$response['success'] = false;
			$response['message'] = 'Please Enter Tentative Sq. Ft.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($theme_id)) {
			// $response['success'] = false;
			// $response['message'] = 'Please Select Theme.';
			// header('Content-Type: application/json; charset=utf-8');
			// echo json_encode($response);exit();
			$theme_id = null;
		}
		if (empty($city_id)) {
			$response['success'] = false;
			$response['message'] = 'Please Select City.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($package_id)) {
			// $response['success'] = false;
			// $response['message'] = 'Please Package City.';
			// header('Content-Type: application/json; charset=utf-8');
			// echo json_encode($response);exit();
		}
		$interiorPackage_query = $this->db->select('room_type')
			->where('id', $package_id)
			->get('interior_packes');
		$qval = $this->db->select('id AS customer_id, first_name AS firstname, last_name AS lastname, email, phone AS telephone,REPLACE(country_code, "+", "") AS countrycode')->where(array('id' => $user_id))->get('users');

		if ($qval->num_rows() > 0) {

			$firstname = $qval->row()->firstname;
			$email = $qval->row()->email;
			$telephone = $qval->row()->telephone;
			$countrycode = $qval->row()->countrycode;
			$finalNumber =  (string) $countrycode + $telephone;

			$q = $this->db->insert('projects', array('user_id' => $user_id, 'name' => $property_name, 'package_id ' => $package, 'brandsheet_id ' => $brandsheet, 'property_type' => $property_type, 'project_partner_id' => $partner_project, 'room_type_id' => $interiorPackage_query->row()->room_type, 'project_type' => $project_type, 'start_from' => $project_start_from, 'selected_budget' => $budget, 'carpet_area' => $total_area, 'theme_id' => $theme_id, 'city_id' => $city_id, 'interior_package_id' => $package_id, 'created_at' => date('Y-m-d H:i:s')));
			if ($q) {

				$response['success'] = true;
				$response['message'] = 'Data Inserted Successfully.';
				$response['project_id'] = $this->db->insert_id();
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				$this->sendWhatsappMessage($firstname, '91' . $telephone . '', 'project_created');
				exit();
			} else {
				$response['success'] = false;
				$response['message'] = 'Error Occurred While Inserting Data.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		}
	}
	public function update_Project_Budget()
	{
		$budget = $this->input->post('budget');
		$projectID = $this->input->post('projectID');
		if (empty($budget)) {
			$response['success'] = false;
			$response['message'] = 'Please Add Project ID';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($budget)) {
			$response['success'] = false;
			$response['message'] = 'Please Select Budget.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$q = $this->db->where(['id' => $projectID])->update('projects', ['selected_budget' => $budget]);
		if ($q) {

			$response['success'] = true;
			$response['message'] = 'Data updated Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While updating Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_parent_categories()
	{
		$project_id = $this->input->post('project_id');
		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$q2 = $this->db->select('selected_budget AS budget, room_type_id')->where('id', $project_id)->get('projects');
		if ($q2->num_rows() > 0) {
			$room_type_id = $q2->row()->room_type_id;
			$budget = $q2->row()->budget;
			if ($room_type_id == 4) {
				$q = $this->db->select('id, name')->where('id !=', 6)->get('parent_categories');
			} else {
				$q = $this->db->select('id, name')->get('parent_categories');
			}
			$quotation_price = 0;
			$modification_enabled = 0;
			$q3 = $this->db->select('quotation_price,modification_enabled')->where('project_id', $project_id)->where('is_freezed', 1)->get('requirements');
			if ($q3->num_rows() > 0) {
				$quotation_price = $q3->row()->quotation_price;
				$modification_enabled = $q3->row()->modification_enabled;
			}
			$response = array();
			if ($q->num_rows() > 0) {

				$response['success'] = true;
				$response['message'] = 'Fetched Successfully.';
				$response['response'] = $q->result();
				$response['budget'] = $budget;
				$response['quotation_price'] = $quotation_price;
				$response['modification_enabled'] = $modification_enabled;
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			} else {
				$response['success'] = false;
				$response['message'] = 'No Parent Category Found.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'No Project Found.';
			$response['response'] = [];
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_parent_categories_V2()
	{
		$project_id = $this->input->post('project_id');
		$parent_id = $this->input->post('parentID');

		if (empty($parent_id)) {
			$response['success'] = false;
			$response['message'] = 'Parent Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q2 = $this->db->select('selected_budget AS budget')->where('id', $project_id)->get('projects');
		if ($q2->num_rows() > 0) {
			$room_type_id = $q2->row()->room_type_id;
			$budget = $q2->row()->budget;
			if ($parent_id == 1 || $parent_id == 2 || $parent_id == 3 || $parent_id == 130 || $parent_id == 131 || $parent_id == 132) {
				$q = $this->db->select('id, name')->where('id !=', 5)->where('id !=', 6)->get('parent_categories');
			} else if ($parent_id == 4 || $parent_id == 5 || $parent_id == 6 || $parent_id == 133 || $parent_id == 134 || $parent_id == 135) {
				$q = $this->db->select('id, name')->where('id !=', 6)->get('parent_categories');
			} else if ($parent_id == 7 || $parent_id == 8 || $parent_id == 9 || $parent_id == 136 || $parent_id == 137 || $parent_id == 138) {
				$q = $this->db->select('id, name')->get('parent_categories');
			} else if ($parent_id == 21 || $parent_id == 22 || $parent_id == 23 || $parent_id == 139 || $parent_id == 140 || $parent_id == 141) {
				$q = $this->db->select('id, name')->where('id !=', 2)->where('id !=', 3)->where('id !=', 5)->where('id !=', 6)->where('id !=', 7)->get('parent_categories');
			} else if ($parent_id == 24 || $parent_id == 25 || $parent_id == 26 || $parent_id == 142 || $parent_id == 143 || $parent_id == 144) {
				$q = $this->db->select('id, name')->where('id !=', 2)->where('id !=', 3)->where('id !=', 6)->where('id !=', 7)->get('parent_categories');
			} else if ($parent_id == 27 || $parent_id == 28 || $parent_id == 29 || $parent_id == 145 || $parent_id == 146 || $parent_id == 147) {
				$q = $this->db->select('id, name')->where('id !=', 2)->where('id !=', 3)->where('id !=', 7)->get('parent_categories');
			} else if ($parent_id == 31 || $parent_id == 32 || $parent_id == 33 || $parent_id == 148 || $parent_id == 149 || $parent_id == 150) {
				$q = $this->db->select('id, name')->where('id !=', 2)->where('id !=', 4)->where('id !=', 5)->where('id !=', 6)->where('id !=', 7)->get('parent_categories');
			} else if ($parent_id == 41 || $parent_id == 42 || $parent_id == 43 || $parent_id == 151 || $parent_id == 152 || $parent_id == 153) {
				$q = $this->db->select('id, name')->where('id !=', 3)->where('id !=', 4)->where('id !=', 5)->where('id !=', 6)->where('id !=', 7)->get('parent_categories');
			} else if ($parent_id == 51 || $parent_id == 52 || $parent_id == 53 || $parent_id == 154 || $parent_id == 155 || $parent_id == 156) {
				$q = $this->db->select('id, name') > where('id !=', 2)->where('id !=', 3)->where('id !=', 4)->where('id !=', 5)->where('id !=', 6)->get('parent_categories');
			}
			$quotation_price = 0;
			$modification_enabled = 0;
			$q3 = $this->db->select('quotation_price,modification_enabled')->where('project_id', $project_id)->where('is_freezed', 1)->get('requirements');
			if ($q3->num_rows() > 0) {
				$quotation_price = $q3->row()->quotation_price;
				$modification_enabled = $q3->row()->modification_enabled;
			}
			$response = array();
			if ($q->num_rows() > 0) {

				$response['success'] = true;
				$response['message'] = 'Fetched Successfully.';
				$response['response'] = $q->result();
				$response['budget'] = $budget;
				$response['quotation_price'] = $quotation_price;
				$response['modification_enabled'] = $modification_enabled;
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			} else {
				$response['success'] = false;
				$response['message'] = 'No Parent Category Found.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'No Project Found.';
			$response['response'] = [];
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_themes()
	{
		$q = $this->db->select('id, name')->get('themes');
		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Theme Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}


	public function fetch_categories()
	{
		$user_id = $this->input->post('user_id');
		$project_id = $this->input->post('project_id');
		$parent_category_id = $this->input->post('parent_category_id');

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($parent_category_id)) {
			$response['success'] = false;
			$response['message'] = 'Parent Category Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$project_query = $this->db->select('carpet_area')
			->where('id', $project_id)
			->get('projects')->row();
		$q3 = $this->db->select('package_id, brandsheet_id, city_id')->where(['user_id' => $user_id, 'id' => $project_id])->get('projects');
		if ($q3->num_rows() > 0) {
			$package_id = $q3->row()->package_id;
			$brand_sheet_id = $q3->row()->brandsheet_id;
			$city_id = $q3->row()->city_id;
			$q4 = $this->db->select('skus.category_id AS category_id')->where('package_id', $package_id)->join('skus', 'skus.id = sku_packages.sku_id', 'left')->get('sku_packages');
			if ($q4->num_rows() > 0) {
				$category_id = [];
				foreach ($q4->result() as $valu) {
					array_push($category_id, $valu->category_id);
				}
			} else {
				$category_id = [];
			}
		} else {
			// $package_id = 0;
			// $brand_sheet_id = 0;
			$response['success'] = false;
			$response['message'] = 'No Project Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		// die();
		$q = $this->db->select('id, name')->where('id', $parent_category_id)->get('parent_categories');
		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			foreach ($q->result() as $key => $value) {
				$value->categories = array();
				$response['response'] = $value;
				$q2 = $this->db->select('id, name, image_path AS image,info_document_path AS docImage, info_document_video_path AS videoLink, has_subcategories AS isSubCategoryEnabled, multiplier_enabled, multiplier_value, qty')->where('parent_category_id', $parent_category_id)->get('categories');
				if ($q2->num_rows() > 0) {
					foreach ($q2->result() as $key => $val) {
						$isSubCategoryEnabled = ($val->isSubCategoryEnabled == '1') ? true : false;
						if ($val->image) {
							$val->image = "https://onespaceinterior.com/" . '' . $val->image;
						} else {
							$val->image = '';
						}
						if ($val->docImage) {
							$val->docImage = "https://onespaceinterior.com/" . '' . $val->docImage;
						}
						$qty = [];
						if ($val->qty) {
							if ($val->qty > 0) {
								for ($i = 1; $i <= $val->qty; $i++) {
									array_push($qty, $i);
								}
							}
						}
						$val->qty = $qty;
						if (!$val->isSubCategoryEnabled) {
							unset($val->isSubCategoryEnabled);
							$q5 = $this->db->select('brandsheets.id AS brand_sheet_id, brandsheets.name AS name')->where('category_id', $val->id)->where('city_id', $city_id)->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->get('skus');
							// echo $this->db->last_query();
							// echo "<br>";
							// echo $q5->num_rows();
							// echo "<br>";

							if ($q5->num_rows() > 0) {
								$brand_sheet_id_arr = [];
								foreach ($q5->result() as $key => $v) {
									$q6 = $this->db->select('price')->where(['category_id' => $val->id, 'city_id' => $city_id, 'brandsheet_id' => $v->brand_sheet_id])->get('skus');
									if ($q6->num_rows() > 0) {
										$price = $q6->row()->price;
										if ($val->multiplier_enabled == 1) {
											$price = $this->calculateCarpetArea($price, $val->multiplier_value, $project_query->carpet_area);
										}
									} else {
										$price = 0.00;
									}
									if ($q5->num_rows() == 3) {
										if ($brand_sheet_id == $v->brand_sheet_id) {
											// unset($v->brand_sheet_id);
											$v->price = $price;
											$v->isSelected = true;
										} else {
											// unset($v->brand_sheet_id);
											$v->price = $price;
											$v->isSelected = false;
										}
									} elseif ($q5->num_rows() == 1) {
										$v->price = $price;
										$v->isSelected = true;
									} else {
										if ($brand_sheet_id == $v->brand_sheet_id) {
											// unset($v->brand_sheet_id);
											$v->price = $price;
											$v->isSelected = true;
										} else {
											// unset($v->brand_sheet_id);
											if ($brand_sheet_id == 3) {
												if ($brand_sheet_id - 1 == $v->brand_sheet_id) {
													$v->price = $price;
													$v->isSelected = true;
												} else {
													$v->price = $price;
													$v->isSelected = false;
												}
											} else {
												$v->price = $price;
												$v->isSelected = false;
											}
										}
									}
								}

								$val->options = array(array("name" => "Yes", "isSelected" => in_array($val->id, $category_id) ? true : false, 'isSubCategoryEnabled' => $isSubCategoryEnabled, 'innerOptions' => $q5->result()), array("name" => "No", "isSelected" => !in_array($val->id, $category_id) ? true : false, 'innerOptions' => array()));
								array_push($value->categories, $val);
							} else {
								$val = null;
							}
						} else {
							unset($val->isSubCategoryEnabled);
							$q7 = $this->db->select('id, name, info_document_path, info_document_video_path')->where('category_id', $val->id)->get('sub_categories');
							if ($q7->num_rows() > 0) {
								foreach ($q7->result() as $key => $sub_category) {
									$sub_category->innerOptions = array();

									$user_sku_query = $this->db->select('sku_id')->from('sku_packages')
										->join('skus', 'skus.id = sku_packages.sku_id')
										->where(['category_id' => $val->id, 'sub_category_id' => $sub_category->id, 'package_id' => $package_id])
										->get()->num_rows();

									$sub_category->isSelected = ($user_sku_query > 0);

									$q5 = $this->db->select('brandsheets.id AS brand_sheet_id, brandsheets.name AS name')->where(['category_id' => $val->id, 'city_id' => $city_id, 'sub_category_id' => $sub_category->id])->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->get('skus');
									if ($q5->num_rows() > 0) {
										$brand_sheet_id_arr = [];
										foreach ($q5->result() as $key => $v) {
											$q6 = $this->db->select('price')->where(['category_id' => $val->id, 'sub_category_id' => $sub_category->id, 'city_id' => $city_id, 'brandsheet_id' => $v->brand_sheet_id])->get('skus');
											if ($q6->num_rows() > 0) {
												$price = $q6->row()->price;
												if ($val->multiplier_enabled == 1) {
													$price = $this->calculateCarpetArea($price, $val->multiplier_value, $project_query->carpet_area);
												}
											} else {
												$price = 0.00;
											}

											if ($q5->num_rows() == 3) {
												if ($brand_sheet_id == $v->brand_sheet_id) {
													// unset($v->brand_sheet_id);
													$v->price = $price;
													$v->isSelected = true;
												} else {
													// unset($v->brand_sheet_id);
													$v->price = $price;
													$v->isSelected = false;
												}
											} elseif ($q5->num_rows() == 1) {
												$v->price = $price;
												$v->isSelected = true;
											} else {
												if ($brand_sheet_id == $v->brand_sheet_id) {
													// unset($v->brand_sheet_id);
													$v->price = $price;
													$v->isSelected = true;
												} else {
													// unset($v->brand_sheet_id);
													if ($brand_sheet_id == 3) {
														if ($brand_sheet_id - 1 == $v->brand_sheet_id) {
															$v->price = $price;
															$v->isSelected = true;
														} else {
															$v->price = $price;
															$v->isSelected = false;
														}
													} else {
														$v->price = $price;
														$v->isSelected = false;
													}
												}
											}
										}
									}
									if ($q5->num_rows() > 0) {
										$sub_category->innerOptions = $q5->result();
									}
								}
							}
							if ($q5->num_rows() > 0) {
								$val->options = array(array("name" => "Yes", "isSelected" => in_array($val->id, $category_id) ? true : false, 'isSubCategoryEnabled' => $isSubCategoryEnabled, 'subCategories' => $q7->result()), array("name" => "No", "isSelected" => !in_array($val->id, $category_id) ? true : false, 'innerOptions' => array()));
								array_push($value->categories, $val);
							}
						}
						unset($val->multiplier_enabled);
						unset($val->multiplier_value);
					}
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
					// die();
				} else {
					$response['success'] = false;
					$response['message'] = 'No Category Found.';
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
				}
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'No Parent Category Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function clone_Requirement()
	{
		$user_id = $this->input->post('user_id');
		$projectId = $this->input->post('project_id');
		$requirementId = $this->input->post('requirement_id');
		$parent_category_id = $this->input->post('parent_category_id');

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($requirementId)) {
			$response['success'] = false;
			$response['message'] = 'Requirement Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($projectId)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($parent_category_id)) {
			$response['success'] = false;
			$response['message'] = 'Parent Category Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$project_query = $this->db->select('carpet_area,city_id,brandsheet_id,package_id')
			->where('id', $projectId)
			->get('projects')->row();
		$q3 = $this->db->select('category_id, is_selected, sub_category_id,qty')->where(['requirement_id' => $requirementId, 'is_selected' => 1])->get('requirement_skus');
		if ($q3->num_rows() > 0) {
			$package_id = $project_query->package_id;
			$brand_sheet_id = $project_query->brandsheet_id;
			$city_id = $project_query->city_id;
			$category_id = [];
			$sub_category_id = [];
			foreach ($q3->result() as $valu) {
				array_push($category_id, $valu->category_id);
				array_push($sub_category_id, $valu->sub_category_id);
			}
		} else {
			// $package_id = 0;
			// $brand_sheet_id = 0;
			$response['success'] = false;
			$response['message'] = 'No Project Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		// die();
		$q = $this->db->select('id, name')->where('id', $parent_category_id)->get('parent_categories');
		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			foreach ($q->result() as $key => $value) {
				$value->categories = array();
				$response['response'] = $value;
				$q2 = $this->db->select('id, name, image_path AS image,info_document_path AS docImage, info_document_video_path AS videoLink, has_subcategories AS isSubCategoryEnabled, multiplier_enabled, multiplier_value, qty')->where('parent_category_id', $parent_category_id)->get('categories');
				if ($q2->num_rows() > 0) {
					foreach ($q2->result() as $key => $val) {
						$isSubCategoryEnabled = ($val->isSubCategoryEnabled == '1') ? true : false;
						if ($val->image) {
							$val->image = "https://onespaceinterior.com/" . '' . $val->image;
						} else {
							$val->image = '';
						}
						if ($val->docImage) {
							$val->docImage = "https://onespaceinterior.com/" . '' . $val->docImage;
						}
						$qty = [];
						if ($val->qty) {
							if ($val->qty > 0) {
								for ($i = 1; $i <= $val->qty; $i++) {
									array_push($qty, $i);
								}
							}
						}
						$val->qty = $qty;
						if (!$val->isSubCategoryEnabled) {
							unset($val->isSubCategoryEnabled);
							$q5 = $this->db->select('brandsheets.id AS brand_sheet_id, brandsheets.name AS name')->where('category_id', $val->id)->where('city_id', $city_id)->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->get('skus');

							if ($q5->num_rows() > 0) {
								$brand_sheet_id_arr = [];
								foreach ($q5->result() as $key => $v) {
									$q6 = $this->db->select('price')->where(['category_id' => $val->id, 'city_id' => $city_id, 'brandsheet_id' => $v->brand_sheet_id])->get('skus');
									if ($q6->num_rows() > 0) {
										$price = $q6->row()->price;
										if ($val->multiplier_enabled == 1) {
											$price = $this->calculateCarpetArea($price, $val->multiplier_value, $project_query->carpet_area);
										}
									} else {
										$price = 0.00;
									}
									if ($q5->num_rows() == 3) {
										if ($brand_sheet_id == $v->brand_sheet_id) {
											// unset($v->brand_sheet_id);
											$v->price = $price;
											$v->isSelected = true;
										} else {
											// unset($v->brand_sheet_id);
											$v->price = $price;
											$v->isSelected = false;
										}
									} elseif ($q5->num_rows() == 1) {
										$v->price = $price;
										$v->isSelected = true;
									} else {
										if ($brand_sheet_id == $v->brand_sheet_id) {
											// unset($v->brand_sheet_id);
											$v->price = $price;
											$v->isSelected = true;
										} else {
											// unset($v->brand_sheet_id);
											if ($brand_sheet_id == 3) {
												if ($brand_sheet_id - 1 == $v->brand_sheet_id) {
													$v->price = $price;
													$v->isSelected = true;
												} else {
													$v->price = $price;
													$v->isSelected = false;
												}
											} else {
												$v->price = $price;
												$v->isSelected = false;
											}
										}
									}
								}
							}
							$val->options = array(array("name" => "Yes", "isSelected" => in_array($val->id, $category_id) ? true : false, 'isSubCategoryEnabled' => $isSubCategoryEnabled, 'innerOptions' => $q5->result()), array("name" => "No", "isSelected" => !in_array($val->id, $category_id) ? true : false, 'innerOptions' => array()));
							array_push($value->categories, $val);
						} else {
							unset($val->isSubCategoryEnabled);
							$q7 = $this->db->select('id, name, info_document_path, info_document_video_path')->where('category_id', $val->id)->get('sub_categories');
							if ($q7->num_rows() > 0) {
								foreach ($q7->result() as $key => $sub_category) {
									$sub_category->innerOptions = array();

									$user_sku_query = $this->db->select('skus.id')->from('skus')
										->where(['category_id' => $val->id, 'sub_category_id' => $sub_category->id])
										->get()->num_rows();
									// echo $this->db->last_query();die();
									$sub_category->isSelected = in_array($sub_category->id, $sub_category_id) ? true : false; //($user_sku_query > 0);

									$q5 = $this->db->select('brandsheets.id AS brand_sheet_id, brandsheets.name AS name')->where(['category_id' => $val->id, 'city_id' => $city_id, 'sub_category_id' => $sub_category->id])->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->get('skus');
									if ($q5->num_rows() > 0) {
										$brand_sheet_id_arr = [];
										foreach ($q5->result() as $key => $v) {
											$q6 = $this->db->select('price')->where(['category_id' => $val->id, 'sub_category_id' => $sub_category->id, 'city_id' => $city_id, 'brandsheet_id' => $v->brand_sheet_id])->get('skus');
											if ($q6->num_rows() > 0) {
												$price = $q6->row()->price;
												if ($val->multiplier_enabled == 1) {
													$price = $this->calculateCarpetArea($price, $val->multiplier_value, $project_query->carpet_area);
												}
											} else {
												$price = 0.00;
											}

											if ($q5->num_rows() == 3) {
												if ($brand_sheet_id == $v->brand_sheet_id) {
													// unset($v->brand_sheet_id);
													$v->price = $price;
													$v->isSelected = true;
												} else {
													// unset($v->brand_sheet_id);
													$v->price = $price;
													$v->isSelected = false;
												}
											} elseif ($q5->num_rows() == 1) {
												$v->price = $price;
												$v->isSelected = true;
											} else {
												if ($brand_sheet_id == $v->brand_sheet_id) {
													// unset($v->brand_sheet_id);
													$v->price = $price;
													$v->isSelected = true;
												} else {
													// unset($v->brand_sheet_id);
													if ($brand_sheet_id == 3) {
														if ($brand_sheet_id - 1 == $v->brand_sheet_id) {
															$v->price = $price;
															$v->isSelected = true;
														} else {
															$v->price = $price;
															$v->isSelected = false;
														}
													} else {
														$v->price = $price;
														$v->isSelected = false;
													}
												}
											}
										}
									}
									$sub_category->innerOptions = $q5->result();
								}
							}
							$val->options = array(array("name" => "Yes", "isSelected" => in_array($val->id, $category_id) ? true : false, 'isSubCategoryEnabled' => $isSubCategoryEnabled, 'subCategories' => $q7->result()), array("name" => "No", "isSelected" => !in_array($val->id, $category_id) ? true : false, 'innerOptions' => array()));
							array_push($value->categories, $val);
						}
						unset($val->multiplier_enabled);
						unset($val->multiplier_value);
					}
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
					// die();
				} else {
					$response['success'] = false;
					$response['message'] = 'No Category Found.';
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
				}
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'No Parent Category Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_products()
	{
		$category_id = $this->input->post('category_id');

		// $city_id = $this->input->post('city_id');

		if (empty($category_id)) {
			$response['success'] = false;
			$response['message'] = 'Category Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$q = $this->db->select('brandsheets.id, brandsheets.name AS name')->where('category_id', $category_id)->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->get('skus');

		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = array();
			foreach ($q->result() as $key => $value) {
				$q2 = $this->db->select('name, image_path AS image')->where('brandsheet_id', $value->id)->get('skus');
				unset($value->id);
				$value->products = array();
				if ($q2->num_rows() > 0) {
					foreach ($q2->result() as $key => $val) {
						if ($val->image) {
							$val->image = "https://onespaceinterior.com/" . 'image/skus/' . $val->image;
						} else {
							$val->image = '';
						}
					}
					$value->products = $q2->result();
				}
				array_push($response['response'], $value);
			}
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Product Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	// public function store_requirement()
	// {
	// 	$post_data = file_get_contents("php://input");
	// 	$request = json_decode($post_data);


	// 	if($request->project_id == '') {
	// 		$response['success'] = false;
	// 		$response['message'] = 'Project Id is Missing.';
	// 		header('Content-Type: application/json; charset=utf-8');
	// 		echo json_encode($response);exit();
	// 	}
	// 	if($request->user_id == '') {
	// 		$response['success'] = false;
	// 		$response['message'] = 'User Id is Missing.';
	// 		header('Content-Type: application/json; charset=utf-8');
	// 		echo json_encode($response);exit();
	// 	}


	// 	$project_query = $this->db->select('name,city_id')->where(['id' => $request->project_id])->get('projects');
	//     if($project_query->num_rows() > 0) {
	//         $city_id = $project_query->row()->city_id;
	//         $projectName = $project_query->row()->name;
	// 	}
	// 	$userdata = $this->db->select('cities.name as city_name,email,first_name,REPLACE(country_code, "+", "") AS countrycode,phone,users.name')
	// 				->from('users')
	// 				->join('cities','users.city_id=cities.id')
	// 				->where('users.id', $request->user_id)
	// 				->get()->row();
	// 	$q2 = $this->db->insert('requirements', array('user_id' => $request->user_id, 'project_id' => $request->project_id, 'created_at' => date('Y-m-d H:i:s')));
	// 	if($q2) {
	// 		$requirement_id = $this->db->insert_id();
	// 		for ($i=0; $i < count($request->categories); $i++) {
	// 			// for($j=0; $j < count($request->categories[$i]->category); $j++) {
	// 				// echo "<pre>";print_r($request->parent_category[$i]->category[$j]);
	// 				if($request->categories[$i]->has_subcategory == '0') {
	// 					$sku_id = NULL;
	// 					$q3 = $this->db->select('id')->where(['skus.brandsheet_id' => $request->categories[$i]->brand_sheet_id,'skus.city_id' => $city_id, 'skus.category_id' => $request->categories[$i]->category_id])->get('skus');
	// 					if($q3->num_rows() > 0) {
	// 						$sku_id = $q3->row()->id;
	// 					}
	// 					$q = $this->db->insert('requirement_skus', array('category_id' => $request->categories[$i]->category_id, 'is_selected' => $request->categories[$i]->is_selected_id, 'qty' => $request->categories[$i]->qty, 'sku_id ' => $sku_id, 'requirement_id' => $requirement_id, 'created_at' => date('Y-m-d H:i:s')));
	// 				} else {
	// 					for($k=0; $k < count($request->categories[$i]->sub_categories); $k++) {
	// 						$sku_id = NULL;
	// 						$q3 = $this->db->select('id')->where(['skus.brandsheet_id' => $request->categories[$i]->sub_categories[$k]->brand_sheet_id,'skus.city_id' => $city_id, 'skus.category_id' => $request->categories[$i]->category_id, 'skus.sub_category_id' => $request->categories[$i]->sub_categories[$k]->sub_category_id])->get('skus');
	// 						if($q3->num_rows() > 0) {
	// 							$sku_id = $q3->row()->id;
	// 						}
	// 						$q = $this->db->insert('requirement_skus', array('category_id' => $request->categories[$i]->category_id, 'sub_category_id' => $request->categories[$i]->sub_categories[$k]->sub_category_id, 'is_selected' => $request->categories[$i]->sub_categories[$k]->is_selected_id, 'qty' => $request->categories[$i]->qty, 'sku_id ' => $sku_id, 'requirement_id' => $requirement_id, 'created_at' => date('Y-m-d H:i:s')));
	// 					}
	// 				}
	// 			// }
	// 		}
	// 	}
	// 	// die();
	// 	// Include the main TCPDF library (search for installation path).
	// 	require_once(APPPATH.'TCPDF/tcpdf.php');

	// 	// create new PDF document
	// 	$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

	// 	// set default monospaced font
	// 	$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

	// 	// set image scale factor
	// 	$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

	// 	// set some language-dependent strings (optional)
	// 	if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
	// 		require_once(dirname(__FILE__).'/lang/eng.php');
	// 		$pdf->setLanguageArray($l);
	// 	}

	// 	// set default font subsetting mode
	// 	$pdf->setFontSubsetting(true);
	// 	// Add a page
	// 	// This method has several options, check the source code documentation for more information.
	// 	$pdf->AddPage();


	// 	$project_query = $this->db->select('carpet_area, interior_package_id')
	// 						->where('id', $request->project_id)
	// 						->get('projects')->row();

	// 	$interiorPackage_query = $this->db->select('headtitle')
	// 						->where('id', $project_query->interior_package_id)
	// 						->get('interior_packes')->row();

	// 	$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
	// 								<tr class="top" style="height: 154px;">
	// 									<td style="height: 154px;" colspan="5">
	// 										<table>
	// 											<tbody>
	// 												<tr>
	// 													<td class="title" style="width: 200px; padding: 10px;"><img style="height:150px"
	// 															src="OneSpace-Logo.png" />
	// 													</td>
	// 													<td style="padding:5px 25px ;">
	// 														<h3><strong>ONE SPACE INTERIOR PVT LTD <br>SALES</strong></h3>
	// 														SURAT Gujarat 395007<br />India<br />GSTIN: 24AADCO9416E1ZL
	// 													</td>
	// 												</tr>
	// 											</tbody>
	// 										</table>
	// 									</td>
	// 								</tr>
	// 								<tr class="information" style="height: 96px;">
	// 									<td style="height: 96px;  " colspan="5">
	// 										<table  >
	// 											<tbody>
	// 												<tr>
	// 													<td style="width: 350px">
	// 														<table   border="0">
	// 															<tbody>
	// 																<tr style="height: 10px;">
	// 																	<td style="width: 40%; height: 10px;">Project ID</td>
	// 																	<td style="width: 40%; height: 10px; text-align: left; font-weight: bold;">: '.$request->project_id.'
	// 																	</td>
	// 																</tr>
	// 																<tr style="height: 10px;">
	// 																	<td style="width: 40%; height: 10px;">Carpet area</td>
	// 																	<td style="width: 40%; height: 10px; text-align: left; font-weight: bold;">: '.$project_query->carpet_area.'
	// 																	</td>
	// 																</tr>
	// 																<tr style="height: 10px;">
	// 																	<td style="width: 40%; height: 10px;">Property type</td>
	// 																	<td style="width: 40%; height: 10px; text-align: left; font-weight: bold;">: '.($interiorPackage_query->headtitle).'
	// 																	</td>
	// 																</tr>
	// 																<tr style="height: 24px;">
	// 																	<td style="width: 40%; height: 24px;">Estimate Date</td>
	// 																	<td style="width: 40%; height: 24px; text-align: left; font-weight: bold;">: '.date('d/m/Y').'
	// 																	</td>
	// 																</tr>
	// 															</tbody>
	// 														</table>
	// 													</td>
	// 													<td style="width: 350px">
	// 														<table   border="0">
	// 															<tbody>
	// 																<tr style="height: 10px;">
	// 																	<td style="width: 35%; height: 10px;">Place Of Supply</td>
	// 																	<td style="width: 65%; height: 10px; text-align: left; font-weight: bold;">: '.$userdata->city_name.'
	// 																	</td>
	// 																</tr>
	// 																<tr style="height: 24px;">
	// 																	<td style="width: 50%; height: 24px;">&nbsp;</td>
	// 																	<td style="width: 50%; height: 24px; text-align: left;">&nbsp;</td>
	// 																</tr>
	// 																<tr style="height: 10px;">
	// 																	<td style="width: 50%; height: 10px;">&nbsp;</td>
	// 																	<td style="width: 50%; height: 10px; text-align: left;">&nbsp;</td>
	// 																</tr>
	// 															</tbody>
	// 														</table>
	// 													</td>
	// 												</tr>
	// 											</tbody>
	// 										</table>
	// 									</td>
	// 								</tr>
	// 								<tr style="height: 18px;">
	// 									<td style="height: 18px; background-color: #f0f0f0; font-weight: 600;" colspan="5">Bill To</td>
	// 								</tr>
	// 								<tr style="height: 87px;">
	// 									<td style="height: 87px;" colspan="5">
	// 										<h4>'.$projectName.'</h4>
	// 									</td>
	// 								</tr>
	// 								<tr class="heading" style="height: 18px; background-color: #f0f0f0; font-weight: 600; text-align: center;">
	// 									<td style="height: 18px; width: 5%;">#</td>
	// 									<td style="height: 18px; width: 45%">Item &amp; Description</td>
	// 									<td style="height: 18px; width: 10%;">Area</td>
	// 									<td style="height: 18px; width: 10%;">Brand</td>
	// 									<td style="height: 18px; width: 10%;">Available<br/>Size</td>
	// 									<td style="height: 18px; width: 10%;">Used<br/>Quantity</td>
	// 									<td style="height: 18px; width: 10%;">Sandard<br/>Size</td>
	// 								</tr>';

	// 	$total = 0;

	// 	$project_query = $this->db->select('carpet_area')
	// 						->where('id', $request->project_id)
	// 						->get('projects')->row();

	// 	$q4 = $this->db->select('categories.name AS category_name,categories.description AS category_description,categories.id AS category_id, multiplier_enabled, multiplier_value, sub_categories.name AS sub_category_name, brandsheets.name AS brand_sheet_name, requirement_skus.is_selected, price, requirement_skus.qty,skus.description as sku_description,skus.name as sku_name,skus.sku_code as sku_code,skus.available_size as available_size,skus.sq_ft as sq_ft')->join('categories', 'categories.id = requirement_skus.category_id', 'left')->join('sub_categories', 'sub_categories.id = requirement_skus.sub_category_id', 'left')->join('skus', 'skus.id = requirement_skus.sku_id', 'left')->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->where('requirement_skus.requirement_id', $requirement_id)->where('skus.city_id' ,$city_id)->where('requirement_skus.is_selected', 1)->order_by('categories.id', 'asc')->get('requirement_skus');

	// 		if($q4->num_rows() > 0) {
	// 			$i=1;
	// 			foreach ($q4->result() as $key => $value) {
	// 				$sub_category_name = 'No Sub Category';
	// 				$brand_sheet_name = 'No Brand Sheet';

	// 				$parentcategory = $value->category_id;
	// 				if(!empty($value->sub_category_name)) {
	// 					// $sub_category_name = 'Sub Category: '.$value->sub_category_name;
	// 					$item_description = $value->category_name.'<br/>Sub Category: '.$value->sub_category_name.'<br/>Sku: '.$value->sku_code.'<br/>'.$value->sku_description;
	// 				} else {
	// 					$item_description = $value->category_name.'<br/>Sku: '.$value->sku_code.'<br/>'.$value->sku_description;
	// 				}
	// 				if($value->is_selected == "1") {
	// 					$selected = 'Yes';
	// 				} else {
	// 					$selected = 'No';
	// 				}
	// 				if($value->multiplier_enabled == 1) {
	// 					$price = $this->calculateCarpetArea($value->price,$value->multiplier_value, $project_query->carpet_area);
	// 				} else {
	// 					$price = $value->price;
	// 				}
	// 				if($value->qty > 0) {
	// 					$price = $value->qty*$price."";
	// 				} else {
	// 					$price = $price;
	// 				}
	// 				if(empty($price)) {
	// 					$price = 0;
	// 				}
	// 				if(!empty($value->brand_sheet_name)) {
	// 					$brand_sheet_name = $value->brand_sheet_name;
	// 				}
	// 		        $total += $price;
	// 				$parentcategory = $this->db->select('parent_categories.name')->join('categories', 'categories.parent_category_id = parent_categories.id', 'left')->where('categories.id', $value->category_id)->get('parent_categories')->row()->name;
	// 				$html .= '<tr class="heading" style="height: 18px;">
	// 							<td style="height: 18px; width: 5%; ">'.$i++.'</td>
	// 							<td style="height: 18px; width: 45%;">
	// 								<span style="display: block; width:100%; font-weight: 600;">'.$item_description.'</span>
	// 							</td>
	// 							<td style="height: 18px; width: 10%;text-align: center;">
	// 								<span style="display: block; width:100%; font-weight: 600;">'.$parentcategory.'</span>
	// 							</td>
	// 							<td style="height: 18px; width: 10%;text-align: center;">
	// 							<span style="display: block; width:100%; font-weight: 600;">'.$value->brand_sheet_name.'</span>
	// 							</td>
	// 							<td style="height: 18px; width: 10%;text-align: center;">
	// 								<span style="display: block; width:100%; font-weight: 600;">'.$value->available_size.'</span>
	// 							</td>
	// 							<td style="height: 18px; width: 10%;text-align: center;">
	// 								<span style="display: block; width:100%; font-weight: 600;">'.(($value->is_selected==1 && ($value->qty==0||$value->qty==null)) ? 1 : $value->qty).'</span>
	// 							</td>
	// 							<td style="height: 18px; width: 10%;text-align: center;">
	// 								<span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
	// 							</td>
	// 							</tr>';

	// 							// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
	// 						}

	// 			$designFees = $total*10/100;
	// 			$grandTotal = $total + $designFees;
	// 			$discount = 0;
	// 			if ($request->coupon == 'OSPACE1') {
	// 				$discount = $grandTotal*1/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'ONESPACE2') {
	// 				$discount = $grandTotal*2/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'ONESAVE3') {
	// 				$discount = $grandTotal*3/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'ONESPACE4SAVE') {
	// 				$discount = $grandTotal*4/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'ONESAVES5') {
	// 				$discount = $grandTotal*5/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'SPACEDEAL6') {
	// 				$discount = $grandTotal*6/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'ONESPACE7OFF') {
	// 				$discount = $grandTotal*7/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'GET8ONESPACE') {
	// 				$discount = $grandTotal*8/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'SAVE9SPACE') {
	// 				$discount = $grandTotal*9/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'ONESAVE10') {
	// 				$discount = $grandTotal*10/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'OSPACE11OFF') {
	// 				$discount = $grandTotal*11/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'SAVEWITHOSPACE12') {
	// 				$discount = $grandTotal*12/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'DEAL13OSPACE') {
	// 				$discount = $grandTotal*13/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'SAVE14SPACE') {
	// 				$discount = $grandTotal*14/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			} else if ($request->coupon == 'GET15ONESPACE') {
	// 				$discount = $grandTotal*15/100;
	// 				$grandTotal = $grandTotal - $discount;
	// 			}

	// 			$html .= '<tr class="heading" style="height: 18px;width: 100%;">
	// 						<td colspan="2" style="width: 50%;">
	// 							<p>Looking forward for your business.MATTRESS, ELECTRONICS ,<br />DECORATIVE LIGHTS IS NOT INCLUSIVE
	// 								AS ITS SUBJECTIVE , AS PER<br />THE LOCATION WE CAN GIVE YOU THE BUDGET OF IT .
	// 								LOOKING<br />FORWAD FOR THE PROJECT, THANKS .</p>
	// 							<p> Account Name : Onespace Interior Private Limited<br />Bank Name : ICICI Bank<br />Account
	// 								No. : 428505000836<br />IFSC code : ICIC0004285</p>
	// 							<p> Terms &amp; Conditions<br>>10 % advance payment for starting the project<br />50 % payment after completing designing,3d,
	// 								and selection.<br />40 % after completing furniture work on factory.</p>
	// 							<p> <br>GST Will be Added as per Actual.<br>10 % Consulting Fees is non Refundable.</p>
	// 						</td>
	// 						<td style="vertical-align: top; text-align: right; width:50%;" colspan="1">
	// 									<tr style="font-weight: 600; border-bottom: 1px solid #000;">
	// 										<td style="text-align: right; width:50%">Total:  '.$this->value(number_format($total, 2, ".", "")).'</td>
	// 									</tr>
	// 									<tr style="font-weight: 600; border-bottom: 1px solid #000;">
	// 									<td style="text-align: right; width:50%">Design Fees:  '.$this->value(number_format($designFees, 2, ".", "")).'</td>
	// 									</tr>
	// 									<tr style="font-weight: 600; border-bottom: 1px solid #000;">
	// 									<td style="text-align: right; width:50%">Discount:  '.$this->value(number_format($discount, 2, ".", "")).'</td>
	// 									</tr>
	// 									<tr style="font-weight: 600; border-bottom: 1px solid #000;">
	// 									<td style="text-align: right; width:50%">Grand Total:  '.$this->value(number_format($grandTotal, 2, ".", "")).'</td>
	// 									</tr>
	// 						</td>
	// 					</tr>
	// 			</table>';
	// 		}



	// 	// Print text using writeHTMLCell()
	// 	$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, '', true);
	// 	// $requirement_id = 1;
	// 	// Close and output PDF document
	// 	// This method has several options, check the source code documentation for more information.

	// 	if(!file_exists($_SERVER['DOCUMENT_ROOT'].'public/customer/projects/'.$request->project_id)) {
	// 		mkdir($_SERVER['DOCUMENT_ROOT'].'public/customer/projects/'.$request->project_id);
	// 	}
	// 	$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'].'/public/customer/projects/'.$request->project_id.'/requirement-'.$requirement_id.'.pdf';
	// 	$requirement_quotation = 'public/customer/projects/'.$request->project_id.'/requirement-'.$requirement_id.'.pdf';
	// 	$pdf->Output($requirement_quotation_path, 'F');
	// 	// die;

	// 	$this->db->where(['project_id' => $request->project_id, 'id' => $requirement_id])->update('requirements', ['quotation_path' => $requirement_quotation, 'quotation_price' => $grandTotal, 'updated_at' => date('Y-m-d H:i:s')]);

	// 	// echo $this->db->last_query();die();

	// 	if($q4) {
	// 			$this->sendEmail($userdata->email, 'OneSpace Interior Requirement Update','Dear '.$userdata->first_name.',

	// 			We hope you\'re having a great day. We\'re thrilled to inform you that your new project requirement for OneSpace Interior has been received. You can view requirement details and a free quote for the same in "Project Details" page. 
	// 			Thank you for choosing us to bring your vision to life. 

	// 			Thanks,
	// 			Onespace Interiors');
	// 			$this->sendWhatsappMessage($userdata->first_name,'91'.$userdata->phone.'','requirement_created',"https://onespaceinterior.com/".$requirement_quotation,$projectName);

	// 		$response['success'] = true;
	// 		$response['message'] = 'Data Inserted Successfully.';
	// 		$response['requirement_quotation'] = "https://onespaceinterior.com/".$requirement_quotation;
	// 		header('Content-Type: application/json; charset=utf-8');
	// 		echo json_encode($response);exit();
	// 	} else {
	// 		$response['success'] = false;
	// 		$response['message'] = 'Error Occurred While Inserting Data.';
	// 		header('Content-Type: application/json; charset=utf-8');
	// 		echo json_encode($response);exit();
	// 	}
	// }

	public function store_requirement_V2()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);

		$unitKeyWord = "UNIT";
		if ($request->project_id == '') {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->user_id == '') {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}


		$project_query = $this->db->select('name,city_id')->where(['id' => $request->project_id])->get('projects');
		if ($project_query->num_rows() > 0) {
			$city_id = $project_query->row()->city_id;
			$projectName = $project_query->row()->name;
		}
		$userdata = $this->db->select('cities.name as city_name,email,first_name,REPLACE(country_code, "+", "") AS countrycode,phone,users.name')
			->from('users')
			->join('cities', 'users.city_id=cities.id')
			->where('users.id', $request->user_id)
			->get()->row();
		$q2 = $this->db->insert('requirements', array('user_id' => $request->user_id, 'project_id' => $request->project_id, 'created_at' => date('Y-m-d H:i:s')));
		if ($q2) {
			$requirement_id = $this->db->insert_id();
			for ($i = 0; $i < count($request->categories); $i++) {
				// for($j=0; $j < count($request->categories[$i]->category); $j++) {
				// echo "<pre>";print_r($request->parent_category[$i]->category[$j]);
				if ($request->categories[$i]->has_subcategory == '0') {
					$sku_id = NULL;
					$q3 = $this->db->select('id')->where(['skus.brandsheet_id' => $request->categories[$i]->brand_sheet_id, 'skus.city_id' => $city_id, 'skus.category_id' => $request->categories[$i]->category_id])->get('skus');
					if ($q3->num_rows() > 0) {
						$sku_id = $q3->row()->id;
						$q = $this->db->insert('requirement_skus', array('category_id' => $request->categories[$i]->category_id, 'is_selected' => $request->categories[$i]->is_selected_id, 'qty' => $request->categories[$i]->qty, 'sku_id ' => $sku_id, 'requirement_id' => $requirement_id, 'created_at' => date('Y-m-d H:i:s')));
					}
				} else {
					for ($k = 0; $k < count($request->categories[$i]->sub_categories); $k++) {
						$sku_id = NULL;
						$q3 = $this->db->select('id')->where(['skus.brandsheet_id' => $request->categories[$i]->sub_categories[$k]->brand_sheet_id, 'skus.city_id' => $city_id, 'skus.category_id' => $request->categories[$i]->category_id, 'skus.sub_category_id' => $request->categories[$i]->sub_categories[$k]->sub_category_id])->get('skus');
						if ($q3->num_rows() > 0) {
							$sku_id = $q3->row()->id;
							$q = $this->db->insert('requirement_skus', array('category_id' => $request->categories[$i]->category_id, 'sub_category_id' => $request->categories[$i]->sub_categories[$k]->sub_category_id, 'is_selected' => $request->categories[$i]->sub_categories[$k]->is_selected_id, 'qty' => $request->categories[$i]->qty, 'sku_id ' => $sku_id, 'requirement_id' => $requirement_id, 'created_at' => date('Y-m-d H:i:s')));
						}
					}
				}
				// }
			}
		}



		// Include the main TCPDF library and TCPDI.
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		require_once(APPPATH . 'TCPDF/FPDI/src/autoload.php');
		// require_once(APPPATH.'TCPDF/FPDI/src/PdfParser/StreamReader.php');
		require_once(APPPATH . 'TCPDF/signpdf.php');


		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/startingPages.pdf');
		$pdf = new Pdf();
		$pdf->SetAutoPageBreak(false);
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
			$tplIdx = $pdf->importPage($pageNo);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
		}

		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg1.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

		$project_query = $this->db->select('carpet_area, interior_package_id')
			->where('id', $request->project_id)
			->get('projects')->row();

		$interiorPackage_query = $this->db->select('headtitle')
			->where('id', $project_query->interior_package_id)
			->get('interior_packes')->row();

		$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
									<tr>
									<td style="width: 100px; "></td>
									<td style="width: 100%; font-weight: bold;color: #fff; font-size:40px;">DREAM HOME INTERIOR QUOTATION<br>
									</td>
									</tr>
									<tr>
									<td style="width: 200px; "></td>
									<td style="width: 100%;text-align: left; font-weight: bold;color: #000;font-size:34px;">
									Project ID: ' . $request->project_id . '<br>Project Name: ' . $projectName . '<br>
									Carpet Area: ' . $project_query->carpet_area . '<br>Property type: ' . $interiorPackage_query->headtitle . '<br>City: ' . $userdata->city_name . '<br>Estimate Date: ' . date('d/m/Y') . '
									</td>
									</tr>
									<tr>
									<td style="width: 200px; "></td>
									<td style="width: 100%;text-align: left; font-weight: normal;color: #000;font-size:14px;">
									Here is the quote for your dream home interior that you requested.</td>
									</tr>
									</table>';

		$pdf->writeHTML($html, true, false, true, false, '');
		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

		$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="2">
						<tr>
						<td style="width: 20px; "></td>
						<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION<br>
						</td>
						</tr>
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 18px; width: 5%;">Sr.No</td>
							<td style="height: 18px; width: 45%">Item &amp; Description</td>
							<td style="height: 18px; width: 10%;">Area</td>
							<td style="height: 18px; width: 10%;">Brand</td>
							<td style="height: 18px; width: 10%;">Available<br/>Size</td>
							<td style="height: 18px; width: 10%;">Used<br/>Quantity</td>
							<td style="height: 18px; width: 10%;">Standard<br/>Size</td>
						</tr>';

		$total = 0;
		$totalCarpet = 0;
		$totalUnit = 0;
		$totalQty = 0;

		$project_query = $this->db->select('carpet_area')
			->where('id', $request->project_id)
			->get('projects')->row();

		$q4 = $this->db->select('categories.name AS category_name,categories.description AS category_description,categories.id AS category_id, multiplier_enabled, multiplier_value, sub_categories.name AS sub_category_name, brandsheets.name AS brand_sheet_name, requirement_skus.is_selected, price, requirement_skus.qty,skus.description as sku_description,skus.name as sku_name,skus.sku_code as sku_code,skus.available_size as available_size,skus.sq_ft as sq_ft')->join('categories', 'categories.id = requirement_skus.category_id', 'left')->join('sub_categories', 'sub_categories.id = requirement_skus.sub_category_id', 'left')->join('skus', 'skus.id = requirement_skus.sku_id', 'left')->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->where('requirement_skus.requirement_id', $requirement_id)->where('skus.city_id', $city_id)->where('requirement_skus.is_selected', 1)->order_by('categories.id', 'asc')->get('requirement_skus');

		$maintotal = 0;
		$maindesignFees = 0;
		$maindiscount = 0;
		$maingrandTotal = 0;
		if ($q4->num_rows() > 0) {
			$i = 1;
			foreach ($q4->result() as $key => $value) {
				if ($i % 10 == 0) {
					$pdf->writeHTML($html, true, false, true, false, '');
					$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
					$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
					$tplIdx = $pdf->importPage(1);
					$size = $pdf->getTemplateSize($tplIdx);
					$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
					$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

					$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
											<tr>
											<td style="width: 20px; "></td>
											<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION<br>
											</td>
											</tr>';
				}
				$sub_category_name = 'No Sub Category';
				$brand_sheet_name = 'No Brand Sheet';

				$parentcategory = $value->category_id;
				if (!empty($value->sub_category_name)) {
					// $sub_category_name = 'Sub Category: '.$value->sub_category_name;
					$item_description = $value->category_name . ' (' . $value->sku_code . ')<br/>Sub Category: ' . $value->sub_category_name . '<br/>' . $value->sku_description;
				} else {
					$item_description = $value->category_name . ' (' . $value->sku_code . ')<br/>' . $value->sku_description;
				}
				if ($value->is_selected == "1") {
					$selected = 'Yes';
				} else {
					$selected = 'No';
				}
				if ($value->multiplier_enabled == 1) {
					$price = $this->calculateCarpetArea($value->price, $value->multiplier_value, $project_query->carpet_area);
				} else {
					$price = $value->price;
				}
				if ($value->qty > 0) {
					$price = $value->qty * $price . "";
				} else {
					$price = $price;
				}
				if (empty($price)) {
					$price = 0;
				}
				if (!empty($value->brand_sheet_name)) {
					$brand_sheet_name = $value->brand_sheet_name;
				}
				// $totalCarpet += ($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft);
				$totalCarpet += str_contains($value->available_size, '\'') ? ($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft) : 0;
				$totalUnit += str_contains($value->available_size, '\'') ? 0 : ($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft);
				$totalQty += ($value->is_selected == 1 && ($value->qty == 0 || $value->qty == null)) ? 1 : $value->qty;
				$total += $price;
				$measure = str_contains($value->available_size, '\'') ? 'SQFT' : 'UNIT';
				$qty = (($value->is_selected == 1 && ($value->qty == 0 || $value->qty == null)) ? 1 : $value->qty);
				$parentcategory = $this->db->select('parent_categories.name')->join('categories', 'categories.parent_category_id = parent_categories.id', 'left')->where('categories.id', $value->category_id)->get('parent_categories')->row()->name;
				$html .= '<tr class="heading" style="height: 18px;">
							<td style="height: 18px; width: 5%; text-align: center;">' . $i++ . '</td>
							<td style="height: 18px; width: 45%;">
								<span style="display: block; width:100%; font-weight: 600;">' . $item_description . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . $parentcategory . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
							<span style="display: block; width:100%; font-weight: 600;">' . $value->brand_sheet_name . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . $value->available_size . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . ($qty) . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . ($value->multiplier_enabled == 1 ? ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft)) . '<br/>' . $measure . '</span>
							</td>
							</tr>';
				// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
			}
			$designFees = $total * 10 / 100;
			$grandTotal = $total + $designFees;
			$discount = 0;

			$discountPercentage = $this->db->select('discountPercentage')
				->where('couponCode', $request->coupon)
				->get('coupon_codes')->row()->discountPercentage;
			$discount = $grandTotal * $discountPercentage / 100;
			$grandTotal = $grandTotal - $discount;

			if ($q4->num_rows() % 10 > 7 && $q4->num_rows() > 9) {
				$pdf->writeHTML($html, true, false, true, false, '');
				$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
				$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
				$tplIdx = $pdf->importPage(1);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

				$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
										<tr>
										<td style="width: 20px;"></td>
										<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION<br>
										</td>
										</tr>';
			}
			$totalUnitKey =  $totalUnit == 0 ? '' : '' . $totalUnit . ' UNIT';
			$html .= '<tr class="heading" style="height: 18px;">
						<hr>
							<td style="height: 18px; width: 5%; text-align: center;"></td>
							<td style="height: 18px; width: 75%;">
								<span style="display: block; width:100%; font-weight: bold;font-size:18px;">Total</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: bold;font-size:18px;">' . $totalQty . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: bold;font-size:18px;">' . $totalCarpet . ' SQFT<br/>' . $totalUnitKey . '</span>
							</td>
						<hr>
						</tr>
						<tr class="heading" style="height: 18px;width: 100%;">
						<td colspan="2" style="width: 80%;">
						</td>
						<td style="vertical-align: top; text-align: left; width: 20%;" colspan="1">
									<tr style="font-weight: bold; border-bottom: 1px solid #000;">
										<td style="text-align: left; padding: 10px; font-size:20px;">Total:  ' . $this->value(number_format($total, 2, ".", "")) . '</td>
									</tr>
									<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="text-align: left; padding: 10px; font-size:20px;">Design Fees:  ' . $this->value(number_format($designFees, 2, ".", "")) . '</td>
									</tr>';
			if ($discount != 0) {
				$html .= '<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="text-align: left; padding: 10px; font-size:20px;">Discount(' . $request->coupon . '):  ' . $this->value(number_format($discount, 2, ".", "")) . '</td>
									</tr>';
			}
			$html .= '<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="text-align: left;  padding: 10px; font-size:20px;">Grand Total:  ' . $this->value(number_format($grandTotal, 2, ".", "")) . '</td>
									</tr>
						</td>
						<td colspan="2" style="width: 5%;">
						</td>
					</tr>
			</table>';
			$maintotal = $total;
			$maindesignFees = $designFees;
			$maindiscount = $discount;
			$maingrandTotal = $grandTotal;
		}
		$pdf->writeHTML($html, true, false, true, false, '');

		if ($this->isOneSpaceNumberInArray($userdata->phone)) {
			$totalVal = array();
			$totalCarpetVal = array();
			$totalUnitVal = array();
			$totalQtyVal = array();
			$totalNameVal = array();
			for ($j = 1; $j < 7; $j++) {
				$q4 = $this->db->select('categories.name AS category_name,categories.description AS category_description,categories.id AS category_id, multiplier_enabled, multiplier_value, sub_categories.name AS sub_category_name, brandsheets.name AS brand_sheet_name, requirement_skus.is_selected, price, requirement_skus.qty,skus.description as sku_description,skus.name as sku_name,skus.sku_code as sku_code,skus.available_size as available_size,skus.sq_ft as sq_ft,parent_categories.name as parentCategoryName,parent_categories.id')
					->join('categories', 'categories.id = requirement_skus.category_id', 'left')
					->join('sub_categories', 'sub_categories.id = requirement_skus.sub_category_id', 'left')
					->join('skus', 'skus.id = requirement_skus.sku_id', 'left')
					->join('parent_categories', 'parent_categories.id = categories.parent_category_id', 'left')
					->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')
					->where('requirement_skus.requirement_id', $requirement_id)
					->where('skus.city_id', $city_id)
					->where('parent_categories.id', $j)
					->where('requirement_skus.is_selected', 1)
					->order_by('categories.id', 'asc')
					->get('requirement_skus');

				if ($q4->num_rows() > 0) {
					$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
					$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
					$tplIdx = $pdf->importPage(1);
					$size = $pdf->getTemplateSize($tplIdx);
					$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
					$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
					$total = 0;
					$totalCarpet = 0;
					$totalUnit = 0;
					$totalQty = 0;
					$i = 1;
					$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="2">
						<tr>
						<td style="width: 20px; "></td>
						<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (' . $q4->row()->parentCategoryName . ')<br>
						</td>
						</tr>
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 18px; width: 5%;">Sr.No</td>
							<td style="height: 18px; width: 45%">Item &amp; Description</td>
							<td style="height: 18px; width: 10%;">Area</td>
							<td style="height: 18px; width: 10%;">Brand</td>
							<td style="height: 18px; width: 10%;">Available<br/>Size</td>
							<td style="height: 18px; width: 10%;">Used<br/>Quantity</td>
							<td style="height: 18px; width: 10%;">Standard<br/>Size</td>
						</tr>';
					foreach ($q4->result() as $key => $value) {
						if ($i % 10 == 0) {
							$pdf->writeHTML($html, true, false, true, false, '');
							$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
							$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
							$tplIdx = $pdf->importPage(1);
							$size = $pdf->getTemplateSize($tplIdx);
							$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
							$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

							$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
											<tr>
											<td style="width: 20px; "></td>
											<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (' . $q4->row()->parentCategoryName . ')<br>
											</td>
											</tr>';
						}
						$sub_category_name = 'No Sub Category';
						$brand_sheet_name = 'No Brand Sheet';

						$parentcategory = $value->category_id;
						if (!empty($value->sub_category_name)) {
							// $sub_category_name = 'Sub Category: '.$value->sub_category_name;
							$item_description = $value->category_name . ' (' . $value->sku_code . ')<br/>Sub Category: ' . $value->sub_category_name . '<br/>' . $value->sku_description;
						} else {
							$item_description = $value->category_name . ' (' . $value->sku_code . ')<br/>' . $value->sku_description;
						}
						if ($value->is_selected == "1") {
							$selected = 'Yes';
						} else {
							$selected = 'No';
						}
						if ($value->multiplier_enabled == 1) {
							$price = $this->calculateCarpetArea($value->price, $value->multiplier_value, $project_query->carpet_area);
						} else {
							$price = $value->price;
						}
						if ($value->qty > 0) {
							$price = $value->qty * $price . "";
						} else {
							$price = $price;
						}
						if (empty($price)) {
							$price = 0;
						}
						if (!empty($value->brand_sheet_name)) {
							$brand_sheet_name = $value->brand_sheet_name;
						}
						$qty = ($value->is_selected == 1 && ($value->qty == 0 || $value->qty == null)) ? 1 : $value->qty;
						$totalQty += ($value->is_selected == 1 && ($value->qty == 0 || $value->qty == null)) ? 1 : $value->qty;
						$totalCarpet += str_contains($value->available_size, '\'') ? ($value->multiplier_enabled == 1 ? ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft)) : 0;
						$totalUnit += str_contains($value->available_size, '\'') ? 0 : ($value->multiplier_enabled == 1 ? ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft));
						$total += $price;
						$measure = str_contains($value->available_size, '\'') ? 'SQFT' : 'UNIT';
						$parentcategory = $this->db->select('parent_categories.name')->join('categories', 'categories.parent_category_id = parent_categories.id', 'left')->where('categories.id', $value->category_id)->get('parent_categories')->row()->name;
						$html .= '<tr class="heading" style="height: 18px;">
							<td style="height: 18px; width: 5%; text-align: center;">' . $i++ . '</td>
							<td style="height: 18px; width: 45%;">
								<span style="display: block; width:100%; font-weight: 600;">' . $item_description . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . $parentcategory . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
							<span style="display: block; width:100%; font-weight: 600;">' . $value->brand_sheet_name . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . $value->available_size . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . ($qty) . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . ($value->multiplier_enabled == 1 ? ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft)) . '<br/>' . $measure . '</span>
							</td>
							</tr>';
						// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
					}
					$designFees = $total * 10 / 100;
					$grandTotal = $total + $designFees;
					$discount = 0;
					$discount = $grandTotal * $discountPercentage / 100;
					$grandTotal = $grandTotal - $discount;
					if ($q4->num_rows() % 10 > 7 && $q4->num_rows() > 9) {
						$pdf->writeHTML($html, true, false, true, false, '');
						$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
						$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
						$tplIdx = $pdf->importPage(1);
						$size = $pdf->getTemplateSize($tplIdx);
						$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
						$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

						$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
										<tr>
										<td style="width: 20px;"></td>
										<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (' . $q4->row()->parentCategoryName . ')<br>
										</td>
										</tr>';
					}
					$totalUnitKey =  $totalUnit == 0 ? '' : '' . $totalUnit . ' UNIT';
					$html .= '<tr class="heading" style="height: 18px;">
						<hr>
							<td style="height: 18px; width: 5%; text-align: center;"></td>
							<td style="height: 18px; width: 75%;">
								<span style="display: block; width:100%; font-weight: bold;font-size:18px;">Total</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: bold;font-size:18px;">' . $totalQty . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: bold;font-size:18px;">' . $totalCarpet . ' SQFT<br/>' . $totalUnitKey . '</span>
							</td>
						<hr>
						</tr>
			</table>';

					$pdf->writeHTML($html, true, false, true, false, '');
					array_push($totalNameVal, $q4->row()->parentCategoryName);
					array_push($totalCarpetVal, $totalCarpet);
					array_push($totalUnitVal, $totalUnit);
					array_push($totalQtyVal, $totalQty);
					array_push($totalVal, $this->value(number_format($total, 2, ".", "")));
				}
			}
			$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			$tplIdx = $pdf->importPage(1);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

			$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
									<tr>
									<td style="width: 20px; "></td>
									<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (Summary)<br>
									</td>
									</tr>
									<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="2">
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 10%;font-size:26px"></td>
							<td style="height: 18px; width: 30%;font-size:26px">Item &amp; Description</td>
							<td style="height: 18px; width: 12%;font-size:26px">Used<br/>Quantity</td>
							<td style="height: 18px; width: 19%;font-size:26px">Standard<br/>Size</td>
							<td style="height: 18px; width: 12%;font-size:26px">Amount</td>
							<td style="height: 18px; width: 10%;font-size:26px"></td>
						</tr>';
			$valval = 0;

			$totalQtyValMain = 0;
			$totalCarpetValMain = 0;
			$totalUnitValMain = 0;
			foreach ($totalNameVal as $x) {
				$totalUnitKey =  $totalUnitVal[$valval] == 0 ? '' : '' . $totalUnitVal[$valval] . ' UNIT';
				$html .= '<br><tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 10%;font-size:20px">    </td>
							<td style="height: 18px; width: 30%;font-size:20px">' . $x . '</td>
							<td style="height: 18px; width: 12%;font-size:20px">' . $totalQtyVal[$valval] . '</td>
							<td style="height: 18px; width: 19%;font-size:20px">' . $totalCarpetVal[$valval] . ' SQFT<br>' . $totalUnitKey . '</td>
							<td style="height: 18px; width: 12%;font-size:20px">' . $totalVal[$valval] . '</td>
							<td style="height: 18px; width: 10%;"></td>
						</tr><br>';
				$totalQtyValMain += $totalQtyVal[$valval];
				$totalCarpetValMain += $totalCarpetVal[$valval];
				$totalUnitValMain += $totalUnitVal[$valval];
				$valval += 1;
			}

			$totalUnitKey =  $totalUnitValMain == 0 ? '' : '' . $totalUnitValMain . ' UNIT';
			$html .= '
			<tr class="heading" style="height: 18px;width: 100%;">
			<hr>
						<td colspan="2" style="width: 10%;">
							<span style="display: block; width:100%; font-weight: bold;font-size:18px;"></span>
						</td>
						<td colspan="2" style="width: 30%;text-align: center;">
							<span style="display: block; width:100%; font-weight: bold;font-size:26px;">Total</span>
						</td>
						<td colspan="2" style="width: 12%;text-align: center; ">
							<span style="display: block; width:100%; font-weight: bold;font-size:26px;">' . $totalQtyValMain . '</span>
						</td>
						<td colspan="2" style="width: 19%;text-align: center; ">
							<span style="display: block; width:100%; font-weight: bold;font-size:26px;">' . $totalCarpetValMain . ' SQFT<br>' . $totalUnitKey . '</span>
						</td>
						<td style="vertical-align: top; text-align: center; width: 12%;" colspan="1">
									<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="  padding: 10px; font-size:26px;">' . $this->value(number_format($maintotal, 2, ".", "")) . '</td>
									</tr>
						</td>
						<td style="vertical-align: top; text-align: center; width: 17%;" colspan="1">
						</td>
						<td colspan="2" style="width: 5%;">
						</td>
					</tr><br><br>
					<tr class="heading" style="height: 18px;width: 100%;">
						<hr>
						<td colspan="2" style="width: 71%;">
							<span style="display: block; width:100%; font-weight: bold;font-size:20px;"></span>
						</td>
						<td style="vertical-align: top; text-align: left; width: 29%;" colspan="1">
									<tr style="font-weight: bold; border-bottom: 1px solid #000;">
										<td style="text-align: left; padding: 10px; font-size:20px;">Total:  ' . $this->value(number_format($maintotal, 2, ".", "")) . '</td>
									</tr>
									<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="text-align: left; padding: 10px; font-size:20px;">Design Fees:  ' . $this->value(number_format($maindesignFees, 2, ".", "")) . '</td>
									</tr>';
			if ($maindiscount != 0) {
				$html .= '<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="text-align: left; padding: 10px; font-size:20px;">Discount(' . $request->coupon . '):  ' . $this->value(number_format($maindiscount, 2, ".", "")) . '</td>
									</tr>';
			}
			$html .= '
									<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="text-align: left;  padding: 10px; font-size:20px;">Grand Total:  ' . $this->value(number_format($maingrandTotal, 2, ".", "")) . '</td>
									</tr>
						</td>
						<td colspan="2" style="width: 5%;">
						</td>
					</tr>
			</table>';

			$pdf->writeHTML($html, true, false, true, false, '');
		}
		//Area Wise
		if ($this->isOneSpaceNumberInArray($userdata->phone)) {


			$totalVal = array();
			$totalCarpetVal = array();
			$totalUnitVal = array();
			$totalQtyVal = array();
			$totalNameVal = array();
			$furnitureCategoryName = "";
			for ($j = 1; $j < 6; $j++) {
				$q4 = $this->db->select('categories.name AS category_name,categories.description AS category_description,categories.id AS category_id, multiplier_enabled, multiplier_value, sub_categories.name AS sub_category_name, brandsheets.name AS brand_sheet_name, requirement_skus.is_selected, price, requirement_skus.qty,skus.description as sku_description,skus.name as sku_name,skus.sku_code as sku_code,skus.available_size as available_size,skus.sq_ft as sq_ft,parent_categories.name as parentCategoryName,parent_categories.id')
					->join('categories', 'categories.id = requirement_skus.category_id', 'left')
					->join('sub_categories', 'sub_categories.id = requirement_skus.sub_category_id', 'left')
					->join('skus', 'skus.id = requirement_skus.sku_id', 'left')
					->join('parent_categories', 'parent_categories.id = categories.parent_category_id', 'left')
					->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')
					->where('requirement_skus.requirement_id', $requirement_id)
					->where('skus.city_id', $city_id)
					->where('categories.furnitureCategory', $j)
					->where('requirement_skus.is_selected', 1)
					->order_by('categories.id', 'asc')
					->get('requirement_skus');

				if ($j == 1) {
					$furnitureCategoryName = "Basic Requirement";
				} else if ($j == 2) {
					$furnitureCategoryName = "Furniture";
				} else if ($j == 3) {
					$furnitureCategoryName = "Furnishing";
				} else if ($j == 4) {
					$furnitureCategoryName = "Decorative";
				} else if ($j == 5) {
					$furnitureCategoryName = "ADDITIONAL OR SPECIAL";
				}
				if ($q4->num_rows() > 0) {
					$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
					$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
					$tplIdx = $pdf->importPage(1);
					$size = $pdf->getTemplateSize($tplIdx);
					$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
					$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
					$total = 0;
					$totalCarpet = 0;
					$totalUnit = 0;
					$totalQty = 0;
					$i = 1;
					$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="2">
						<tr>
						<td style="width: 20px; "></td>
						<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (' . $furnitureCategoryName . ')<br>
						</td>
						</tr>
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 18px; width: 5%;">Sr.No</td>
							<td style="height: 18px; width: 45%">Item &amp; Description</td>
							<td style="height: 18px; width: 10%;">Area</td>
							<td style="height: 18px; width: 10%;">Brand</td>
							<td style="height: 18px; width: 10%;">Available<br/>Size</td>
							<td style="height: 18px; width: 10%;">Used<br/>Quantity</td>
							<td style="height: 18px; width: 10%;">Standard<br/>Size</td>
						</tr>';
					foreach ($q4->result() as $key => $value) {
						if ($i % 10 == 0) {
							$pdf->writeHTML($html, true, false, true, false, '');
							$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
							$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
							$tplIdx = $pdf->importPage(1);
							$size = $pdf->getTemplateSize($tplIdx);
							$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
							$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

							$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
											<tr>
											<td style="width: 20px; "></td>
											<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (' . $furnitureCategoryName . ')<br>
											</td>
											</tr>';
						}
						$sub_category_name = 'No Sub Category';
						$brand_sheet_name = 'No Brand Sheet';

						$parentcategory = $value->category_id;
						if (!empty($value->sub_category_name)) {
							// $sub_category_name = 'Sub Category: '.$value->sub_category_name;
							$item_description = $value->category_name . ' (' . $value->sku_code . ')<br/>Sub Category: ' . $value->sub_category_name . '<br/>' . $value->sku_description;
						} else {
							$item_description = $value->category_name . ' (' . $value->sku_code . ')<br/>' . $value->sku_description;
						}
						if ($value->is_selected == "1") {
							$selected = 'Yes';
						} else {
							$selected = 'No';
						}
						if ($value->multiplier_enabled == 1) {
							$price = $this->calculateCarpetArea($value->price, $value->multiplier_value, $project_query->carpet_area);
						} else {
							$price = $value->price;
						}
						if ($value->qty > 0) {
							$price = $value->qty * $price . "";
						} else {
							$price = $price;
						}
						if (empty($price)) {
							$price = 0;
						}
						if (!empty($value->brand_sheet_name)) {
							$brand_sheet_name = $value->brand_sheet_name;
						}
						$qty = (($value->is_selected == 1 && ($value->qty == 0 || $value->qty == null)) ? 1 : $value->qty);
						$totalQty += ($value->is_selected == 1 && ($value->qty == 0 || $value->qty == null)) ? 1 : $value->qty;
						// $totalCarpet += ($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft);
						$totalCarpet += str_contains($value->available_size, '\'') ? ($value->multiplier_enabled == 1 ? ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft)) : 0;
						$totalUnit += str_contains($value->available_size, '\'') ? 0 : ($value->multiplier_enabled == 1 ?  ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft));
						$total += $price;
						$measure = str_contains($value->available_size, '\'') ? 'SQFT' : 'UNIT';
						$parentcategory = $this->db->select('parent_categories.name')->join('categories', 'categories.parent_category_id = parent_categories.id', 'left')->where('categories.id', $value->category_id)->get('parent_categories')->row()->name;
						$html .= '<tr class="heading" style="height: 18px;">
							<td style="height: 18px; width: 5%; text-align: center;">' . $i++ . '</td>
							<td style="height: 18px; width: 45%;">
								<span style="display: block; width:100%; font-weight: 600;">' . $item_description . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . $parentcategory . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
							<span style="display: block; width:100%; font-weight: 600;">' . $value->brand_sheet_name . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . $value->available_size . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . ($qty) . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;">' . ($value->multiplier_enabled == 1 ?  ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft)) . '<br/>' . $measure . '</span>
							</td>
							</tr>';
						// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
					}
					$designFees = $total * 10 / 100;
					$grandTotal = $total + $designFees;
					$discount = 0;
					$discount = $grandTotal * $discountPercentage / 100;
					$grandTotal = $grandTotal - $discount;
					if ($q4->num_rows() % 10 > 7 && $q4->num_rows() > 9) {
						$pdf->writeHTML($html, true, false, true, false, '');
						$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
						$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
						$tplIdx = $pdf->importPage(1);
						$size = $pdf->getTemplateSize($tplIdx);
						$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
						$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

						$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
										<tr>
										<td style="width: 20px;"></td>
										<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (' . $furnitureCategoryName . ')<br>
										</td>
										</tr>';
					}

					$totalUnitKey =  $totalUnit == 0 ? '' : '' . $totalUnit . ' UNIT';
					$html .= '<tr class="heading" style="height: 18px;">
						<hr>
							<td style="height: 18px; width: 5%; text-align: center;"></td>
							<td style="height: 18px; width: 75%;">
								<span style="display: block; width:100%; font-weight: bold;font-size:18px;">Total</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: bold;font-size:18px;">' . $totalQty . '</span>
							</td>
							<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: bold;font-size:18px;">' . $totalCarpet . ' SQFT<br/>' . $totalUnitKey . '</span>
							</td>
						<hr>
						</tr>
			</table>';

					$pdf->writeHTML($html, true, false, true, false, '');
					array_push($totalNameVal, $furnitureCategoryName);
					array_push($totalCarpetVal, $totalCarpet);
					array_push($totalUnitVal, $totalUnit);
					array_push($totalQtyVal, $totalQty);
					array_push($totalVal, $this->value(number_format($total, 2, ".", "")));
				}
			}
			$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			$tplIdx = $pdf->importPage(1);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

			$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
									<tr>
									<td style="width: 20px; "></td>
									<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (Catergory Breakdown)<br>
									</td>
									</tr>
									<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="2">
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 10%;font-size:26px"></td>
							<td style="height: 18px; width: 30%;font-size:26px">Item &amp; Description</td>
							<td style="height: 18px; width: 12%;font-size:26px">Used<br/>Quantity</td>
							<td style="height: 18px; width: 19%;font-size:26px">Standard<br/>Size</td>
							<td style="height: 18px; width: 12%;font-size:26px">Amount</td>
							<td style="height: 18px; width: 10%;font-size:26px"></td>
						</tr>';
			$valval = 0;

			$totalQtyValMain = 0;
			$totalCarpetValMain = 0;
			$totalUnitValMain = 0;
			foreach ($totalNameVal as $x) {

				$totalUnitKey =  $totalUnitVal[$valval] == 0 ? '' : '' . $totalUnitVal[$valval] . ' UNIT';
				$html .= '<br><tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 10%;font-size:20px">    </td>
							<td style="height: 18px; width: 30%;font-size:20px">' . $x . '</td>
							<td style="height: 18px; width: 12%;font-size:20px">' . $totalQtyVal[$valval] . '</td>
							<td style="height: 18px; width: 19%;font-size:20px">' . $totalCarpetVal[$valval] . ' SQFT<br>' . $totalUnitKey . '</td>
							<td style="height: 18px; width: 12%;font-size:20px">' . $totalVal[$valval] . '</td>
							<td style="height: 18px; width: 10%;"></td>
						</tr><br>';
				$totalQtyValMain += $totalQtyVal[$valval];
				$totalCarpetValMain += $totalCarpetVal[$valval];
				$totalUnitValMain += $totalUnitVal[$valval];
				$valval += 1;
			}

			$totalUnitKey =  $totalUnitValMain == 0 ? '' : '' . $totalUnitValMain . ' UNIT';
			$html .= '
			<tr class="heading" style="height: 18px;width: 100%;">
			<hr>
						<td colspan="2" style="width: 10%;">
							<span style="display: block; width:100%; font-weight: bold;font-size:18px;"></span>
						</td>
						<td colspan="2" style="width: 30%;text-align: center;">
							<span style="display: block; width:100%; font-weight: bold;font-size:26px;">Total</span>
						</td>
						<td colspan="2" style="width: 12%;text-align: center; ">
							<span style="display: block; width:100%; font-weight: bold;font-size:26px;">' . $totalQtyValMain . '</span>
						</td>
						<td colspan="2" style="width: 19%;text-align: center; ">
							<span style="display: block; width:100%; font-weight: bold;font-size:26px;">' . $totalCarpetValMain . 'SQFT<br>' . $totalUnitKey . '</span>
						</td>
						<td style="vertical-align: top; text-align: center; width: 12%;" colspan="1">
									<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="  padding: 10px; font-size:26px;">' . $this->value(number_format($maintotal, 2, ".", "")) . '</td>
									</tr>
						</td>
						<td style="vertical-align: top; text-align: center; width: 10%;" colspan="1">
						</td>
						<td colspan="2" style="width: 5%;">
						</td>
					</tr><br><br>
					<tr class="heading" style="height: 18px;width: 100%;">
						<hr>
						<td colspan="2" style="width: 71%;">
							<span style="display: block; width:100%; font-weight: bold;font-size:20px;"></span>
						</td>
						<td style="vertical-align: top; text-align: left; width: 29%;" colspan="1">
									<tr style="font-weight: bold; border-bottom: 1px solid #000;">
										<td style="text-align: left; padding: 10px; font-size:20px;">Total:  ' . $this->value(number_format($maintotal, 2, ".", "")) . '</td>
									</tr>
									<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="text-align: left; padding: 10px; font-size:20px;">Design Fees:  ' . $this->value(number_format($maindesignFees, 2, ".", "")) . '</td>
									</tr>';
			if ($maindiscount != 0) {
				$html .= '<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="text-align: left; padding: 10px; font-size:20px;">Discount(' . $request->coupon . '):  ' . $this->value(number_format($maindiscount, 2, ".", "")) . '</td>
									</tr>';
			}
			$html .= '
									<tr style="font-weight: bold; border-bottom: 1px solid #000;">
									<td style="text-align: left;  padding: 10px; font-size:20px;">Grand Total:  ' . $this->value(number_format($maingrandTotal, 2, ".", "")) . '</td>
									</tr>
						</td>
						<td colspan="2" style="width: 5%;">
						</td>
					</tr>
			</table>';

			$pdf->writeHTML($html, true, false, true, false, '');
		}
		$sign_file_path = file_get_contents($maindiscount == 0 ? 'https://onespaceinterior.com/public/uploads/StoreRequirment/priceWithout.pdf' : 'https://onespaceinterior.com/public/uploads/StoreRequirment/price.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

		$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="10">
			
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 60%;font-size:70px"></td>
						</tr>
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 60%;"></td>
							<td style="height: 18px; width: 40%; text-align: left"><font color="#fff" size="56px">' . $this->value(number_format($maintotal, 2, ".", "")) . '</font><br></td>
						</tr>
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 60%;"></td>
							<td style="height: 18px; width: 40%; text-align: left"><font color="#fff" size="56px">' . $this->value(number_format($maindesignFees, 2, ".", "")) . '</font><br></td>
						</tr>';
		if ($maindiscount != 0) {
			$html .= '<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 60%;"></td>
							<td style="height: 18px; width: 40%; text-align: left"><font color="#fff" size="56px">' . $this->value(number_format($maindiscount, 2, ".", "")) . '</font><br></td>
						</tr>';
		}

		$html .= '<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 60%;"></td>
							<td style="height: 18px; width: 40%; text-align: left"><font color="#fff" size="56px">' . $this->value(number_format($maingrandTotal, 2, ".", "")) . '</font><br></td>
						</tr>
						</table>';
		$pdf->writeHTML($html, true, false, true, false, '');
		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/endingPages.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
			$tplIdx = $pdf->importPage($pageNo);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
		}
		if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/' . $request->project_id)) {
			mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/' . $request->project_id);
		}


		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/' . $request->project_id . '/requirement-' . $requirement_id . '.pdf';
		$requirement_quotation = 'public/customer/projects/' . $request->project_id . '/requirement-' . $requirement_id . '.pdf';
		$pdf->SetCompression(true);
		$pdf->Output($requirement_quotation_path, 'F');
		// die;

		$this->db->where(['project_id' => $request->project_id, 'id' => $requirement_id])->update('requirements', ['quotation_path' => $requirement_quotation, 'quotation_price' => $maingrandTotal, 'updated_at' => date('Y-m-d H:i:s')]);

		// echo $this->db->last_query();die();

		if ($q4) {
			$this->sendEmail($userdata->email, 'OneSpace Interior Requirement Update', 'Dear ' . $userdata->first_name . ',
				
				We hope you\'re having a great day. We\'re thrilled to inform you that your new project requirement for OneSpace Interior has been received. You can view requirement details and a free quote for the same in "Project Details" page. 
				Thank you for choosing us to bring your vision to life. 
				
				Thanks,
				Onespace Interiors');

			$this->sendWhatsappMessage($userdata->first_name, '91' . $userdata->phone . '', 'requirement_created', "https://onespaceinterior.com/" . $requirement_quotation, $projectName);

			$response['success'] = true;
			$response['message'] = 'Data Inserted Successfully.';
			$response['requirement_quotation'] = "https://onespaceinterior.com/" . $requirement_quotation;
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While Inserting Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	function isOneSpaceNumberInArray($userNumber)
	{
		$numbersArray = ["6353846662", "9979142473", "9924700996", "7490041238", "7490006641", "9499606293"];

		// Check in array
		return in_array($userNumber, $numbersArray);
	}

	public function modifyRequirement()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);

		$unitKeyWord = "UNIT";
		if ($request->project_id == '') {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->user_id == '') {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$project_query = $this->db->select('carpet_area,city_id,brandsheet_id,package_id,freezed_requirement_id')
			->where('id', $request->project_id)
			->get('projects')->row();
		$q3main = $this->db->select('category_id,sku_id, is_selected, sub_category_id,qty')->where(['requirement_id' => $project_query->freezed_requirement_id, 'is_selected' => 1, 'requirement_skus.addonSubtract' => NULL])->get('requirement_skus');

		$userdata = $this->db->select('cities.name as city_name,email,first_name,REPLACE(country_code, "+", "") AS countrycode,phone,users.name')
			->from('users')
			->join('cities', 'users.city_id=cities.id')
			->where('users.id', $request->user_id)
			->get()->row();

		if ($q3main->num_rows() > 0) {
			$skus = [];
			foreach ($q3main->result() as $valu) {
				$skuDetails = ["sku_id" => $valu->sku_id, "qty" => $valu->qty];
				array_push($skus, $skuDetails);
				// echo 'viral' . $valu->sku_id;
			}
		}
		$city_id = $project_query->city_id;
		$requirement_id = $project_query->freezed_requirement_id;
		$modifySkus = [];


		for ($i = 0; $i < count($request->categories); $i++) {
			if ($request->categories[$i]->has_subcategory == '0') {
				$skuDetails = NULL;
				$q3 = $this->db->select('id')->where(['skus.brandsheet_id' => $request->categories[$i]->brand_sheet_id, 'skus.city_id' => $city_id, 'skus.category_id' => $request->categories[$i]->category_id])->get('skus');
				if ($q3->num_rows() > 0) {
					$skuDetails = ["sku_id" => $q3->row()->id, "qty" => $request->categories[$i]->qty];
					array_push($modifySkus, $skuDetails);
					if (in_array($skuDetails, $skus)) {
					} else {
						if ($request->categories[$i]->is_selected_id == "1") {
							$q = $this->db->insert('requirement_skus', array('category_id' => $request->categories[$i]->category_id, 'is_selected' => $request->categories[$i]->is_selected_id, 'qty' => $request->categories[$i]->qty, 'sku_id ' => $sku_id, 'requirement_id' => $requirement_id, 'addonSubtract' => 'A', 'created_at' => date('Y-m-d H:i:s')));
						}
					}
				}
			} else {
				for ($k = 0; $k < count($request->categories[$i]->sub_categories); $k++) {
					$sku_id = NULL;
					$q3 = $this->db->select('id')->where(['skus.brandsheet_id' => $request->categories[$i]->sub_categories[$k]->brand_sheet_id, 'skus.city_id' => $city_id, 'skus.category_id' => $request->categories[$i]->category_id, 'skus.sub_category_id' => $request->categories[$i]->sub_categories[$k]->sub_category_id])->get('skus');
					if ($q3->num_rows() > 0) {
						$skuDetails = ["sku_id" => $q3->row()->id, "qty" => $request->categories[$i]->qty];
						array_push($modifySkus, $skuDetails);
						if (in_array($skuDetails, $skus)) {
						} else {
							if ($request->categories[$i]->sub_categories[$k]->is_selected_id == "1") {
								$q = $this->db->insert('requirement_skus', array('category_id' => $request->categories[$i]->category_id, 'sub_category_id' => $request->categories[$i]->sub_categories[$k]->sub_category_id, 'is_selected' => $request->categories[$i]->sub_categories[$k]->is_selected_id, 'qty' => $request->categories[$i]->qty, 'sku_id ' => $sku_id, 'requirement_id' => $requirement_id, 'addonSubtract' => 'A', 'created_at' => date('Y-m-d H:i:s')));
							}
						}
					}
				}
			}
		}
		// die;
		foreach ($q3main->result() as $valu) {

			$skuDetails = ["sku_id" => $valu->sku_id, "qty" => $valu->qty];
			if (in_array($skuDetails, $modifySkus)) {
				// echo 'viralvinchhi' . $valu->sku_id;
			} else {
				// echo 'viral' . $valu->sku_id;
				$this->db->where(['sku_id' => $valu->sku_id, 'requirement_id' => $requirement_id])->update('requirement_skus', ['addonSubtract' => 'S']);
			}
		}
		// die;





		// Include the main TCPDF library and TCPDI.
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		require_once(APPPATH . 'TCPDF/FPDI/src/autoload.php');
		require_once(APPPATH . 'TCPDF/signpdf.php');


		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/startingPages.pdf');
		$pdf = new Pdf();
		$pdf->SetAutoPageBreak(false);
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
			$tplIdx = $pdf->importPage($pageNo);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
		}

		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg1.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

		$project_query = $this->db->select('carpet_area, interior_package_id')
			->where('id', $request->project_id)
			->get('projects')->row();

		$interiorPackage_query = $this->db->select('headtitle')
			->where('id', $project_query->interior_package_id)
			->get('interior_packes')->row();

		$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
									<tr>
									<td style="width: 100px; "></td>
									<td style="width: 100%; font-weight: bold;color: #fff; font-size:40px;">DREAM HOME INTERIOR QUOTATION<br>
									</td>
									</tr>
									<tr>
									<td style="width: 200px; "></td>
									<td style="width: 100%;text-align: left; font-weight: bold;color: #000;font-size:34px;">
									Project ID: ' . $request->project_id . '<br>Project Name: ' . $projectName . '<br>
									Carpet Area: ' . $project_query->carpet_area . '<br>Property type: ' . $interiorPackage_query->headtitle . '<br>City: ' . $userdata->city_name . '<br>Estimate Date: ' . date('d/m/Y') . '
									</td>
									</tr>
									<tr>
									<td style="width: 200px; "></td>
									<td style="width: 100%;text-align: left; font-weight: normal;color: #000;font-size:14px;">
									Here is the quote for your dream home interior that you requested.</td>
									</tr>
									</table>';

		$pdf->writeHTML($html, true, false, true, false, '');

		$total = 0;
		$totalCarpet = 0;
		$totalUnit = 0;
		$totalQty = 0;

		$project_query = $this->db->select('carpet_area')
			->where('id', $request->project_id)
			->get('projects')->row();

		//modifiedValues

		$q4 = $this->db->select('categories.name AS category_name,categories.description AS category_description,categories.id AS category_id, multiplier_enabled, multiplier_value, sub_categories.name AS sub_category_name, brandsheets.name AS brand_sheet_name, requirement_skus.is_selected, price, requirement_skus.qty,skus.description as sku_description,skus.name as sku_name,skus.sku_code as sku_code,skus.available_size as available_size,skus.sq_ft as sq_ft,parent_categories.name as parentCategoryName,parent_categories.id')
			->join('categories', 'categories.id = requirement_skus.category_id', 'left')
			->join('sub_categories', 'sub_categories.id = requirement_skus.sub_category_id', 'left')
			->join('skus', 'skus.id = requirement_skus.sku_id', 'left')
			->join('parent_categories', 'parent_categories.id = categories.parent_category_id', 'left')
			->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')
			->where('requirement_skus.requirement_id', $requirement_id)
			->where('requirement_skus.addonSubtract', 'A')
			->where('skus.city_id', $city_id)
			->where('requirement_skus.is_selected', 1)
			->order_by('categories.id', 'asc')
			->get('requirement_skus');
		if ($q4->num_rows() > 0) {
			$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			$tplIdx = $pdf->importPage(1);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
			$addONtotal = 0;
			$totalCarpet = 0;
			$totalUnit = 0;
			$totalQty = 0;
			$i = 1;
			$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="2">
				<tr>
				<td style="width: 20px; "></td>
				<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (Addon)<br>
				</td>
				</tr>
				<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
					<td style="height: 18px; width: 5%;">Sr.No</td>
					<td style="height: 18px; width: 45%">Item &amp; Description</td>
					<td style="height: 18px; width: 10%;">Area</td>
					<td style="height: 18px; width: 10%;">Brand</td>
					<td style="height: 18px; width: 10%;">Available<br/>Size</td>
					<td style="height: 18px; width: 10%;">Used<br/>Quantity</td>
					<td style="height: 18px; width: 10%;">Standard<br/>Size</td>
				</tr>';
			foreach ($q4->result() as $key => $value) {
				if ($i % 10 == 0) {
					$pdf->writeHTML($html, true, false, true, false, '');
					$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
					$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
					$tplIdx = $pdf->importPage(1);
					$size = $pdf->getTemplateSize($tplIdx);
					$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
					$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

					$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
									<tr>
									<td style="width: 20px; "></td>
									<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (' . $furnitureCategoryName . ')<br>
									</td>
									</tr>';
				}
				$sub_category_name = 'No Sub Category';
				$brand_sheet_name = 'No Brand Sheet';

				$parentcategory = $value->category_id;
				if (!empty($value->sub_category_name)) {
					// $sub_category_name = 'Sub Category: '.$value->sub_category_name;
					$item_description = $value->category_name . ' (' . $value->sku_code . ')<br/>Sub Category: ' . $value->sub_category_name . '<br/>' . $value->sku_description;
				} else {
					$item_description = $value->category_name . ' (' . $value->sku_code . ')<br/>' . $value->sku_description;
				}
				if ($value->is_selected == "1") {
					$selected = 'Yes';
				} else {
					$selected = 'No';
				}
				if ($value->multiplier_enabled == 1) {
					$price = $this->calculateCarpetArea($value->price, $value->multiplier_value, $project_query->carpet_area);
				} else {
					$price = $value->price;
				}
				if ($value->qty > 0) {
					$price = $value->qty * $price . "";
				} else {
					$price = $price;
				}
				if (empty($price)) {
					$price = 0;
				}
				if (!empty($value->brand_sheet_name)) {
					$brand_sheet_name = $value->brand_sheet_name;
				}
				$qty = (($value->is_selected == 1 && ($value->qty == 0 || $value->qty == null)) ? 1 : $value->qty);
				$totalQty += ($value->is_selected == 1 && ($value->qty == 0 || $value->qty == null)) ? 1 : $value->qty;
				// $totalCarpet += ($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft);
				$totalCarpet += str_contains($value->available_size, '\'') ? ($value->multiplier_enabled == 1 ? ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft)) : 0;
				$totalUnit += str_contains($value->available_size, '\'') ? 0 : ($value->multiplier_enabled == 1 ?  ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft));
				$addONtotal += $price;
				$measure = str_contains($value->available_size, '\'') ? 'SQFT' : 'UNIT';
				$parentcategory = $this->db->select('parent_categories.name')->join('categories', 'categories.parent_category_id = parent_categories.id', 'left')->where('categories.id', $value->category_id)->get('parent_categories')->row()->name;
				$html .= '<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 5%; text-align: center;">' . $i++ . '</td>
					<td style="height: 18px; width: 45%;">
						<span style="display: block; width:100%; font-weight: 600;">' . $item_description . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: 600;">' . $parentcategory . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' . $value->brand_sheet_name . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: 600;">' . $value->available_size . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: 600;">' . ($qty) . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: 600;">' . ($value->multiplier_enabled == 1 ?  ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft)) . '<br/>' . $measure . '</span>
					</td>
					</tr>';
				// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
			}

			$discountPercentage = $this->db->select('discountPercentage')
				->where('couponCode', $request->coupon)
				->get('coupon_codes')->row()->discountPercentage;
			$designFees = 0; //$total * 10 / 100;
			$AddmaingrandTotal = $addONtotal + $designFees;
			$discount = 0;
			$discount = $grandTotal * $discountPercentage / 100;
			// $grandTotal = $grandTotal - $discount;
			$AddgrandTotal = $AddmaingrandTotal - $discount;
			if ($q4->num_rows() % 10 > 7 && $q4->num_rows() > 9) {
				$pdf->writeHTML($html, true, false, true, false, '');
				$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
				$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
				$tplIdx = $pdf->importPage(1);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

				$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
								<tr>
								<td style="width: 20px;"></td>
								<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (Addon)<br>
								</td>
								</tr>';
			}

			$totalUnitKey =  $totalUnit == 0 ? '' : '' . $totalUnit . ' UNIT';
			$html .= '<tr class="heading" style="height: 18px;">
				<hr>
					<td style="height: 18px; width: 5%; text-align: center;"></td>
					<td style="height: 18px; width: 75%;">
						<span style="display: block; width:100%; font-weight: bold;font-size:18px;">Total</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: bold;font-size:18px;">' . $totalQty . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: bold;font-size:18px;">' . $totalCarpet . ' SQFT<br/>' . $totalUnitKey . '</span>
					</td>
				<hr>
				</tr>
			</table>';

			$pdf->writeHTML($html, true, false, true, false, '');
		}

		$q4 = $this->db->select('categories.name AS category_name,categories.description AS category_description,categories.id AS category_id, multiplier_enabled, multiplier_value, sub_categories.name AS sub_category_name, brandsheets.name AS brand_sheet_name, requirement_skus.is_selected, price, requirement_skus.qty,skus.description as sku_description,skus.name as sku_name,skus.sku_code as sku_code,skus.available_size as available_size,skus.sq_ft as sq_ft,parent_categories.name as parentCategoryName,parent_categories.id')
			->join('categories', 'categories.id = requirement_skus.category_id', 'left')
			->join('sub_categories', 'sub_categories.id = requirement_skus.sub_category_id', 'left')
			->join('skus', 'skus.id = requirement_skus.sku_id', 'left')
			->join('parent_categories', 'parent_categories.id = categories.parent_category_id', 'left')
			->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')
			->where('requirement_skus.requirement_id', $requirement_id)
			->where('requirement_skus.addonSubtract', 'S')
			->where('skus.city_id', $city_id)
			->where('requirement_skus.is_selected', 1)
			->order_by('categories.id', 'asc')
			->get('requirement_skus');
		if ($q4->num_rows() > 0) {
			$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			$tplIdx = $pdf->importPage(1);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
			$Subtotal = 0;
			$totalCarpet = 0;
			$totalUnit = 0;
			$totalQty = 0;
			$i = 1;
			$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="2">
				<tr>
				<td style="width: 20px; "></td>
				<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (Subtraction)<br>
				</td>
				</tr>
				<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
					<td style="height: 18px; width: 5%;">Sr.No</td>
					<td style="height: 18px; width: 45%">Item &amp; Description</td>
					<td style="height: 18px; width: 10%;">Area</td>
					<td style="height: 18px; width: 10%;">Brand</td>
					<td style="height: 18px; width: 10%;">Available<br/>Size</td>
					<td style="height: 18px; width: 10%;">Used<br/>Quantity</td>
					<td style="height: 18px; width: 10%;">Standard<br/>Size</td>
				</tr>';
			foreach ($q4->result() as $key => $value) {
				if ($i % 10 == 0) {
					$pdf->writeHTML($html, true, false, true, false, '');
					$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
					$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
					$tplIdx = $pdf->importPage(1);
					$size = $pdf->getTemplateSize($tplIdx);
					$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
					$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

					$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
									<tr>
									<td style="width: 20px; "></td>
									<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (Subtraction)<br>
									</td>
									</tr>';
				}
				$sub_category_name = 'No Sub Category';
				$brand_sheet_name = 'No Brand Sheet';

				$parentcategory = $value->category_id;
				if (!empty($value->sub_category_name)) {
					// $sub_category_name = 'Sub Category: '.$value->sub_category_name;
					$item_description = $value->category_name . ' (' . $value->sku_code . ')<br/>Sub Category: ' . $value->sub_category_name . '<br/>' . $value->sku_description;
				} else {
					$item_description = $value->category_name . ' (' . $value->sku_code . ')<br/>' . $value->sku_description;
				}
				if ($value->is_selected == "1") {
					$selected = 'Yes';
				} else {
					$selected = 'No';
				}
				if ($value->multiplier_enabled == 1) {
					$price = $this->calculateCarpetArea($value->price, $value->multiplier_value, $project_query->carpet_area);
				} else {
					$price = $value->price;
				}
				if ($value->qty > 0) {
					$price = $value->qty * $price . "";
				} else {
					$price = $price;
				}
				if (empty($price)) {
					$price = 0;
				}
				if (!empty($value->brand_sheet_name)) {
					$brand_sheet_name = $value->brand_sheet_name;
				}
				$qty = (($value->is_selected == 1 && ($value->qty == 0 || $value->qty == null)) ? 1 : $value->qty);
				$totalQty += ($value->is_selected == 1 && ($value->qty == 0 || $value->qty == null)) ? 1 : $value->qty;
				// $totalCarpet += ($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft);
				$totalCarpet += str_contains($value->available_size, '\'') ? ($value->multiplier_enabled == 1 ? ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft)) : 0;
				$totalUnit += str_contains($value->available_size, '\'') ? 0 : ($value->multiplier_enabled == 1 ?  ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft));
				$Subtotal += $price;
				$measure = str_contains($value->available_size, '\'') ? 'SQFT' : 'UNIT';
				$parentcategory = $this->db->select('parent_categories.name')->join('categories', 'categories.parent_category_id = parent_categories.id', 'left')->where('categories.id', $value->category_id)->get('parent_categories')->row()->name;
				$html .= '<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 5%; text-align: center;">' . $i++ . '</td>
					<td style="height: 18px; width: 45%;">
						<span style="display: block; width:100%; font-weight: 600;">' . $item_description . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: 600;">' . $parentcategory . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' . $value->brand_sheet_name . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: 600;">' . $value->available_size . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: 600;">' . ($qty) . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: 600;">' . ($value->multiplier_enabled == 1 ?  ($qty * $project_query->carpet_area) : ($qty * $value->sq_ft)) . '<br/>' . $measure . '</span>
					</td>
					</tr>';
				// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
			}
			$designFees = 0; //$total * 10 / 100;
			$SubmaingrandTotal = $Subtotal + $designFees;
			$discount = 0;
			$discount = $grandTotal * $discountPercentage / 100;
			$subGrandTotal = $SubmaingrandTotal - $discount;
			if ($q4->num_rows() % 10 > 7 && $q4->num_rows() > 9) {
				$pdf->writeHTML($html, true, false, true, false, '');
				$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
				$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
				$tplIdx = $pdf->importPage(1);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

				$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
								<tr>
								<td style="width: 20px;"></td>
								<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION (Subtraction)<br>
								</td>
								</tr>';
			}

			$totalUnitKey =  $totalUnit == 0 ? '' : '' . $totalUnit . ' UNIT';
			$html .= '<tr class="heading" style="height: 18px;">
				<hr>
					<td style="height: 18px; width: 5%; text-align: center;"></td>
					<td style="height: 18px; width: 75%;">
						<span style="display: block; width:100%; font-weight: bold;font-size:18px;">Total</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: bold;font-size:18px;">' . $totalQty . '</span>
					</td>
					<td style="height: 18px; width: 10%;text-align: center;">
						<span style="display: block; width:100%; font-weight: bold;font-size:18px;">' . $totalCarpet . ' SQFT<br/>' . $totalUnitKey . '</span>
					</td>
				<hr>
				</tr>
			</table>';

			$pdf->writeHTML($html, true, false, true, false, '');
		}

		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf'); //file_get_contents($maindiscount == 0 ? 'https://onespaceinterior.com/public/uploads/StoreRequirment/priceWithout.pdf' : 'https://onespaceinterior.com/public/uploads/StoreRequirment/price.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
		$maintotal = ($AddgrandTotal) - $subGrandTotal;
		$maingrandTotal = $maintotal + $maindesignFees;
		$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="0">
			
						<tr class="heading" style="height: 5px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 80%;font-size:70px;color: #97BAC0;">PAYMENT BIFURCATION</td>
						</tr>
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 10%;"></td>
							<td style="height: 18px; width: 80%; text-align: left"><font color="#fff" size="56px">Addon Amount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;' . $this->value(number_format($AddgrandTotal, 2, ".", "")) . '</font><br></td>
						</tr>
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 10%;"></td>
							<td style="height: 18px; width: 80%; text-align: left"><font color="#fff" size="56px">Subtraction Amount&nbsp;:&nbsp;' . $this->value(number_format($subGrandTotal, 2, ".", "")) . '</font><br></td>
						</tr>';

		$html .= '<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 38px; width: 10%;"></td>
							<td style="height: 18px; width: 80%; text-align: left"><font color="#fff" size="56px">Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;' . $this->value(number_format($maingrandTotal, 2, ".", "")) . '</font><br></td>
						</tr>
						</table>';
		$pdf->writeHTML($html, true, false, true, false, '');



		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/endingPages.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
			$tplIdx = $pdf->importPage($pageNo);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
		}
		if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/' . $request->project_id)) {
			mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/' . $request->project_id);
		}


		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/' . $request->project_id . '/requirement-' . $requirement_id . '-Addon.pdf';
		$requirement_quotation = 'public/customer/projects/' . $request->project_id . '/requirement-' . $requirement_id . '-Addon.pdf';
		$pdf->SetCompression(true);
		$pdf->Output($requirement_quotation_path, 'F');
		// die;

		$this->db->where(['project_id' => $request->project_id, 'id' => $requirement_id])->update('requirements', ['quotation_path' => $requirement_quotation, 'quotation_price' => $maingrandTotal, 'updated_at' => date('Y-m-d H:i:s')]);

		// echo $this->db->last_query();die();

		if ($q4) {
			$this->sendEmail($userdata->email, 'OneSpace Interior Requirement Update', 'Dear ' . $userdata->first_name . ',
				
				We hope you\'re having a great day. We\'re thrilled to inform you that your new project requirement for OneSpace Interior has been received. You can view requirement details and a free quote for the same in "Project Details" page. 
				Thank you for choosing us to bring your vision to life. 
				
				Thanks,
				Onespace Interiors');

			$this->sendWhatsappMessage($userdata->first_name, '91' . $userdata->phone . '', 'requirement_created', "https://onespaceinterior.com/" . $requirement_quotation, $projectName);
			// $q = $this->db->select('id, project_id, file_path')->where('project_id', $project_id)->where('customer_action', 1)->get('project_data');
			$project_data = $this->db->select('id')
				->where('project_id', $request->project_id)
				->where('name', 'Addon/Subtraction')
				->get('project_data');
			if ($project_data->num_rows() > 0) {
				$this->db->where('id', $project_data->row()->id)->update('project_data', array('project_id' => $request->project_id, 'project_stage_id' => 4, 'name' => 'Addon/Subtraction', 'description' => '', 'document_type' => '.pdf', 'file_path' => $requirement_quotation, 'file_name ' => '/requirement-' . $requirement_id . '-Addon.pdf', 'updated_at' => date('Y-m-d H:i:s')));
			} else {
				$q = $this->db->insert('project_data', array('project_id' => $request->project_id, 'project_stage_id' => 4, 'name' => 'Addon/Subtraction', 'description' => '', 'document_type' => '.pdf', 'file_path' => $requirement_quotation, 'file_name ' => '/requirement-' . $requirement_id . '-Addon.pdf', 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')));
			}
			$response['success'] = true;
			$response['message'] = 'Data Inserted Successfully.';
			$response['requirement_quotation'] = "https://onespaceinterior.com/" . $requirement_quotation;
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While Inserting Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function store_requirement_WEB()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		// echo $request->objectvalue;

		// // Include the main TCPDF library and TCPDI.
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		require_once(APPPATH . 'TCPDF/FPDI/src/autoload.php');
		// require_once(APPPATH.'TCPDF/FPDI/src/PdfParser/StreamReader.php');
		require_once(APPPATH . 'TCPDF/signpdf.php');


		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/startingPages.pdf');
		$pdf = new Pdf();
		$pdf->SetAutoPageBreak(false);
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
			$tplIdx = $pdf->importPage($pageNo);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
		}
		$username = "";
		$phonenumber = "";
		$usernameval = "";
		foreach ($request->objectvalue as $key => $value) {
			if ($value[0] == "user") {
				$username = $value[1];
				$phonenumber = $value[2];
				$usernameval = "$username's Project";
			} else {
			}
		}

		$pdf->writeHTML($html, true, false, true, false, '');
		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg1.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

		$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
									<tr>
									<td style="width: 100px; "></td>
									<td style="width: 100%; font-weight: bold;color: #fff; font-size:40px;">DREAM HOME INTERIOR QUOTATION<br>
									</td>
									</tr>
									<tr>
									<td style="width: 200px; "></td>
									<td style="width: 100%;text-align: left; font-weight: bold;color: #000;font-size:34px;">
									Project ID: ' . "" . '<br>Project Name: ' . $usernameval . '<br>Name: ' . $username . '<br>Number: ' . $phonenumber . '
									<br>Estimate Date: ' . date('d/m/Y') . '
									</td>
									</tr>
									<tr>
									<td style="width: 200px; "></td>
									<td style="width: 100%;text-align: left; font-weight: normal;color: #000;font-size:14px;">
									Here is the quote for your dream home interior that you requested.</td>
									</tr>
									</table>';

		$pdf->writeHTML($html, true, false, true, false, '');
		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

		$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="2">
						<tr>
						<td style="width: 20px; "></td>
						<td style="width: 100%; font-weight: bold;color: #97BAC0; font-size:40px;">DREAM HOME INTERIOR QUOTATION<br>
						</td>
						</tr>
						<tr class="heading" style="height: 10px; background-color: #f0f0f0; font-weight: bold; text-align: center;">
							<td style="height: 18px; width: 5%;">Sr.No</td>
							<td style="height: 18px; width: 45%">Item &amp; Description</td>
							<td style="height: 18px; width: 10%;"></td>
							<td style="height: 18px; width: 10%;">Brand</td>
							<td style="height: 18px; width: 10%;"></td>
							<td style="height: 18px; width: 10%;">Used<br/>Quantity</td>
							<td style="height: 18px; width: 10%;"></td>
						</tr>';
		// if ($request->objectvalue . count() > 0) {
		$phonenumber = "";
		$username = "";
		$i = 0;
		foreach ($request->objectvalue as $key => $value) {
			if ($i % 30 == 0 && $i != 0) {
				$pdf->writeHTML($html, true, false, true, false, '');
				$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/bg.pdf');
				$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
				$tplIdx = $pdf->importPage(1);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
			}
			if ($i != 0) {
				if ($value[0] == "Total") {


					$html .= '<hr>
					<tr class="heading" style="height: 18px;">
				<td style="height: 18px; width: 5%; text-align: center;"></td>
				<td style="height: 18px; width: 45%;">
					<span style="display: block; width:100%; font-weight: 600;font-size:24px;"><b>' . $value[0] . '</b></span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;"></span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;"></span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;"></span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;font-size:24px;"><b>' . $value[2] . '</b></span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;"></span>
				</td>
				</tr>';
				} else if ($value[0] == "user") {
					$username = $value[1];
					$phonenumber = $value[2];
				} else {
					$html .= '<tr class="heading" style="height: 18px;">
								<td style="height: 18px; width: 5%; text-align: center;font-size:15px;">' . $i . '</td>
								<td style="height: 18px; width: 45%;">
									<span style="display: block; width:100%; font-weight: 600;font-size:15px;">' . $value[0] . '</span>
								</td>
								<td style="height: 18px; width: 10%;text-align: center;">
									<span style="display: block; width:100%; font-weight: 600;"></span>
								</td>
								<td style="height: 18px; width: 10%;text-align: center;">
								<span style="display: block; width:100%; font-weight: 600;font-size:15px;">' . $value[1] . '</span>
								</td>
								<td style="height: 18px; width: 10%;text-align: center;">
									<span style="display: block; width:100%; font-weight: 600;"></span>
								</td>
								<td style="height: 18px; width: 10%;text-align: center;">
									<span style="display: block; width:100%; font-weight: 600;font-size:15px;">' . $value[2] . '</span>
								</td>
								<td style="height: 18px; width: 10%;text-align: center;">
									<span style="display: block; width:100%; font-weight: 600;"></span>
								</td>
								</tr>';
				}
			}
			$i++;

			// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
		}
		$pdf->writeHTML($html, true, false, true, false, '');
		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/endingPages.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
			$tplIdx = $pdf->importPage($pageNo);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
		}
		if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/WEB')) {
			mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/WEB');
		}

		$requirement_id = rand(100000, 999999);
		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/WEB/requirement-' . $requirement_id . '.pdf';
		$requirement_quotation = 'public/customer/projects/WEB/requirement-' . $requirement_id . '.pdf';
		$pdf->Output($requirement_quotation_path, 'F');

		$this->sendWhatsappMessage($userdata->first_name, '91' . $phonenumber . '', 'requirement_created', "https://onespaceinterior.com/" . $requirement_quotation, "$username's Project");

		// if ($pdf->Output($requirement_quotation_path, 'F')) {
		$response['success'] = true;
		$response['message'] = 'Data Inserted Successfully.';
		$response['requirement_quotation'] = "https://onespaceinterior.com/" . $requirement_quotation;
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
		exit();
		// } else {
		// 	$response['success'] = false;
		// 	$response['message'] = 'Error Occurred While Inserting Data.';
		// 	header('Content-Type: application/json; charset=utf-8');
		// 	echo json_encode($response);
		// 	exit();
		// }
		// }
	}

	public function value($num)
	{

		return preg_replace("/(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/i", "$1,", $num);;
	}



	public function fetch_projects()
	{
		$user_id = $this->input->post('user_id');

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->select('projects.id, projects.name AS project_name, users.name AS username, cities.name AS city, room_types.name AS room_type')
			->where('projects.user_id', $user_id)->join('users', 'users.id = projects.user_id', 'left')
			->join('cities', 'cities.id = projects.city_id', 'left')
			->join('room_types', 'room_types.id = projects.room_type_id', 'left')
			->join('interior_packes', 'interior_packes.id = projects.interior_package_id', 'left')->get('projects');
		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Project Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_requirement()
	{
		$project_id = $this->input->post('project_id');
		$requirement_id = $this->input->post('requirement_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if (empty($requirement_id)) {
			$response['success'] = false;
			$response['message'] = 'Requirement Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$project_query = $this->db->select('carpet_area')
			->where('id', $project_id)
			->get('projects')->row();

		$q = $this->db->select('parent_categories.id, parent_categories.name AS parent_category, parent_categories.image_path AS image')->where('projects.id', $project_id)->where('requirement_skus.requirement_id', $requirement_id)->where('requirement_skus.is_selected', 1)->join('requirements', 'requirements.id = requirement_skus.requirement_id', 'left')->join('projects', 'projects.id = requirements.project_id', 'left')->join('categories', 'categories.id = requirement_skus.category_id', 'left')->join('parent_categories', 'parent_categories.id = categories.parent_category_id', 'left')->group_by('parent_categories.id')->get('requirement_skus');
		// echo $this->db->last_query();die();
		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = array();
			$total = 0;
			foreach ($q->result() as $key => $value) {
				if ($value->image) {
					$value->image = "https://onespaceinterior.com/" . $value->image;
				} else {
					$value->image = '';
				}
				$value->values = array();
				$q2 = $this->db->select('requirement_skus.category_id, categories.name AS category, sku_id, brandsheets.name AS brandsheet, requirements.id AS requirement_no, is_freezed, quotation_path, price, has_subcategories, multiplier_enabled, multiplier_value, requirement_skus.qty')->where('categories.parent_category_id', $value->id)->where('requirement_skus.requirement_id', $requirement_id)->where('requirement_skus.is_selected', 1)->join('categories', 'categories.id = requirement_skus.category_id', 'left')->join('skus', 'skus.id = requirement_skus.sku_id', 'left')->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->join('requirements', 'requirements.id = requirement_skus.requirement_id', 'left')->group_by('requirement_skus.category_id')->get('requirement_skus');
				// echo $this->db->last_query();
				foreach ($q2->result() as $key => $val) {
					if ($val->brandsheet == NULL || $val->price == NULL) {
						$val->brandsheet = '';
						$val->price = "0";
					}
					if ($val->multiplier_enabled == 1) {
						$val->price = $this->calculateCarpetArea($val->price, $val->multiplier_value, $project_query->carpet_area);
					}
					if ($val->qty > 0) {
						$val->price = $val->price * $val->qty . "";
					}
					$val->sub_category_name = '';
					if ($val->has_subcategories != '0') {
						$q3 = $this->db->select('sub_categories.name AS sub_category_name, brandsheets.name AS brandsheet, price, multiplier_enabled, multiplier_value, requirement_skus.qty')->where(['sub_categories.category_id' => $val->category_id, 'skus.id' => $val->sku_id])->join('skus', 'skus.sub_category_id = sub_categories.id', 'left')->join('categories', 'skus.category_id = categories.id', 'left')->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->join('requirement_skus', 'requirement_skus.sku_id = skus.id', 'left')->order_by('sub_categories.category_id', 'asc')->get('sub_categories');
						// unset($value->parent_category_id);
						// $val->sub_categories = array();
						if ($q3->num_rows() > 0) {
							foreach ($q3->result() as $key => $valu) {
								if ($valu->brandsheet == NULL || $valu->price == NULL || $valu->sub_category_name == NULL) {
									$valu->sub_category_name = '';
									$valu->brandsheet = '';
									$valu->price = "0";
								}
								if ($valu->multiplier_enabled == 1) {
									$valu->price = $this->calculateCarpetArea($valu->price, $valu->multiplier_value, $project_query->carpet_area);
								}
								if ($valu->qty > 0) {
									$valu->price = $valu->price * $valu->qty . "";
								}
								$total += $valu->price;
								// if($value->quotation_path) {
								// 	$value->quotation_path = "https://onespaceinterior.com/".$value->quotation_path;
								// } else {
								// 	$value->quotation_path = '';
								// }
								// $val->sub_categories = $q3->result();
								$val->sub_category_name = $valu->sub_category_name;
								$val->brandsheet = $valu->brandsheet;
								$val->price = $valu->price;
							}
						}
						// unset($val->brandsheet);
						// unset($val->price);
					} else {
						$total += $val->price;
					}
					unset($val->category_id);
					unset($val->sku_id);
					unset($val->multiplier_enabled);
					unset($val->multiplier_value);
					// else {

					// }
					if ($val->quotation_path) {
						$val->quotation_path = "https://onespaceinterior.com/" . $val->quotation_path;
					} else {
						$val->quotation_path = '';
					}
					$value->values = $q2->result();
				}
				unset($value->id);
				array_push($response['response'], $value);
			}

			$quotation_price = 0;
			$q3 = $this->db->select('quotation_price')->where('project_id', $project_id)->where('id', $requirement_id)->get('requirements');
			if ($q3->num_rows() > 0) {
				$quotation_price = $q3->row()->quotation_price;
			}
			$response['sub_total'] = $this->value(number_format($quotation_price, 2, ".", ""));
			$q4 = $this->db->select('name')->where('id', $project_id)->get('projects');
			$response['project_name'] = $q4->row()->name;
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Requirement Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function freeze_requirement()
	{
		$project_id = $this->input->post('project_id');
		$requirement_id = $this->input->post('requirement_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($requirement_id)) {
			$response['success'] = false;
			$response['message'] = 'Requirement Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->where(['project_id' => $project_id, 'id' => $requirement_id])->get('requirements');
		$response = array();
		if ($q->num_rows() > 0) {
			$quotation_price = 0;
			$user_id = $q->row()->user_id;
			$q3 = $this->db->select('quotation_price')->where(['project_id' => $project_id, 'id' => $requirement_id])->get('requirements');
			if ($q3->num_rows() > 0) {
				$quotation_price = $q3->row()->quotation_price;
				$q = $this->db->where(['project_id' => $project_id, 'id' => $requirement_id])->update('requirements', array('is_freezed' => 1, 'freezed_at' => date('Y-m-d H:i:s')));

				$q2 = $this->db->where('id', $project_id)->update('projects', array('freezed_requirement_id' => $requirement_id, "final_amount" => $quotation_price));

				if ($q && $q2) {


					$qval = $this->db->select('id AS customer_id, first_name AS firstname, last_name AS lastname, email, phone AS telephone,REPLACE(country_code, "+", "") AS countrycode')->where(array('id' => $user_id))->get('users');
					if ($qval) {
						$firstname = $qval->row()->firstname;
						$email = $qval->row()->email;
						$telephone = $qval->row()->telephone;
						$countrycode = '91'; //$qval->row()->countrycode;
						$finalNumber =  (string) $countrycode + $telephone;
						$this->sendEmail($email, 'Requirement Freeze Successful! Let\'s Start Designing Your Dream Home Interior.', 'Dear ' . $firstname . ',

					Great news! Your project\'s requirements are locked in. Kindly wait for Onespace admin to send a project contract with you
					We can\'t wait to bring your space vision to life!
					
					Warm regards,
					OneSpace Interior Team');
						$this->sendWhatsappMessage($firstname, '' . $countrycode . '' . $telephone . '', 'requirement_freezed');
					}

					$requirement_products = $this->db->select('category_id,sub_category_id,sku_id,qty')->where(['is_selected' => 1, 'requirement_id' => $requirement_id])->get('requirement_skus');
					if ($requirement_products->num_rows() > 0) {
						foreach ($requirement_products->result() as $key => $value) {
							$this->db->insert('modification_records', array('requirement_id' => $requirement_id, 'category_id' => $value->category_id, 'sub_category_id' => $value->sub_category_id, 'sku_id' => $value->sku_id, 'qty' => $value->qty));
						}
					}
					$response['success'] = true;
					$response['message'] = 'Data Updated Successfully.';
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
				} else {
					$response['success'] = false;
					$response['message'] = 'Error Occurred While Updating.';
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
				}
			} else {
				$response['success'] = false;
				$response['message'] = 'Error Occurred While fetching price.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'No Project or Requirement Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function completion_shown()
	{
		$doc_id = $this->input->post('doc_id');

		if (empty($doc_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}


		$q2 = $this->db->where('id', $doc_id)->update('project_data', array('customer_action_status' => 1));

		if ($q2) {

			$response['success'] = true;
			$response['message'] = 'Data Updated Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While Updating.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function compare_requirements()
	{
		$project_id = $this->input->post('project_id');
		$requirement_ids = $this->input->post('requirement_ids');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if (empty($requirement_ids)) {
			$response['success'] = false;
			$response['message'] = 'Requirement Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$project_query = $this->db->select('carpet_area')
			->where('id', $project_id)
			->get('projects')->row();

		$explode_requirement_ids = explode(',', $requirement_ids);
		// print_r($explode_requirement_ids);die;
		$response = array();
		$response['response'] = array();
		$total = 0;
		$q = $this->db->select('parent_categories.id, parent_categories.name AS parent_category')->where('projects.id', $project_id)->where_in('requirement_skus.requirement_id', $explode_requirement_ids)->join('requirements', 'requirements.id = requirement_skus.requirement_id', 'left')->join('projects', 'projects.id = requirements.project_id', 'left')->join('categories', 'categories.id = requirement_skus.category_id', 'left')->join('parent_categories', 'parent_categories.id = categories.parent_category_id', 'left')->group_by('parent_categories.id')->get('requirement_skus');
		// echo $this->db->last_query();
		if ($q->num_rows() > 0) {
			foreach ($q->result() as $key => $value) {
				$value->values = array();
				$q2 = $this->db->select('sku_id, requirement_skus.category_id, categories.name AS category, has_subcategories')->where('categories.parent_category_id', $value->id)->where_in('requirement_skus.requirement_id', $explode_requirement_ids)->join('categories', 'categories.id = requirement_skus.category_id', 'left')->join('skus', 'skus.id = requirement_skus.sku_id', 'left')->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->join('requirements', 'requirements.id = requirement_skus.requirement_id', 'left')->group_by('category_id')->get('requirement_skus');

				$q22 = $this->db->select('sku_id, requirement_skus.category_id')->where('categories.has_subcategories', '1')->where('categories.parent_category_id', $value->id)->where_in('requirement_skus.requirement_id', $explode_requirement_ids)->join('categories', 'categories.id = requirement_skus.category_id', 'left')->group_by('sku_id')
					// ->join('skus', 'skus.id = requirement_skus.sku_id', 'left')
					// ->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')
					// ->join('requirements', 'requirements.id = requirement_skus.requirement_id', 'left')
					->get('requirement_skus');
				// echo $this->db->last_query();
				unset($value->id);
				foreach ($q2->result() as $val) {
					$q3 = $this->db->select('brandsheets.name AS name, requirements.id AS requirement_no, price, multiplier_enabled, multiplier_value, requirement_skus.qty AS qty')->where_in('requirement_skus.requirement_id', $explode_requirement_ids)->where(['categories.id' => $val->category_id])->join('categories', 'categories.id = requirement_skus.category_id', 'left')->join('skus', 'skus.id = requirement_skus.sku_id', 'left')->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->join('requirements', 'requirements.id = requirement_skus.requirement_id', 'left')->order_by('requirement_no', 'asc')
						->get('requirement_skus');
					// echo $this->db->last_query();
					$requirement = $q3->result();
					// echo "<pre>";print_r($requirement);
					for ($i = 0; $i < count($requirement); $i++) {
						$prev = ($i != 0) ? $requirement[$i - 1]->name : $requirement[$i]->name;
						$prev_qty = ($i != 0) ? $requirement[$i - 1]->qty : $requirement[$i]->qty;
						if ($requirement[$i]->name == $prev && $requirement[$i]->qty == $prev_qty) {
							$val->is_different = false;
						} else {
							$val->is_different = true;
						}
					}
					foreach ($requirement as $key => $va) {
						$va->sub_category_name = "NA";
						if (empty($va->name)) {
							$va->name = 'NA';
						}
						if (empty($va->price)) {
							$va->price = "0";
						}
						if ($va->multiplier_enabled == 1) {
							$va->price = $this->calculateCarpetArea($va->price, $va->multiplier_value, $project_query->carpet_area);
						}
						if ($va->qty > 0) {
							$va->price = $va->price * $va->qty . "";
						}
						unset($va->multiplier_enabled);
						unset($va->multiplier_value);
						$total += $va->price;
					}
					$val->requirements = array();
					$val->requirements = $q3->result();
					if ($val->has_subcategories != '0') {
						// $val->sub_categories = array();
						if ($q22->num_rows() > 0) {
							$val->requirements = array();
							// $val->requirements['subCategories'] = array();
							foreach ($q22->result() as $v) {
								// $val->requirements = array('subCategories' => $q3->result());
								$q3 = $this->db->select('sub_categories.name AS sub_category_name, brandsheets.name AS name, requirements.id AS requirement_no, price, multiplier_enabled, multiplier_value, requirement_skus.qty AS qty')->where_in('requirement_skus.requirement_id', $explode_requirement_ids)->where(['categories.id' => $v->category_id, 'skus.id' => $v->sku_id])->where('is_selected', 1)->join('categories', 'categories.id = requirement_skus.category_id', 'left')->join('skus', 'skus.id = requirement_skus.sku_id', 'left')->join('brandsheets', 'brandsheets.id = skus.brandsheet_id', 'left')->join('requirements', 'requirements.id = requirement_skus.requirement_id', 'left')->join('sub_categories', 'skus.sub_category_id = sub_categories.id', 'left')->group_by('requirements.id')->get('requirement_skus');
								// echo $this->db->last_query();
								// if($q3->num_rows() > 0) {
								$requirement = $q3->result();
								// echo "<pre>";print_r($requirement);
								for ($i = 0; $i < count($requirement); $i++) {
									$prev = ($i != 0) ? $requirement[$i - 1]->name : $requirement[$i]->name;
									$prev_cat_name = ($i != 0) ? $requirement[$i - 1]->sub_category_name : $requirement[$i]->sub_category_name;
									$prev_qtyy = ($i != 0) ? $requirement[$i - 1]->qty : $requirement[$i]->qty;
									if ($requirement[$i]->sub_category_name == $prev_cat_name && $requirement[$i]->name == $prev && $requirement[$i]->qty == $prev_qty) {
										$val->is_different = false;
									} else {
										$val->is_different = true;
									}
								}
								foreach ($requirement as $key => $va) {
									if (empty($va->sub_category_name)) {
										$va->sub_category_name = 'NA';
									}
									if (empty($va->name)) {
										$va->name = 'NA';
									}
									if (empty($va->price)) {
										$va->price = "0";
									}
									if ($va->multiplier_enabled == 1) {
										$va->price = $this->calculateCarpetArea($va->price, $va->multiplier_value, $project_query->carpet_area);
									}
									if ($va->qty > 0) {
										$va->price = $va->price * $va->qty . "";
									}
									unset($va->multiplier_enabled);
									unset($va->multiplier_value);
									// $total += $va->price;
									// array_push($val->requirements['subCategories'], $va);
									array_push($val->requirements, $va);
								}
								// $val->requirements = $q3->result();
								// unset($val->category_id);
								// }
								// else {
								// 	foreach ($explode_requirement_ids as $explode_requirement_id) {
								// 		array_push($val->requirements, (object) array('sub_category_name' => 'NA', 'name' => 'NA', 'requirement_no' => $explode_requirement_id, 'price' => "0", "qty" => "0"));
								// 	}
								// }
							}
						}
					}
					unset($val->category_id);
					unset($val->sku_id);
					// unset($val->multiplier_enabled);
					// unset($val->multiplier_value);
					if (empty($val->requirements)) {
						foreach ($explode_requirement_ids as $explode_requirement_id) {
							array_push($val->requirements, (object) array('sub_category_name' => 'NA', 'name' => 'NA', 'requirement_no' => $explode_requirement_id, 'price' => "0", "qty" => "0"));
						}
					}
					usort($val->requirements, function ($first, $second) {
						return $first->requirement_no > $second->requirement_no;
					});
				}
				$value->values = $q2->result();
				array_push($response['response'], $value);
			}
			$sub_total = array();
			foreach ($explode_requirement_ids as $key => $value) {
				$total = 0;
				$q4 = $this->db->select('price, multiplier_enabled, multiplier_value, requirement_skus.qty')->where('requirement_skus.requirement_id', $value)->where('requirement_skus.is_selected', 1)->join('skus', 'skus.id = requirement_skus.sku_id', 'left')->join('categories', 'categories.id = requirement_skus.category_id', 'left')->get('requirement_skus');
				// echo $this->db->last_query();
				foreach ($q4->result() as $key => $v) {
					if (empty($v->price)) {
						$v->price = 0;
					}
					if ($v->multiplier_enabled == 1) {
						$v->price = $this->calculateCarpetArea($v->price, $v->multiplier_value, $project_query->carpet_area);
					}
					if ($v->qty > 0) {
						$v->price = $v->price * $v->qty . "";
					}
					$total += $v->price;
				}
				// $price = $q4->row()->price;
				// if($q4->row()->multiplier_enabled == 1) {
				// 	$price = $q4->row()->price*$q4->row()->multiplier_value."";
				// }
				array_push($sub_total, $total != NUll && !empty($total) ? $this->value(number_format($total, 2, ".", "")) : "0");
			}
			// echo $this->db->last_query();
			// $response['sub_total'] = $this->value(number_format($total, 2, ".", ""));
			$response['sub_total'] = $sub_total;
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Requirement Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function apply_Coupon_Interior()
	{
		$coupon = $this->input->post('coupon');

		$couponCodes = $this->db->select('couponCode')
			->where('couponCode', $coupon)
			->get('coupon_codes');

		if (empty($coupon)) {
			$response['success'] = false;
			$response['message'] = 'Please Enter Correct Coupon Code';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($couponCodes->num_rows() > 0) {
			$response['success'] = true;
			$response['message'] = 'Coupon Applied Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Please enter valid Coupon Code';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_project_requirements()
	{
		$project_id = $this->input->post('project_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->select('requirements.id AS requirement_no, is_freezed, quotation_path')->where('requirements.project_id', $project_id)->join('requirement_skus', 'requirement_skus.requirement_id = requirements.id', 'left')->group_by('requirement_no')->order_by('requirement_no', 'asc')->get('requirements');

		$response = array();
		if ($q->num_rows() > 0) {

			foreach ($q->result() as $key => $val) {
				if ($val->quotation_path) {
					$val->quotation_path = "https://onespaceinterior.com/" . $val->quotation_path;
				} else {
					$val->quotation_path = "";
				}
			}

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Requirement Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function sign_PDF()
	{
		if (empty($_FILES['signature_image']['name']) || $_FILES['signature_image']['name'] == '') {
			$response['success'] = false;
			$response['message'] = 'Signature Image is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$project_id = $this->input->post('project_id');
		$sign_pdf = $this->input->post('sign_pdf');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if (empty($sign_pdf)) {
			$response['success'] = false;
			$response['message'] = 'Sign PDF is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		// Include the main TCPDF library and TCPDI.
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		require_once(APPPATH . 'TCPDF/FPDI/src/autoload.php');
		// require_once(APPPATH.'TCPDF/FPDI/src/PdfParser/StreamReader.php');
		require_once(APPPATH . 'TCPDF/signpdf.php');

		$path = $_FILES['signature_image']['tmp_name'];
		$type = pathinfo($path, PATHINFO_EXTENSION);
		$data = file_get_contents($path);
		// echo base64_encode($data);die();
		$img_base64_encoded = base64_encode($data);
		$img_base64_decoded = base64_decode($img_base64_encoded);

		// initiate PDF
		// $pdf = new Pdf();
		// $stream_reader = new StreamReader();

		// echo $img_base64_decoded;die();
		// if ($tplId === null) {
		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/customer/projects/' . $project_id . '/' . 'stages' . '/' . $sign_pdf);
		// die();
		// $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		// $tplId = $pdf->importPage(1);

		$pdf = new Pdf();
		// get the page count
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		// iterate through all pages
		for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
			if ($pageNo == $pageCount - 1) {

				$pdf->AddPage();
				$tplId = $pdf->importPage($pageNo);
				$pdf->useTemplate($tplId);
				$pdf->SetFont('freesans', 'B', 20);
				$pdf->SetTextColor(0);
				$pdf->SetXY(1, 1);
				$pdf->Image('@' . $img_base64_decoded, 20, 75, 50, 50);
			} else {
				$pdf->AddPage();
				$tplId = $pdf->importPage($pageNo);
				$pdf->useTemplate($tplId);
			}
		}
		$signed_pdf_path = $_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/' . $project_id . '/stages/'; //.$sign_pdf;
		// $pdf->Output($signed_pdf_path, 'F');
		$pdf->Output($signed_pdf_path . 'output.pdf', 'F');
		$this->db->where('project_id', $project_id)->update('project_data', array('customer_action_status' => 1, 'file_path' => 'public/customer/projects/' . $project_id . '/stages/output.pdf', 'file_name' => 'output'));
		$response['success'] = true;
		$response['message'] = 'PDF Signed Successfully.';
		$response['signed_pdf'] = "https://onespaceinterior.com/" . 'public/customer/projects/' . $project_id . '/stages/output.pdf';
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
		exit();
	}

	public function dashboard()
	{
		$user_id = $this->input->post('user_id');

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$response = array();
		$count = 1;
		$q2 = $this->db->where('user_id', $user_id)->get('projects');
		if ($q2->num_rows() > 0) {
			$q = $this->db->select('projects.id, projects.name,projects.completion_shown, project_stage_id, start_date, status AS current_status,cities.name AS cityName')->select_max('project_stage_id', 'current_status')->join('cities', 'cities.id = projects.city_id', 'left')->join('project_status', 'project_status.project_id = projects.id', 'left')->where('user_id', $user_id)->where('status', '4')->group_by('projects.id')->order_by('project_status.project_stage_id', 'DESC')->get('projects');
			// echo $this->db->last_query();
			$note = "";
			if ($q->num_rows() > 0) {
				foreach ($q->result() as $key => $value) {

					$q3 = $this->db->where('project_id', $value->id)->where('status', '4')->order_by('id', 'desc')->get('project_status');
					if ($q3->num_rows() > 0) {
						if ($q3->row()->project_stage_id == 0 && $q3->row()->current_status == 0) {
							$note = "Freeze any one requirement to proceed ahead. ";
						} else if ($q3->row()->project_stage_id == 1) {
							$note = "Finish 10% of the Project payment. ";
						} else if ($q3->row()->project_stage_id == 2) {
							$note = "Project timeline is generated as per your request. ";
						} else if ($q3->row()->project_stage_id == 3) {
							$note = "Finish product design selection of your choice. ";
						} else if ($q3->row()->project_stage_id == 4) {
							$note = "Finish next 50% of the Project payment. ";
						} else if ($q3->row()->project_stage_id == 5) {
							$note = "Select a panelist to start project execution. ";
						} else if ($q3->row()->project_stage_id == 6) {
							$note = "Project execution is going on. ";
						} else if ($q3->row()->project_stage_id == 7) {
							$note = "Visit our factory for product experience. ";
						} else if ($q3->row()->project_stage_id == 8) {
							$note = "Project execution is going on. ";
						} else if ($q3->row()->project_stage_id == 9) {
							$note = "Project is completed. Please provide valuable feedback. ";
						} else if ($q3->row()->project_stage_id == 10) {
							$note = "Project is Completed. ";
						} else {
							$note .= "";
						}
					}

					$value->project_name = 'Project ' . $count;
					$count++;
					if ($value->start_date) {
						$value->start_date = date('d/m/Y', strtotime($value->start_date));
					} else {
						$value->start_date = "";
					}
					if ($value->project_stage_id) {
						$value->per_completed = (($value->current_status * 100) / 10) . "%";
						unset($value->project_stage_id);
					}
					$value->note = $note;
				}

				$q2 = $this->db->select('users.name AS user_name, cities.name AS city, room_types.name AS room_type')->join('cities', 'cities.id = users.city_id', 'left')->join('room_types', 'room_types.id = users.room_type_id', 'left')->where('users.id', $user_id)->get('users');

				$response['success'] = true;
				$response['message'] = 'Fetched Successfully.';
				$response['username'] = $q2->row()->user_name;
				$response['city'] = $q2->row()->city;
				$response['room_type'] = $q2->row()->room_type;
				$response['response'] = $q->result();
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			} else {
				$q = $this->db->select('projects.id,projects.completion_shown, name, start_date')->where('user_id', $user_id)->get('projects');
				if ($q->num_rows() > 0) {
					foreach ($q->result() as $key => $value) {
						$value->project_name = 'Project ' . $count;
						$count++;
						if ($value->start_date) {
							$value->start_date = date('d/m/Y', strtotime($value->start_date));
						} else {
							$value->start_date = "";
						}
						$value->current_status = "0";
						$value->per_completed = "0%";
						$value->note = "Freeze any one requirement to proceed ahead. ";
					}

					$q2 = $this->db->select('users.name AS user_name, cities.name AS city, room_types.name AS room_type')->join('cities', 'cities.id = users.city_id', 'left')->join('room_types', 'room_types.id = users.room_type_id', 'left')->where('users.id', $user_id)->get('users');

					$response['success'] = true;
					$response['message'] = 'Fetched Successfully.';
					$response['username'] = $q2->row()->user_name;
					$response['city'] = $q2->row()->city;
					$response['room_type'] = $q2->row()->room_type;
					$response['response'] = $q->result();
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
				} else {
					$response['success'] = false;
					$response['message'] = 'No Project Found.';
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
				}
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'No Project Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_banners()
	{
		$q = $this->db->select('id, name, image_path AS image, link')->where('device_type', 2)->where('is_active', 1)->get('banners');

		$response = array();
		if ($q->num_rows() > 0) {

			foreach ($q->result() as $key => $val) {
				if ($val->image) {
					$val->image = "https://onespaceinterior.com/" . $val->image;
				} else {
					$val->image = "";
				}
			}

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response']['banners'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Banner Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_parent_categories_selection()
	{
		$project_id = $this->input->post('project_id');
		$user_id = $this->input->post('user_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$response = array();

		$q = $this->db->select('requirements.id ,selected_budget AS budget, room_type_id')->join('projects', ' projects.id = requirements.project_id', 'left')->where('project_id', $project_id)->where('is_freezed', 1)->get('requirements');
		// echo $this->db->last_query();
		$budget = 0.00;
		// $q2 = [];
		if ($q->num_rows() > 0) {
			$budget = $q->row()->budget;
			$room_type_id = $q->row()->room_type_id;
			$requirement_id = $q->row()->id;
			if ($room_type_id == 4) {
				$q2 = $this->db->select('id, name, image_path AS image')->where('id !=', 6)->get('parent_categories');
			} else {
				$q2 = $this->db->select('id, name, image_path AS image')->get('parent_categories');
			}
			$quotation_price = 0;
			$q3 = $this->db->select('id, quotation_price')->where('project_id', $project_id)->where('is_freezed', 1)->get('requirements');
			if ($q3->num_rows() > 0) {
				$quotation_price = $q3->row()->quotation_price;
			}
			// }
			// print_r($q2);
			if ($q2->num_rows() > 0) {
				$response['success'] = true;
				$response['message'] = 'Fetched Successfully.';
				$response['response'] = array();
				$response['response']['budget'] = $budget;
				$response['response']['quotation_price'] = $quotation_price;
				$response['response']['parent_categories'] = array();
				foreach ($q2->result() as $key => $value) {
					if ($value->image) {
						$value->image = "https://onespaceinterior.com/" . $value->image;
					} else {
						$value->image = "";
					}
					$value->categories = '';
					$categories = [];
					$selected_categories = [];

					$q3 = $this->db->select('requirement_skus.category_id')
						->where('requirement_skus.requirement_id', $requirement_id)
						->where('requirement_skus.is_selected', 1)
						->where('categories.parent_category_id', $value->id)
						->join('project_requirement_products', 'requirement_skus.id = project_requirement_products.sku_id', 'left')
						->join('categories', 'requirement_skus.category_id = categories.id', 'left')
						->get('requirement_skus');
					foreach ($q3->result() as $key => $val) {
						array_push($categories, $val->category_id);
					}

					$q4 = $this->db->select('categories.name')->where('project_id', $project_id)->where('parent_category_id', $value->id)->join('skus', 'skus.id = project_requirement_products.sku_id', 'left')->join('categories', 'categories.id = skus.category_id', 'left')->group_by('project_requirement_products.sku_id')->get('project_requirement_products');

					foreach ($q4->result() as $key => $val) {
						array_push($selected_categories, $val->name);
					}
					$selected_categories_impl = implode(', ', $selected_categories);
					$value->categories = $selected_categories_impl;
					$value->total_categories_count = count($categories);
					$value->selected_categories_count = count($selected_categories);
					array_push($response['response']['parent_categories'], $value);
				}

				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			} else {
				$response['success'] = false;
				$response['message'] = 'No Parent Category.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'No Freeze Requirement Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_categories_selection()
	{
		$project_id = $this->input->post('project_id');
		$user_id = $this->input->post('user_id');
		$parent_category_id = $this->input->post('parent_category_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if (empty($parent_category_id)) {
			$response['success'] = false;
			$response['message'] = 'Parent Category Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$response = array();

		$qoute = $this->db->select('selected_budget AS budget, room_type_id')->join('projects', ' projects.id = requirements.project_id', 'left')->where('project_id', $project_id)->where('is_freezed', 1)->get('requirements');
		// echo $this->db->last_query();
		$budget = 0.00;
		$q = $this->db->select('categories.id, categories.name, categories.image_path AS image')
			->where('parent_category_id', $parent_category_id)
			->get('categories');
		if ($q->num_rows() > 0) {
			$budget = $qoute->row()->budget;
			$room_type_id = $qoute->row()->room_type_id;
			if ($room_type_id == 4) {
				$q2 = $this->db->select('id, name, image_path AS image')->where('id !=', 6)->get('parent_categories');
			} else {
				$q2 = $this->db->select('id, name, image_path AS image')->get('parent_categories');
			}
			$quotation_price = 0;
			$q3 = $this->db->select('quotation_price')->where('project_id', $project_id)->where('is_freezed', 1)->get('requirements');
			if ($q3->num_rows() > 0) {
				$quotation_price = $q3->row()->quotation_price;
			}



			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = array();
			$response['response']['budget'] = $budget;
			$response['response']['quotation_price'] = $quotation_price;
			$response['response']['categories'] = array();
			foreach ($q->result() as $key => $value) {
				if ($value->image) {
					$value->image = "https://onespaceinterior.com/" . $value->image;
				} else {
					$value->image = "";
				}
				// $value->selected_brandsheet = '';
				$q2 = $this->db->select('brandsheets.name AS brandsheet')
					->join('requirements', ' requirements.id = requirement_skus.requirement_id', 'left')
					->join('projects', ' projects.id = requirements.project_id', 'left')
					->join('skus', ' skus.id = requirement_skus.sku_id', 'left')
					->join('brandsheets', ' brandsheets.id = skus.brandsheet_id', 'left')->where('requirement_skus.category_id', $value->id)
					->where('projects.id', $project_id)
					->where('is_freezed', 1)->get('requirement_skus');
				// echo $this->db->last_query();
				$selected_brandsheet = '';
				$selection_status = 0; //2 not selected, 1 selected, 0 product selected
				$selected_sub_category = '';
				foreach ($q2->result() as $key => $val) {
					$selected_brandsheet = $val->brandsheet;
				}
				$q4 = $this->db->select('categories.name')->where('project_id', $project_id)->where('skus.category_id', $value->id)->join('skus', 'skus.id = project_requirement_products.sku_id', 'left')->join('categories', 'categories.id = skus.category_id', 'left')->group_by('project_requirement_products.sku_id')->get('project_requirement_products');
				// echo $this->db->last_query();
				if ($q4->num_rows() >= 1) {
					$selection_status = 0;
				} else {
					if ($selected_brandsheet == '') {
						$selection_status = 2;
					} else {
						$selection_status = 1;
					}
				}
				$value->selected_brandsheet = $selected_brandsheet;
				$value->selection_status = $selection_status;
				// $value->selected_sub_categories = array();
				$q3 = $this->db->select('sub_categories.name AS sub_category_name, brandsheets.name AS brandsheet')
					->join('requirements', ' requirements.id = requirement_skus.requirement_id', 'left')
					->join('projects', ' projects.id = requirements.project_id', 'left')
					->join('sub_categories', ' sub_categories.id = requirement_skus.sub_category_id', 'left')->where('requirement_skus.category_id', $value->id)
					->join('skus', ' skus.id = requirement_skus.sku_id', 'left')
					->join('brandsheets', ' brandsheets.id = skus.brandsheet_id', 'left')
					->where('projects.id', $project_id)
					->where('is_freezed', 1)
					->get('requirement_skus');
				// echo $this->db->last_query();
				foreach ($q3->result() as $key => $va) {
					$selected_brandsheet = $va->brandsheet == NULL ? '' : $va->brandsheet;
					$selected_sub_category = $va->sub_category_name;
				}
				$q4 = $this->db->select('categories.name')->where('project_id', $project_id)->where('skus.category_id', $value->id)->join('skus', 'skus.id = project_requirement_products.sku_id', 'left')->join('categories', 'categories.id = skus.category_id', 'left')->join('sub_categories', 'sub_categories.id = skus.sub_category_id', 'left')->group_by('project_requirement_products.sku_id')->get('project_requirement_products');
				if ($q4->num_rows() >= 1) {
					$selection_status = 0;
				} else {
					if ($selected_brandsheet == '') {
						$selection_status = 2;
					} else {
						$selection_status = 1;
					}
				}
				$value->selected_brandsheet = $selected_brandsheet;
				$value->selection_status = $selection_status;
				$value->selected_sub_category = $selected_sub_category;
				array_push($response['response']['categories'], $value);
			}

			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Parent Category Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function exclude_selection()
	{
		$project_id = $this->input->post('project_id');
		$category_id = $this->input->post('category_id');
		$q = $this->db->select('id')->where('project_id', $project_id)->where('is_freezed', 1)->get('requirements');
		$value = $q->result();
		$requirement_id =  $value[0]->id;
		$requirementSkus = $this->db->select('sku_id')->where(['requirement_id' => $requirement_id, 'category_id' => $category_id])->get('requirement_skus');

		if ($requirementSkus->num_rows() > 0) {
			$requirementSkusvalue = $requirementSkus->row()->sku_id;
		}
		$skus = $this->db->select('price')->where(['id' => $requirementSkusvalue])->get('skus');
		if ($skus->num_rows() > 0) {
			$skuPrice = $skus->row()->price;
		}
		$q3 = $this->db->select('quotation_price')->where('project_id', $project_id)->where('is_freezed', 1)->get('requirements');
		if ($q3->num_rows() > 0) {
			$quotation_price = $q3->row()->quotation_price;
		}
		$updateQuote = $this->db->where(['id' => $requirement_id])->update('requirements', array('quotation_price' => $quotation_price - $skuPrice));
		$update = $this->db->where(['requirement_id' => $requirement_id, 'category_id' => $category_id])->update('requirement_skus', array('is_selected' => 0, 'sku_id' => null));
		if ($update && $updateQuote) {
			$response['success'] = true;
			$response['message'] = 'Data Deleted Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While update Data.' . $requirement_id;
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_penalist()
	{
		$project_id = $this->input->get('project_id');
		$city_id = $this->input->get('city_id');
		$q = $this->db->select('users.id, users.name, rating, projects_completed,case when (project_panelist_options.project_id = ' . $project_id . ') then project_panelist_options.priority_no else null end as priority, accuracy')->join('model_has_roles', 'model_has_roles.model_id = users.id', 'left')->join('roles', 'roles.id = model_has_roles.role_id', 'left')->join('user_metas', 'user_metas.user_id = users.id', 'left')->join('project_panelist_options', 'project_panelist_options.panelist_user_id = users.id', 'left')->where('roles.id', 6)->where('users.city_id', $city_id)->get('users');
		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Penalist Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function update_fcm_token_device_id()
	{
		$user_id = $this->input->post('user_id');
		$fcm_token = $this->input->post('fcm_token');
		$device_id = $this->input->post('device_id');

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($fcm_token)) {
			$response['success'] = false;
			$response['message'] = 'FCM Token is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($device_id)) {
			$response['success'] = false;
			$response['message'] = 'Device Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->where('id', $user_id)->get('users');
		$response = array();
		if ($q->num_rows() > 0) {

			$q = $this->db->where('id', $user_id)->update('users', array('fcm_token' => $fcm_token, 'device_id' => $device_id, 'updated_at' => date('Y-m-d H:i:s')));
			if ($q) {

				$response['success'] = true;
				$response['message'] = 'Data Updated Successfully.';
				// $response['response'] = $data;
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			} else {
				$response['success'] = false;
				$response['message'] = 'Error Occurred While Updating.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'No User Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function update_project_penalist()
	{
		$penalist_id = $this->input->post('penalist_id');
		$project_id = $this->input->post('project_id');

		if (empty($penalist_id)) {
			$response['success'] = false;
			$response['message'] = 'Penalist Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->where('id', $project_id)->get('projects');
		$response = array();
		if ($q->num_rows() > 0) {

			$q = $this->db->where('id', $project_id)->update('projects', array('panelist_user_id' => $penalist_id, 'updated_at' => date('Y-m-d H:i:s')));
			if ($q) {

				$response['success'] = true;
				$response['message'] = 'Data Updated Successfully.';
				// $response['response'] = $data;
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			} else {
				$response['success'] = false;
				$response['message'] = 'Error Occurred While Updating.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'No Project Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_project_details()
	{
		$project_id = $this->input->post('project_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$payment_detail_query = $this->db->select('sum(requirements.quotation_price-ifnull(payment_details.amount,0)) as pending_amount,sum(ifnull(payment_details.amount,0)) as paid_amount,sum(requirements.quotation_price) as final_amount')
			->from('requirements')
			->join('payment_details', 'payment_details.project_id=requirements.project_id', 'left')
			->where('requirements.project_id', $project_id)
			->where('requirements.is_freezed', 1)
			->get()->row();

		$q = $this->db->select('projects.start_date,projects.interior_package_id, projects.property_type,projects.completion_shown, projects.city_id, project_partners.name AS partner_project, project_partners.name AS partner_project, cities.name AS citiname,room_types.name AS room_type, project_type, carpet_area, panelist_user_id, selected_budget AS budget, interior_packes.name,interior_packes.subtitle, interior_packes.headtitle')
			->where('projects.id', $project_id)
			->join('interior_packes', 'interior_packes.id = projects.interior_package_id', 'left')
			->join('project_partners', 'project_partners.id = projects.project_partner_id', 'left')
			->join('room_types', 'room_types.id = projects.room_type_id', 'left')
			->join('cities', 'cities.id = projects.city_id', 'left')
			->get('projects');
		$response = array();
		if ($q->num_rows() > 0) {

			// foreach ($q->result() as $key => $value) {
			$value = $q->row();
			if ($value->partner_project == NULL) {
				$value->partner_project = '';
			} else {
				$value->partner_project;
			}
			if ($value->start_date == NULL) {
				$value->start_date = '';
			} else {
				$value->start_date = date('d/m/Y', strtotime($value->start_date));
			}

			if ($value->property_type == '1') {
				$property_type = 'Flat';
			} elseif ($value->property_type == '2') {
				$property_type = 'Row House';
			} elseif ($value->property_type == '3') {
				$property_type = 'Independent House';
			}
			$value->property_type = $property_type;

			if ($value->project_type == '1') {
				$project_type = 'Consultancy';
			} elseif ($value->project_type == '2') {
				$project_type = 'Turnkey';
			} elseif ($value->project_type == '3') {
				$project_type = 'Others';
			}
			$value->project_type = $project_type;

			$value->document_enabled = false;
			$value->timeline_enabled = false;
			$value->product_enabled = false;
			$value->panelist_enabled = false;
			$value->daily_work_status_enabled = false;
			$value->feedback_enabled = false;
			$value->pending_amount = $payment_detail_query->pending_amount;
			$value->paid_amount = $payment_detail_query->paid_amount;
			$value->final_amount = $payment_detail_query->final_amount;
			// }

			$note = "Freeze any one requirement to proceed ahead.";
			$q2 = $this->db->where('project_id', $project_id)->order_by('id', 'desc')->get('project_status');
			// echo $this->db->last_query();
			if ($q2->num_rows() > 0) {
				$val = $q2->row();
				// foreach ($q2->result() as $key => $val) {
				if ($val->project_stage_id >= 1 && $val->status > 0) {
					$value->document_enabled = true;
				}
				if ($val->project_stage_id >= 3) {
					$value->timeline_enabled = true; //$val->status;
				}
				if ($val->project_stage_id >= 4) {
					$value->product_enabled = true;
				}
				if ($val->project_stage_id >= 6) {
					$value->panelist_enabled = true;
				}
				if ($val->project_stage_id >= 7 && $val->status > 0) {
					$value->daily_work_status_enabled = true;
				}
				if ($val->project_stage_id >= 10 || $val->project_stage_id == 4 || $val->project_stage_id == 8) {
					$value->feedback_enabled = true;
				}
				if ($val->project_stage_id == 0 && $val->current_status == 0) {
					$note = "Freeze any one requirement to proceed ahead. ";
				} else if ($val->project_stage_id == 1) {
					$note = "Finish 10% of the Project payment. ";
				} else if ($val->project_stage_id == 2) {
					$note = "Project timeline is generated as per your request. ";
				} else if ($val->project_stage_id == 3) {
					$note = "Finish product design selection of your choice. ";
				} else if ($val->project_stage_id == 4) {
					$note = "Finish next 50% of the Project payment. ";
				} else if ($val->project_stage_id == 5) {
					$note = "Select a panelist to start project execution. ";
				} else if ($val->project_stage_id == 6) {
					$note = "Project execution is going on. ";
				} else if ($val->project_stage_id == 7) {
					$note = "Visit our factory for product experience. ";
				} else if ($val->project_stage_id == 8) {
					$note = "Project execution is going on. ";
				} else if ($val->project_stage_id == 9) {
					$note = "Project is completed. Please provide valuable feedback. ";
				} else if ($val->project_stage_id == 10) {
					$note = "Project is Completed. ";
				} else {
					$note .= $val->project_stage_id;
				}
			}
			$q3 = $this->db->where(['project_id' => $project_id, 'status' => '4'])->order_by('project_stage_id', 'desc')->get('project_status');
			if ($q3->num_rows() > 0) {
				$value->currentStatus = $q3->row()->project_stage_id;
			} else {
				$value->currentStatus = "0";
			}
			$value->note = $note;

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $value;
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Project Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_project_timelines()
	{
		$project_id = $this->input->post('project_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->select('timeline_detail_master_id, name, required_days, required_date, actual_days, actual_date, remarks, timeline_details_master.work_percentage AS work_percentage')->join('timeline_details_master', 'timeline_details_master.id = project_timelines.timeline_detail_master_id')->where('project_id', $project_id)->get('project_timelines');
		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Project Timeline Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_user()
	{
		$user_id = $this->input->post('user_id');

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->select('name, first_name, last_name, phone, email, fcm_token')->where('id', $user_id)->get('users');
		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->row();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No User Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_products_selection()
	{
		$project_id = $this->input->post('project_id');
		$user_id = $this->input->post('user_id');
		$category_id = $this->input->post('category_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if (empty($category_id)) {
			$response['success'] = false;
			$response['message'] = 'Category Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$project_query = $this->db->select('carpet_area,city_id')
			->where('id', $project_id)
			->get('projects')->row();

		$response = array();
		$q = $this->db->select('requirement_skus.sub_category_id, skus.brandsheet_id, sku_id, qty')
			->join('projects', ' projects.id = requirements.project_id', 'left')
			->join('requirement_skus', 'requirement_skus.requirement_id = requirements.id', 'left')
			->join('skus', 'skus.id = requirement_skus.sku_id', 'left')
			->where('skus.category_id', $category_id)
			->where('skus.city_id', $project_query->city_id)
			->group_by('requirement_skus.sub_category_id, skus.brandsheet_id, sku_id, qty')
			->get('requirements');
		// echo $this->db->last_query();
		$budget = 0;
		$q2 = $this->db->select('selected_budget AS budget')->where('id', $project_id)->get('projects');
		if ($q2->num_rows() > 0) {
			$budget = $q2->row()->budget;
		}
		$quotation_price = 0;
		$q3 = $this->db->select('quotation_price')->where('project_id', $project_id)->where('is_freezed', 1)->get('requirements');
		if ($q3->num_rows() > 0) {
			$quotation_price = $q3->row()->quotation_price;
		}
		$sub_category_id = 0;
		$brandsheet_id = 0;
		$sku_id = 0;
		$sku_ids = [];
		$rqty = 0;
		if ($q->num_rows() > 0) {
			// $budget = $q->row()->budget;
			$sub_category_id = $q->row()->sub_category_id;
			$brandsheet_id = $q->row()->brandsheet_id;
			$sku_id = $q->row()->sku_id;
			$sku_ids = array_map(function ($element) {
				return $element->sku_id;
			}, (array) $q->result());
			$rqty = $q->row()->qty;
		}
		// echo $sku_id;
		$response['success'] = true;
		$response['message'] = 'Fetched Successfully..';
		$response['response'] = array();
		$response['response']['budget'] = $budget;
		$response['response']['quotation_price'] = $quotation_price;
		$q4 = $this->db->select('has_subcategories')->where('id', $category_id)->get('categories');
		if ($q4->num_rows() > 0) {
			if ($q4->row()->has_subcategories == 1) {
				$response['response']['category_id'] = $category_id;
				$response['response']['has_subcategories'] = $q4->row()->has_subcategories;
				$response['response']['categories'] = NULL;
				$response['response']['sub_categories'] = array();
				$q5 = $this->db->select('sub_categories.id, sub_categories.name, qty')->join('categories', 'categories.id = sub_categories.category_id', 'left')->where('category_id', $category_id)->get('sub_categories');
				foreach ($q5->result() as $key => $valu) {
					$qty = [];
					if ($valu->qty) {
						if ($valu->id == $sub_category_id) {
							for ($i = 1; $i <= $valu->qty; $i++) {
								array_push($qty, array('title' => $i, 'is_selected' => $i == $rqty ? true : false));
							}
						}
					}
					$valu->qty = $qty;
					$valu->is_selected = $sub_category_id == $valu->id ? true : false;
					$valu->brandsheets = array();
					$q6 = $this->db->select('brandsheets.id, brandsheets.name, price, categories.multiplier_enabled,categories.multiplier_value')
						->join('skus', 'skus.brandsheet_id = brandsheets.id', 'left')
						->join('categories', 'categories.id = skus.category_id', 'left')
						->where('skus.city_id', $project_query->city_id)
						->where('sub_category_id', $valu->id)->get('brandsheets');

					if ($q6->num_rows() > 0) {
						foreach ($q6->result() as $key => $val) {
							$val->is_selected = $brandsheet_id == $val->id ? true : false;
							if ($val->multiplier_enabled == 1) {
								$val->price = $this->calculateCarpetArea($val->price, $val->multiplier_value, $project_query->carpet_area);
							}
							array_push($valu->brandsheets, $val);
						}
					} else {
						$q10 = $this->db->select('brandsheets.id, brandsheets.name')->get('brandsheets');
						foreach ($q10->result() as $key => $val) {
							$val->is_selected = false;
							$val->price = 0;
							array_push($valu->brandsheets, $val);
						}
					}
					$valu->designs = array();
					$q7 = $this->db->select('products.id, products.name, products.description, products.image_path AS image, brandsheet_id')->join('skus', 'skus.id = products.sku_id', 'left')
						->where('sub_category_id', $valu->id)
						->where_in('sku_id', $sku_ids)->get('products');
					$q9 = $this->db->select('sku_product_id')->where('project_id', $project_id)->group_by('sku_product_id')->order_by('id', 'desc')->get('project_requirement_products');
					// echo $this->db->last_query();
					$sku_product_id = $q9->num_rows() > 0 ? $q9->row()->sku_product_id : 0;
					// echo $sku_product_id;
					if ($q7->num_rows() > 0) {
						foreach ($q7->result() as $key => $va) {
							if ($va->image) {
								$va->image = "https://onespaceinterior.com/" . $va->image;
							} else {
								$val->image = "";
							}
							$va->is_selected = $sku_product_id == $va->id ? true : false;
							array_push($valu->designs, $va);
						}
					}
					$valu->filters = array();
					// $q8 = $this->db->select('sku_meta_master_names.id, sku_meta_master_names.name,skus.brandsheet_id')
					// 	->join('sku_meta_master_names', 'sku_meta_master_names.id = sku_metas.meta_name_id', 'left')
					// 	->join('skus', 'skus.id = sku_metas.sku_id')
					// 	->where('skus.sub_category_id',$valu->id)
					// 	->where_in('sku_id', $sku_ids)->get('sku_metas');


					$q8 = $this->db->select('sku_meta_master_names.id, sku_meta_master_names.name,skus.brandsheet_id')
						->join('sku_meta_master_names', 'sku_meta_master_names.id = sku_metas.meta_name_id')
						->join('skus', 'skus.id = sku_metas.sku_id')
						->where('skus.sub_category_id', $valu->id)
						->where_in('sku_id', $sku_ids)->get('sku_metas');

					if ($q8->num_rows() > 0) {
						foreach ($q8->result() as $key => $v) {
							$v->values = array();
							$q9 = $this->db->select('sku_meta_master_values.id, sku_meta_master_values.value,json_arrayagg(json_object("name",sku_meta_catalogues.name, "id" ,sku_meta_catalogues.id,"image_path" ,sku_meta_catalogues.image_path)) as "catalogues"')
								->join('sku_meta_catalogues', 'sku_meta_catalogues.meta_value_id=sku_meta_master_values.id', 'left')
								->where('meta_name_id', $v->id)
								->group_by('sku_meta_master_values.value')
								->get('sku_meta_master_values');
							if ($q9->num_rows() > 0) {
								foreach ($q9->result() as $key => $vv) {
									$q10 = $this->db->select('sku_meta_value_id')->where('project_id', $project_id)->where('sku_meta_value_id', $vv->id)->order_by('id', 'desc')->get('project_requirement_products');
									$sku_meta_value_id = $q10->num_rows() > 0 ? $q10->row()->sku_meta_value_id : 0;
									$vv->is_selected = $vv->id == $sku_meta_value_id ? true : false;
									$vv->catalogues = json_decode($vv->catalogues);
									$selectedCatalog = 0;
									foreach ($vv->catalogues as $key => $catalog) {
										if ($catalog->id != null ||  $catalog->id != 0 ||  $catalog->id != "") {
											$q12 = $this->db->select('sku_meta_cid')->where('project_id', $project_id)->where('sku_meta_cid', $catalog->id)->order_by('id', 'desc')->get('project_requirement_products');
											$sku_meta_cid = $q12->num_rows() > 0 ? $q12->row()->sku_meta_cid : 0;
											$catalog->is_selected = $catalog->id == $sku_meta_cid ? true : false;
											if ($selectedCatalog == 0 && $catalog->is_selected) {
												$selectedCatalog = 1;
											}
											if ($catalog->image_path) {
												$catalog->image_path = "https://onespaceinterior.com/" . $catalog->image_path;
											} else {
												$catalog->image_path = "";
											}
										} else {
											$vv->catalogues = [];
										}
									}
									if ($selectedCatalog == 0 && ($vv->catalogues[0]->id != null ||  $vv->catalogues[0]->id != 0 ||  $vv->catalogues[0]->id != "")) {
										$vv->catalogues[0]->is_selected = true;
									}
								}
								$v->values = $q9->result();
							}
							// unset($v->id);
						}
						$valu->filters = $q8->result();
					}
					array_push($response['response']['sub_categories'], $valu);
				}
			} else {
				$response['response']['category_id'] = $category_id;
				$response['response']['has_subcategories'] = $q4->row()->has_subcategories;
				$response['response']['sub_categories'] = NULL;
				$response['response']['categories'] = array();
				$q5 = $this->db->select('id, name, qty')->where('id', $category_id)->get('categories');
				foreach ($q5->result() as $key => $valu) {
					$qty = [];
					if ($valu->qty) {
						for ($i = 1; $i <= $valu->qty; $i++) {
							array_push($qty, array('title' => $i, 'is_selected' => $i == $rqty ? true : false));
						}
					}
					$valu->qty = $qty;
					$valu->is_selected = $category_id == $valu->id ? true : false;
					$valu->brandsheets = array();

					$q6 = $this->db->select('brandsheets.id, brandsheets.name, price, categories.multiplier_enabled,categories.multiplier_value')
						->join('skus', 'skus.brandsheet_id = brandsheets.id', 'left')
						->join('categories', 'categories.id = skus.category_id', 'left')
						->where('category_id', $category_id)
						->where('skus.city_id', $project_query->city_id)->get('brandsheets');
					if ($q6->num_rows() > 0) {
						foreach ($q6->result() as $key => $val) {
							$val->is_selected = $brandsheet_id == $val->id ? true : false;
							if ($val->multiplier_enabled == 1) {
								$val->price = $this->calculateCarpetArea($val->price, $val->multiplier_value, $project_query->carpet_area);
							}
							array_push($valu->brandsheets, $val);
						}
					} else {
						$q9 = $this->db->select('brandsheets.id, brandsheets.name')->get('brandsheets');
						foreach ($q9->result() as $key => $val) {
							$val->is_selected = false;
							$val->price = 0;
							array_push($valu->brandsheets, $val);
						}
					}
					$valu->designs = array();
					$q7 = $this->db->select('products.id, products.name, products.description, products.image_path AS image, brandsheet_id')->join('skus', 'skus.id = products.sku_id', 'left')
						->where('category_id', $valu->id)
						->where_in('sku_id', $sku_ids)->get('products');

					$q9 = $this->db->select('sku_product_id')->where('project_id', $project_id)->group_by('sku_product_id')->order_by('id', 'desc')->get('project_requirement_products');
					$sku_product_id = $q9->num_rows() > 0 ? $q9->row()->sku_product_id : 0;
					// echo $sku_product_id;
					if ($q7->num_rows() > 0) {
						foreach ($q7->result() as $key => $va) {
							if ($va->image) {
								$va->image = "https://onespaceinterior.com/" . $va->image;
							} else {
								$va->image = "";
							}
							$va->is_selected = $sku_product_id == $va->id ? true : false;
							array_push($valu->designs, $va);
						}
					}
					$valu->filters = array();

					$q8 = $this->db->select('sku_meta_master_names.id, sku_meta_master_names.name,skus.brandsheet_id')
						->join('sku_meta_master_names', 'sku_meta_master_names.id = sku_metas.meta_name_id')
						->join('skus', 'skus.id = sku_metas.sku_id')
						->where('skus.category_id', $valu->id)
						->where_in('sku_id', $sku_ids)->get('sku_metas');
					// $q8 = $this->db->select('sku_meta_master_names.id, sku_meta_master_names.name,skus.brandsheet_id')
					// 	->join('sku_meta_master_names', 'sku_meta_master_names.id = sku_metas.meta_name_id')
					// 	->join('skus', 'skus.id = sku_metas.sku_id')
					// 	->where('sku_id', $sku_id)->get('sku_metas');

					$valu->filters = $q8->result();
					if ($q8->num_rows() > 0) {
						foreach ($q8->result() as $key => $v) {
							$v->values = array();
							$q9 = $this->db->select('sku_meta_master_values.id, sku_meta_master_values.value,json_arrayagg(json_object("name",sku_meta_catalogues.name, "id" ,sku_meta_catalogues.id,"image_path" ,sku_meta_catalogues.image_path)) as "catalogues"')
								// ->from('sku_meta_catalogues')
								->join('sku_meta_catalogues', 'sku_meta_catalogues.meta_value_id=sku_meta_master_values.id', 'left')
								->where('meta_name_id', $v->id)
								->group_by('sku_meta_master_values.value')
								->get('sku_meta_master_values');

							if ($q9->num_rows() > 0) {
								foreach ($q9->result() as $key => $vv) {
									$q10 = $this->db->select('sku_meta_value_id')->where('project_id', $project_id)->where('sku_meta_value_id', $vv->id)->order_by('id', 'desc')->get('project_requirement_products');
									$sku_meta_value_id = $q10->num_rows() > 0 ? $q10->row()->sku_meta_value_id : 0;
									$vv->is_selected = $vv->id == $sku_meta_value_id ? true : false;
									$vv->catalogues = json_decode($vv->catalogues);
									foreach ($vv->catalogues as $key => $catalog) {
										if ($catalog->id != null ||  $catalog->id != 0 ||  $catalog->id != "") {
											$q12 = $this->db->select('sku_meta_cid')->where('project_id', $project_id)->where('sku_meta_cid', $catalog->id)->order_by('id', 'desc')->get('project_requirement_products');
											$sku_meta_cid = $q12->num_rows() > 0 ? $q12->row()->sku_meta_cid : 0;
											$catalog->is_selected = $catalog->id == $sku_meta_cid ? true : false;
											$selectedCatalog = 0;
											if ($selectedCatalog == 0 && $catalog->is_selected) {
												$selectedCatalog = 1;
											}
											if ($catalog->image_path) {
												$catalog->image_path = "https://onespaceinterior.com/" . $catalog->image_path;
											} else {
												$catalog->image_path = "";
											}
										} else {
											//$catalog->is_selected =  false;
											$vv->catalogues = [];
										}
									}

									if ($selectedCatalog == 0 && ($vv->catalogues[0]->id != null ||  $vv->catalogues[0]->id != 0 ||  $vv->catalogues[0]->id != "")) {
										$vv->catalogues[0]->is_selected = true;
									}
								}
								$v->values = $q9->result();
							}
						}
						$valu->filters = $q8->result();
					}
					array_push($response['response']['categories'], $valu);
				}
			}
		}
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
		exit();
	}

	public function store_StandAloneService()
	{
		$user_id = $this->input->post('user_id');
		$standalone_id = $this->input->post('standalone_id');
		$estimatedAmount = $this->input->post('estimatedAmount');
		$paid_amount = $this->input->post('paid_amount');
		$payment_id = $this->input->post('payment_id');
		$payment_status = $this->input->post('payment_status');
		$appoinmentDate = $this->input->post('appoinmentDate');
		$appoinmentTime = $this->input->post('appoinmentTime');
		$otp = rand(100000, 999999);

		if (empty($standalone_id)) {
			exit();
		}
		$q = $this->db->insert('order_standAlone', array('user_id' => $user_id, 'standalone_id' => $standalone_id, 'estimatedAmount' => $estimatedAmount, 'paid_amount' => $paid_amount, 'payment_id' => $payment_id, 'payment_status ' => $payment_status, 'createdAt' => date('Y-m-d H:i:s'), 'updatedAt' => date('Y-m-d H:i:s'), 'appoinmentDate ' => $appoinmentDate, 'appoinmentTime ' => $appoinmentTime, 'service_OTP' => $otp));
		if ($q) {
			$order_id = $this->db->insert_id();
			$response['order_id'] = $order_id;
			$response['success'] = true;
			$response['message'] = 'Data Inserted Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While update Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function update_StandAloneServiceTime()
	{
		$id = $this->input->post('serviceId');
		$appoinmentDate = $this->input->post('appoinmentDate');
		$appoinmentTime = $this->input->post('appoinmentTime');
		$q = $this->db->where(['id' => $id])->update('order_standAlone', array('appoinmentDate' => $appoinmentDate, 'appoinmentTime' => $appoinmentTime));
		if ($q) {
			$response['success'] = true;
			$response['message'] = 'Data Updated Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While update Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function fetch_orderStandAloneService()
	{
		$user_id = $this->input->post('user_id');
		$q = $this->db->select('users.id, users.name, standAloneServices.*,order_standAlone.*')
			->join('users', 'users.id = order_standAlone.user_id', 'left')
			->join('standAloneServices', 'standAloneServices.id = order_standAlone.standalone_id', 'left')
			->where('order_standAlone.user_id', $user_id)->get('order_standAlone');
		if ($q->num_rows() > 0) {
			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $q->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No data Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function store_product_selection()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);

		if ($request->project_id == '') {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->category_id == '') {
			$response['success'] = false;
			$response['message'] = 'Category Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->brand_sheet_id == '') {
			$response['success'] = false;
			$response['message'] = 'Brand Sheet Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$sku_id = NULL;

		$project_query = $this->db->select('city_id')->where(['id' => $request->project_id])->get('projects');
		if ($project_query->num_rows() > 0) {
			$city_id = $project_query->row()->city_id;
		}
		$q3 = $this->db->select('id')->where('brandsheet_id', $request->brand_sheet_id)->where('category_id', $request->category_id)->where('city_id', $city_id)->get('skus');
		if ($q3->num_rows() > 0) {
			$sku_id = $q3->row()->id;
		}
		$this->db->where(['project_id' => $request->project_id, 'category_id' => $request->category_id])->delete('project_requirement_products');
		$queryy = $this->db->select('freezed_requirement_id')->where(['id' => $request->project_id])->get('projects');
		if ($queryy->num_rows() > 0) {
			$requirement_id = $queryy->row()->freezed_requirement_id;
		}

		$this->db->where(['category_id' => $request->category_id, 'requirement_id' => $requirement_id])->update('requirement_skus', array('sku_id' => $sku_id));
		if (count($request->sku_metas) == 0) {
			$q = $this->db->insert('project_requirement_products', array('project_id' => $request->project_id, 'category_id' => $request->category_id, 'sku_product_id' => $request->sku_product_id, 'sku_id ' => $sku_id, 'requirement_id' => $requirement_id, 'qty' => $request->qty, 'created_at' => date('Y-m-d H:i:s')));
		} else {
			for ($i = 0; $i < count($request->sku_metas); $i++) {
				if ($request->sub_category_id == '0') {
					$q = $this->db->insert('project_requirement_products', array('project_id' => $request->project_id, 'category_id' => $request->category_id, 'sku_product_id' => $request->sku_product_id, 'sku_id ' => $sku_id, 'sku_meta_name_id' => $request->sku_metas[$i]->sku_meta_name_id, 'sku_meta_value_id' => $request->sku_metas[$i]->sku_meta_value_id, 'sku_meta_cid' => $request->sku_metas[$i]->sku_meta_cid, 'requirement_id' => $requirement_id, 'qty' => $request->qty, 'created_at' => date('Y-m-d H:i:s')));
				} else {
					$q = $this->db->insert('project_requirement_products', array('project_id' => $request->project_id, 'category_id' => $request->category_id, 'sku_product_id' => $request->sku_product_id, 'sku_id ' => $sku_id, 'sku_meta_name_id' => $request->sku_metas[$i]->sku_meta_name_id, 'sku_meta_value_id' => $request->sku_metas[$i]->sku_meta_value_id, 'sku_meta_cid' => $request->sku_metas[$i]->sku_meta_cid, 'requirement_id' => $requirement_id, 'qty' => $request->qty, 'created_at' => date('Y-m-d H:i:s')));
				}
			}
		}

		if ($q) {
			$response['success'] = true;
			$response['message'] = 'Data Inserted Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While Inserting Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function confirm_selection()
	{

		$project_id = $this->input->post('project_id');
		$q = $this->db->select('id,modification_no')->where(['project_id' => $project_id, 'is_freezed' => 1])->get('requirements');
		$qq = $this->db->insert('project_status', array('project_id' => $project_id, 'project_stage_id' => 5, 'status ' => 1));

		if ($q->num_rows() > 0) {
			$value = $q->result();
			$modification_no = (int) $value[0]->modification_no;
			$modification_no = $modification_no + 2;
			$requirement_id = $value[0]->id;
			$this->db->where(['id' => $requirement_id])->update('requirements', array('modification_enabled' => 0, 'modification_no' => $modification_no));
			$requirement_products = $this->db->select('category_id,sku_id,sku_product_id,sku_meta_name_id,sku_meta_value_id,qty,sku_meta_cid')->where(['project_id' => $project_id, 'requirement_id' => $requirement_id])->get('project_requirement_products');
			if ($requirement_products->num_rows() > 0) {
				foreach ($requirement_products->result() as $key => $value) {
					$this->db->insert('modification_records', array('requirement_id' => $requirement_id, 'category_id' => $value->category_id, 'sku_id' => $value->sku_id, 'sku_product_id' => $value->sku_product_id, 'sku_meta_name_id' => $value->sku_meta_name_id, 'sku_meta_value_id' => $value->sku_meta_value_id, 'sku_meta_cid' => $value->sku_meta_cid, 'qty' => $value->qty, 'modification_no' => $modification_no));
				}
			}
			$response['success'] = true;
			$response['message'] = 'Data updated Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While update Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function store_panelist_selection()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		$i = 0;
		$this->db->where(['project_id' => $request->panelist[$i]->project_id])->delete('project_panelist_options');
		for ($i = 0; $i < count($request->panelist); $i++) {
			$q = $this->db->insert('project_panelist_options', array('project_id' => $request->panelist[$i]->project_id, 'priority_no' => $request->panelist[$i]->priority_no, 'panelist_user_id' => $request->panelist[$i]->panelist_user_id, 'status' => '0', 'created_at' => date('Y-m-d H:i:s')));
		}
		if ($q) {
			$response['success'] = true;
			$response['message'] = 'Data Inserted Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While Inserting Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function fetch_work_status()
	{
		$project_id = $this->input->post('project_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		//$q = $this->db->select('id, image_path AS image, description')->where('project_id', $project_id)->get('work_status');
		$q = $this->db->select('id, documents AS image, remarks as description')->where('project_id', $project_id)->get('project_timelines');

		$response = array();
		if ($q->num_rows() > 0) {
			foreach ($q->result() as $key => $value) {
				if ($value->image) {
					$img_url = unserialize($value->image);
					if (count($img_url) > 0) {
						$value->image = "https://onespaceinterior.com/" . $img_url[0];
					} else {
						$value->image = '';
					}
				} else {
					$value->image = '';
				}
			}
			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = array_filter($q->result(), function ($element) {
				return !empty($element->image);
			});
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Work Status Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function update_project_status()
	{
		$user_id = $this->input->post('user_id');
		$project_id = $this->input->post('project_id');

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$this->db->where(['user_id' => $user_id, 'id' => $project_id])->update('projects', array('project_status' => 2, 'completion_shown' => 1));
		$q = $this->db->insert('project_status', array('project_id' => $project_id, 'project_stage_id' => 10, 'status ' => 5));
		if ($q) {
			$response['success'] = true;
			$response['message'] = 'Data Inserted Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While Inserting Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function update_completion_shown()
	{
		$user_id = $this->input->post('user_id');
		$project_id = $this->input->post('project_id');

		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$q = $this->db->where(['user_id' => $user_id, 'id' => $project_id])->update('projects', array('customer_action_status' => 1));
		if ($q) {
			$response['success'] = true;
			$response['message'] = 'Data Updated Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While Inserting Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function fetch_feedback()
	{
		try {

			$project_id = $this->input->get('project_id');

			$feedbacks = $this->db->select('id, project_id, user_id, design_feedback, attribute1, attribute2, attribute3, attribute4, attribute5, attribute6, attribute7')
				->where('project_id', $project_id)
				->get('feedbacks');


			$this->response([
				'success' => true,
				'message' => 'Feedback Fetched Successfully.',
				'response' => $feedbacks->result()
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function store_feedback()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		if ($request->project_id == '') {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->insert('feedbacks', array('project_id' => $request->project_id, 'user_id' => $request->user_id, 'design_feedback' => $request->design_feedback, 'attribute1' => $request->attribute1, 'attribute2' => $request->attribute2, 'attribute3' => $request->attribute3, 'attribute4' => $request->attribute4, 'attribute5' => $request->attribute5, 'attribute6' => $request->attribute6, 'attribute7' => $request->attribute7, 'created_at' => date('Y-m-d H:i:s')));
		if ($q) {

			$response['success'] = true;
			$response['message'] = 'stored Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No Feedback Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_user_docs()
	{
		$project_id = $this->input->post('project_id');
		$user_id = $this->input->post('user_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$q = $this->db->select('project_stage_id')->where('project_id', $project_id)->group_by('project_stage_id')->get('project_data');

		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = array();
			foreach ($q->result() as $key => $value) {
				if ($value->project_stage_id == 1) {
					$value->project_stage = 'Booked';
				} else if ($value->project_stage_id == 2) {
					$value->project_stage = 'First Payment';
				} else if ($value->project_stage_id == 3) {
					$value->project_stage = 'Timeline';
				} else if ($value->project_stage_id == 4) {
					$value->project_stage = 'Design Process';
				} else if ($value->project_stage_id == 5) {
					$value->project_stage = 'Second Payment (50%) + Differential Amount';
				} else if ($value->project_stage_id == 6) {
					$value->project_stage = 'Panelist Selection';
				} else if ($value->project_stage_id == 7) {
					$value->project_stage = 'Daily Work Status - Part A & B';
				} else if ($value->project_stage_id == 8) {
					$value->project_stage = 'Factory Visit & Third Payment(40%)';
				} else if ($value->project_stage_id == 9) {
					$value->project_stage = 'Daily Work Status - Part C';
				} else if ($value->project_stage_id == 10) {
					$value->project_stage = 'Handover';
				}
				$q2 = $this->db->select('id, file_path, name, document_type, customer_action, customer_action_status')->where('project_id', $project_id)->where('project_stage_id', $value->project_stage_id)->get('project_data');
				// unset($value->id);
				$value->values = array();
				if ($q2->num_rows() > 0) {
					foreach ($q2->result() as $key => $val) {
						if ($val->file_path) {
							$val->file_path = "https://onespaceinterior.com/" . $val->file_path;
						} else {
							$val->file_path = '';
						}
					}
					$value->values = $q2->result();
				}
				array_push($response['response'], $value);
				unset($value->project_stage_id);
			}
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No User Doc Found.';
			$response['response'] = array();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_pdf()
	{
		$project_id = $this->input->post('project_id');

		if (empty($project_id)) {
			$response['success'] = false;
			$response['message'] = 'Project Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->select('id, project_id, file_path')->where('project_id', $project_id)->where('customer_action', 1)->get('project_data');

		$response = array();
		if ($q->num_rows() > 0) {

			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = array();

			if ($q->num_rows() > 0) {
				foreach ($q->result() as $key => $val) {
					if ($val->file_path) {
						$val->file_path = "https://onespaceinterior.com/" . $val->file_path;
					} else {
						$val->file_path = '';
					}
				}
				$response['response'] = $q->result();
			}
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No PDF Found.';
			// $response['response'] = array();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function home_page()
	{
		try {
			$user_id = $this->input->get('user_id');
			$user_id = (empty($user_id)) ? 0 : $user_id;

			$banners    = $this->db->select('id, name, image,redirection_url')
				->where('status', 1)
				->where('is_primary', 1)
				->get('homes_banner');



			$categories = $this->db->select('id, image, name')
				->where('status', 1)
				->get('homes_category');

			$midbanners = $this->db->select('id, name, image,redirection_url')
				->where('status', 1)
				->where('is_primary', 0)
				->get('homes_banner');

			$featured_products = $this->db->select('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price, homes_product.thumbnail as images, (case when homes_wishlist.id is not null then true else false end) as is_fav,AVG(homes_product_reviews.rating) rating,round(((homes_product.discount_price/homes_product.original_price)*100),0) as discount_percent')
				->from('homes_product')
				->join('homes_product_images', 'homes_product.id = homes_product_images.product_id', 'left')
				->join('homes_wishlist', 'homes_product.id = homes_wishlist.product_id and homes_wishlist.user_id=' . $user_id, 'left')
				->join('homes_product_reviews', 'homes_product.id = homes_product_reviews.product_id', 'left')
				->where('homes_product.status', 1)
				->where('homes_product.trending', 1)
				->group_by('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price,homes_wishlist.id')
				->limit(10)
				->get();

			$trending_products = $this->db->select('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price, homes_product.thumbnail as images, (case when homes_wishlist.id is not null then true else false end) as is_fav,AVG(homes_product_reviews.rating) rating,round(((homes_product.discount_price/homes_product.original_price)*100),0) as discount_percent')
				->from('homes_product')
				->join('homes_product_images', 'homes_product.id = homes_product_images.product_id', 'left')
				->join('homes_wishlist', 'homes_product.id = homes_wishlist.product_id and homes_wishlist.user_id=' . $user_id, 'left')
				->join('homes_product_reviews', 'homes_product.id = homes_product_reviews.product_id', 'left')
				->where('homes_product.status', 1)
				->where('homes_product.trending', 2)
				->group_by('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price,homes_wishlist.id')
				->limit(10)
				->get();

			$wishlist = $this->db->select('homes_product.id, homes_product.name,users.name as sold_by, homes_product.original_price, homes_product.discount_price, homes_product.thumbnail as images,round(((homes_product.discount_price/homes_product.original_price)*100),0) as discount_percent,users.name as vendor_name')
				->from('homes_wishlist')
				->join('homes_product', 'homes_wishlist.product_id=homes_product.id')
				->join('homes_product_images', 'homes_product.id = homes_product_images.product_id', 'left')
				->join('users', 'users.id=homes_product.created_by', 'left')
				->where('homes_wishlist.user_id', $user_id)
				->get();


			$this->response([
				'success' => true,
				'message' => null,
				'response' => [
					'banners' => $banners->result(),
					'categories' => $categories->result(),
					'ad_banner' => $midbanners->result(),
					'trending_products' => $trending_products->result(),
					'featured_products' => $featured_products->result(),
					'wishlist' => $wishlist->result()
				]
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function dashboard_Main()
	{
		try {

			$user_id = $this->input->post('user_id');
			$user_id = (empty($user_id)) ? 0 : $user_id;
			$city_id = $this->input->post('city_id');
			$city_id = (empty($city_id)) ? "0" : $city_id;
			$component = $this->db->select('standAloneServices.id,standAloneServices.name ,standAloneServices.icon ,standAloneServices.description ,standAloneServices.galary ,
							categories.image_path , categories.info_document_path ,categories.info_document_video_path ,categories.multiplier_enabled ,categories.multiplier_value ,categories.qty')
				->where('standAloneServices.isComponent', 1)
				->join('categories', 'categories.id = standAloneServices.category_id', 'left')
				->get('standAloneServices')->result();

			foreach ($component as &$s) {
				$skus = $this->db->select('skus.*, brandsheets.name AS brandName')
					->where('skus.city_id', $city_id)
					->where('skus.category_id', $s->category_id)
					->join('brandsheets', ' brandsheets.id = skus.brandsheet_id', 'left')
					->group_by('skus.id')
					->get('skus')->result();
				$s->brandsheet = $skus;
			}

			$services    = $this->db->select('standAloneServices.id,standAloneServices.name ,standAloneServices.icon ,standAloneServices.description ,standAloneServices.galary ,
								categories.id as category_id,categories.image_path , categories.info_document_path , categories.brand_description, categories.takenCarePoints,categories.info_document_video_path ,categories.multiplier_enabled ,categories.multiplier_value ,categories.qty')
				->where('standAloneServices.isComponent', 2)
				->join('categories', 'categories.id = standAloneServices.category_id', 'left')
				->get('standAloneServices')->result();

			foreach ($services as &$v) {
				$skus = $this->db->select('skus.*, brandsheets.name AS brandName')
					->where('skus.city_id', $city_id)
					->where('skus.category_id', $v->category_id)
					->join('brandsheets', ' brandsheets.id = skus.brandsheet_id', 'left')
					->group_by('skus.id')
					->get('skus')->result();
				$v->brandsheet = $skus;
			}

			$banners    = $this->db->select('id, name, image,redirection_url')
				->where('status', 1)
				->where('is_primary', 1)
				->get('homes_banner');

			$cities = $this->db->select('id,cityCountry, name')->get('cities');

			$completedProject = $this->db->select('website_projects.*')
				->get('website_projects');

			$categories = $this->db->select('id, image, name')
				->where('status', 1)
				->get('homes_category');

			$midbanners = $this->db->select('id, name, image,redirection_url')
				->where('status', 1)
				->where('is_primary', 0)
				->get('homes_banner');


			$panelistImages = array('https://onespaceinterior.com/uploads/Component/GANESHMISTRY.gif', 'https://onespaceinterior.com/uploads/Component/KIRTIAGARWAL.gif', 'https://onespaceinterior.com/uploads/Component/SHIVANGIAGARWAL.gif');

			$ourGlimps = array('https://onespaceinterior.com/uploads/Component/video1.gif', 'https://onespaceinterior.com/uploads/Component/video2.gif', 'https://onespaceinterior.com/uploads/Component/video3.gif', 'https://onespaceinterior.com/uploads/Component/video4.gif');

			$subcategories = $this->db->select('id, name, image')
				->where('category_id', 9)
				->where('status', 1)
				->get('homes_subcategory');

			$panelist = $this->db->select('users.id, users.name, rating, projects_completed, accuracy')
				->join('model_has_roles', 'model_has_roles.model_id = users.id', 'left')
				->join('roles', 'roles.id = model_has_roles.role_id', 'left')
				->join('user_metas', 'user_metas.user_id = users.id', 'left')
				->join('project_panelist_options', 'project_panelist_options.panelist_user_id = users.id', 'left')
				->where('roles.id', 6)->get('users');


			$products = $this->db->select('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price, homes_product.thumbnail as images, (case when homes_wishlist.id is not null then true else false end) as is_fav,AVG(homes_product_reviews.rating) rating,round(((homes_product.discount_price/homes_product.original_price)*100),0) as discount_percent')
				->from('homes_product')
				->join('homes_product_images', 'homes_product.id = homes_product_images.product_id', 'left')
				->join('homes_wishlist', 'homes_product.id = homes_wishlist.product_id and homes_wishlist.user_id=' . $user_id, 'left')
				->join('homes_product_reviews', 'homes_product.id = homes_product_reviews.product_id', 'left')
				->where('homes_product.status', 1)
				->where('homes_product.subcategory_id', 5)
				->group_by('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price,homes_wishlist.id')
				->offset(0)
				->limit(100)
				->get();

			$websiteNews = $this->db->select('website_news.*')
				->get('website_news');

			$websiteTrustedpartners = $this->db->select('website_Trusted_partners.*')
				->get('website_Trusted_partners');

			$websiteTestimonials = $this->db->select('website_testimonials.*')
				->get('website_testimonials');


			$this->response([
				'success' => true,
				'message' => 'Fetched Successfully.',
				'response' => [
					'component' => $component,
					'banners' => $banners->result(),
					'cities' => $cities->result(),
					'ourGlimps' => $ourGlimps,
					'services' => $services,
					// 'ourServices' => $services->result(),
					'products' => $products->result(),
					'categories' => $categories->result(),
					'completedProject' => $completedProject->result(),
					'ad_banner' => $midbanners->result(),
					'subcategories' => $subcategories->result(),
					'panelist' => $panelist->result(),
					'websiteNews' => $websiteNews->result(),
					'websiteTrustedpartners' => $websiteTrustedpartners->result(),
					'panelistImages' => $panelistImages,
					'testimonials' => $websiteTestimonials->result()
				]
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}
	public function dashboard_V2()
	{
		try {

			$user_id = $this->input->post('user_id');
			$user_id = (empty($user_id)) ? 0 : $user_id;
			$city_name = $this->input->post('city_name');
			$city_name = (empty($city_name)) ? "SURAT" : $city_name;
			// $cities = $this->db->select('id,cityCountry, UPPER(name)')->where('name', strtoupper($city_name))->get('cities');
			$cities = $this->db->select('id, cityCountry, name')
				->where('LOWER(name)', strtolower($city_name))
				->get('cities');

			// echo $this->db->last_query();
			// die();
			// echo $this->db->last_query();die();
			if ($cities->num_rows() > 0) {

				$city_id = $cities->row()->id;
				$component = $this->db->select('standAloneServices.id,standAloneServices.name ,standAloneServices.icon, standAloneServices.serviceVideoLink ,standAloneServices.description ,standAloneServices.placeholderText ,standAloneServices.noteMesage ,standAloneServices.galary ,
							standAloneServices.category_id as category_id,categories.image_path , categories.info_document_path , categories.brand_description, categories.takenCarePoints,categories.info_document_video_path ,categories.multiplier_enabled ,categories.multiplier_value ,categories.qty')
					->where('standAloneServices.isComponent', 1)
					->join('categories', 'categories.id = standAloneServices.category_id', 'left')
					->get('standAloneServices')->result();

				foreach ($component as &$v) {
					$skus = $this->db->select('skus.*, brandsheets.name AS brandName')
						->where('skus.city_id', $city_id)
						->where('skus.category_id', $v->category_id)
						->join('brandsheets', ' brandsheets.id = skus.brandsheet_id', 'left')
						->group_by('skus.id')
						->get('skus')->result();
					$v->brandsheet = $skus;
				}

				$services = $this->db->select('standAloneServices.id,standAloneServices.name ,standAloneServices.icon, standAloneServices.serviceVideoLink ,standAloneServices.description ,standAloneServices.placeholderText ,standAloneServices.noteMesage ,standAloneServices.galary ,
							standAloneServices.category_id as category_id,categories.image_path , categories.info_document_path , categories.brand_description, categories.takenCarePoints,categories.info_document_video_path ,categories.multiplier_enabled ,categories.multiplier_value ,categories.qty')
					->where('standAloneServices.isComponent', 2)
					->join('categories', 'categories.id = standAloneServices.category_id', 'left')
					->get('standAloneServices')->result();

				foreach ($services as &$v) {
					$skus = $this->db->select('skus.*, brandsheets.name AS brandName')
						->where('skus.city_id', $city_id)
						->where('skus.category_id', $v->category_id)
						->join('brandsheets', ' brandsheets.id = skus.brandsheet_id', 'left')
						->group_by('skus.id')
						->get('skus')->result();
					$v->brandsheet = $skus;
				}

				$banners    = $this->db->select('id, name, image,redirection_url')
					->where('status', 1)
					->where('is_primary', 1)
					->get('homes_banner');

				$cities = $this->db->select('id,cityCountry, name')->get('cities');

				$completedProject = $this->db->select('website_projects.*')
					->get('website_projects');

				$categories = $this->db->select('id, image, name')
					->where('status', 1)
					->get('homes_category');

				$midbanners = $this->db->select('id, name, image,redirection_url')
					->where('status', 1)
					->where('is_primary', 0)
					->get('homes_banner');


				$panelistImages = array('https://onespaceinterior.com/uploads/Component/GANESHMISTRY.gif', 'https://onespaceinterior.com/uploads/Component/KIRTIAGARWAL.gif', 'https://onespaceinterior.com/uploads/Component/SHIVANGIAGARWAL.gif');

				$ourGlimps = array('https://onespaceinterior.com/uploads/Component/video1.gif', 'https://onespaceinterior.com/uploads/Component/video2.gif', 'https://onespaceinterior.com/uploads/Component/video3.gif', 'https://onespaceinterior.com/uploads/Component/video4.gif');

				$subcategories = $this->db->select('id, name, image')
					->where('category_id', 9)
					->where('status', 1)
					->get('homes_subcategory');

				$panelist = $this->db->select('users.id, users.name, rating, projects_completed, accuracy')
					->join('model_has_roles', 'model_has_roles.model_id = users.id', 'left')
					->join('roles', 'roles.id = model_has_roles.role_id', 'left')
					->join('user_metas', 'user_metas.user_id = users.id', 'left')
					->join('project_panelist_options', 'project_panelist_options.panelist_user_id = users.id', 'left')
					->where('roles.id', 6)->get('users');


				$products = $this->db->select('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price, homes_product.thumbnail as images, (case when homes_wishlist.id is not null then true else false end) as is_fav,AVG(homes_product_reviews.rating) rating,round(((homes_product.discount_price/homes_product.original_price)*100),0) as discount_percent')
					->from('homes_product')
					->join('homes_product_images', 'homes_product.id = homes_product_images.product_id', 'left')
					->join('homes_wishlist', 'homes_product.id = homes_wishlist.product_id and homes_wishlist.user_id=' . $user_id, 'left')
					->join('homes_product_reviews', 'homes_product.id = homes_product_reviews.product_id', 'left')
					->where('homes_product.status', 1)
					->where('homes_product.subcategory_id', 5)
					->group_by('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price,homes_wishlist.id')
					->offset(0)
					->limit(100)
					->get();

				$websiteNews = $this->db->select('website_news.*')
					->get('website_news');

				$websiteTrustedpartners = $this->db->select('website_Trusted_partners.*')
					->get('website_Trusted_partners');

				$websiteTestimonials = $this->db->select('website_testimonials.*')
					->get('website_testimonials');


				$this->response([
					'success' => true,
					'message' => 'Fetched Successfully.',
					'response' => [
						'component' => $component,
						'banners' => $banners->result(),
						'cities' => $cities->result(),
						'ourGlimps' => $ourGlimps,
						'services' => $services,
						// 'ourServices' => $services->result(),
						'products' => $products->result(),
						'categories' => $categories->result(),
						'completedProject' => $completedProject->result(),
						'ad_banner' => $midbanners->result(),
						'subcategories' => $subcategories->result(),
						'panelist' => $panelist->result(),
						'websiteNews' => $websiteNews->result(),
						'websiteTrustedpartners' => $websiteTrustedpartners->result(),
						'panelistImages' => $panelistImages,
						'testimonials' => $websiteTestimonials->result()
					]
				]);
			} else {
				$response['success'] = false;
				$response['message'] = 'No City Found.';
				$response['response'] = null;
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function fetch_Interior_Package()
	{
		$interiorID = $this->input->post('interiorID');
		$cityID = $this->input->post('city_id');
		$city_id = (empty($city_id)) ? 2 : $city_id;

		if (empty($cityID)) {
			$response['success'] = false;
			$response['message'] = 'City Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if (empty($interiorID)) {
			$response['success'] = false;
			$response['message'] = 'Parent Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$subcategories = $this->db->select('id, name, city_id, parent_id, headtitle,subtitle, subheadtitle, image_path')
			->where('parent_id', $interiorID)
			->where('city_id', $cityID)
			->get('interior_packes');

		$response = array();
		if ($subcategories->num_rows() > 0) {
			$response['success'] = true;
			$response['message'] = 'Fetched Successfully.';
			$response['response'] = $subcategories->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No City Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function fetch_Element_Budget()
	{
		$interior_Package_id = $this->input->post('interior_Package_id');

		if (empty($interior_Package_id)) {
			$response['success'] = false;
			$response['message'] = 'Interior Package id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$elementData = $this->db->select('interior_Budget.id,interior_Budget.name,interior_Budget.package_Parent_id,interior_Budget.interior_Package_id,interior_Budget.budget')
			->where('interior_Package_id', $interior_Package_id)
			->get('interior_Budget');
		if ($elementData) {
			$response['success'] = true;
			$response['message'] = 'Data Fetched Successfully.';
			$response['response'] =  $elementData->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While selecting Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_CompletedProjects()
	{
		try {
			$completedProject = $this->db->select('website_projects.*,cities.name as cityName')->from('website_projects')
				->join('cities', 'cities.id=website_projects.website_city_id')
				->where('website_projects.title !=', "a")
				->group_by('website_projects.id') //->group_by('website_projects.id')
				->get();
			// ->where('standAloneServices.isComponent', 1)
			// ->join('categories', 'categories.id = standAloneServices.category_id', 'left')
			// ->get('standAloneServices')->result();


			// $user_sku_query = $this->db->select('sku_id')->from('sku_packages')
			// ->join('skus', 'skus.id = sku_packages.sku_id')
			// ->where(['category_id' => $val->id, 'sub_category_id' => $sub_category->id,'package_id' => $package_id])
			// ->get()->num_rows();

			$this->response([
				'success' => true,
				'message' => null,
				'response' => $completedProject->result()
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function subcategories()
	{
		try {

			$category_id = $this->input->get('category_id');

			$subcategories = $this->db->select('id, name, image')
				->where('category_id', $category_id)
				->where('status', 1)
				->get('homes_subcategory');


			$this->response([
				'success' => true,
				'message' => null,
				'response' => $subcategories->result()
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function load_products_by_subcategory()
	{
		try {
			$subcategory_id = $this->input->get('subcategory_id');
			$user_id = $this->input->get('user_id');
			$limit = $this->input->get('limit');
			$offset = $this->input->get('offset');

			$user_id = (empty($user_id)) ? 0 : $user_id;
			$limit = (empty($limit)) ? 10 : $limit;
			$offset = (empty($offset)) ? 0 : $offset;


			$products = $this->db->select('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price, homes_product.thumbnail as images, (case when homes_wishlist.id is not null then true else false end) as is_fav,AVG(homes_product_reviews.rating) rating,round(((homes_product.discount_price/homes_product.original_price)*100),0) as discount_percent')
				->from('homes_product')
				->join('homes_product_images', 'homes_product.id = homes_product_images.product_id', 'left')
				->join('homes_wishlist', 'homes_product.id = homes_wishlist.product_id and homes_wishlist.user_id=' . $user_id, 'left')
				->join('homes_product_reviews', 'homes_product.id = homes_product_reviews.product_id', 'left')
				->where('homes_product.status', 1)
				->where('homes_product.subcategory_id', $subcategory_id)
				->group_by('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price,homes_wishlist.id')
				->offset($offset)
				->limit($limit)
				->get();

			$this->response([
				'success' => true,
				'message' => null,
				'response' => $products->result()
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function product_overview()
	{
		try {
			$product_id = $this->input->get('product_id');
			$user_id = $this->input->get('user_id');
			$user_id = (empty($user_id)) ? 0 : $user_id;

			if ($user_id == 0 || $user_id == null || $user_id == "null") {
				$details    = $this->db->select('homes_product.*,users.name as sold_by,homes_category.name as category,homes_subcategory.name as subcategory,AVG(homes_product_reviews.rating) rating,round(((homes_product.discount_price/homes_product.original_price)*100),0) as discount_percent,users.name as vendor_name')
					->from('homes_product')
					->join('homes_category', 'homes_product.category_id=homes_category.id')
					->join('homes_subcategory', 'homes_product.subcategory_id=homes_subcategory.id')
					->join('users', 'users.id=homes_product.created_by')
					->join('homes_product_reviews', 'homes_product.id = homes_product_reviews.product_id', 'left')
					->where('homes_product.id', $product_id)
					->get()->row();
			} else {
				$details    = $this->db->select('homes_product.*,users.name as sold_by,homes_category.name as category,homes_subcategory.name as subcategory,AVG(homes_product_reviews.rating) rating,round(((homes_product.discount_price/homes_product.original_price)*100),0) as discount_percent,users.name as vendor_name, (case when homes_wishlist.id is not null then true else false end) as is_fav')
					->from('homes_product')
					->join('homes_category', 'homes_product.category_id=homes_category.id')
					->join('homes_subcategory', 'homes_product.subcategory_id=homes_subcategory.id')
					->join('users', 'users.id=homes_product.created_by')
					->join('homes_wishlist', 'homes_product.id = homes_wishlist.product_id and homes_wishlist.user_id=' . $user_id, 'left')
					->join('homes_product_reviews', 'homes_product.id = homes_product_reviews.product_id', 'left')
					->where('homes_product.id', $product_id)
					->get()->row();
			}

			$images 	= $this->db->select('image')
				->where('product_id', $product_id)
				->get('homes_product_images')->result();

			$reviews	= $this->db->select('rating,review')
				->where('product_id', $product_id)
				->get('homes_product_reviews')->result();

			$faqs		= $this->db->select('name,description')
				->where('product_id', $product_id)
				->get('homes_faqs')->result();

			$filters	= $this->db->select('homes_filter_options.id,homes_filter_options.name,json_arrayagg(json_object("value",homes_filter_values.value, "id" ,homes_filter_values.id)) as "values"')
				->from('homes_filters')
				->where('homes_filters.product_id', $product_id)
				->join('homes_filter_options', 'homes_filters.filter_option_id=homes_filter_options.id', 'left')
				->join('homes_filter_values', 'homes_filter_values.id=homes_filters.filter_values_id')
				->where('homes_filter_options.status', 1)
				->group_by('homes_filter_options.name')
				->get()->result();

			$return_policy = 'https://onespace.com';

			$similar   = $this->db->select('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price, homes_product.thumbnail as image')
				->from('homes_product')
				->where('homes_product.id !=', $product_id)
				->where('homes_product.status', 1)
				->where('homes_product.subcategory_id', $details->subcategory_id)
				->group_by('homes_product.id, homes_product.name, homes_product.original_price, homes_product.discount_price')
				->limit(10)
				->get()->result();

			foreach ($similar as &$s) {
				$s->images = json_decode($s->images);
			}

			foreach ($filters as &$f) {
				$f->values = json_decode($f->values);
			}

			$this->response([
				'success' => true,
				'message' => null,
				'response' => [
					'details' => $details,
					'images' => $images,
					'reviews' => $reviews,
					'faqs' => $faqs,
					'return_policy' => $return_policy,
					'similar' => $similar,
					'filters' => $filters,
				]
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}
	public function fetch_address()
	{
		try {

			$user_id = $this->input->get('user_id');

			$address = $this->db->select('homes_user_address.id, homes_user_address.user_id, homes_user_address.address_line1, homes_user_address.address_line2, homes_user_address.locality, homes_user_address.city, homes_user_address.state, homes_user_address.zip_code, homes_user_address.is_primary,users.name as user_name')
				->from('homes_user_address')
				->join('users', 'users.id=homes_user_address.user_id')
				->where('user_id', $user_id)
				->get();

			if ($address->num_rows() > 0) {
				$this->response([
					'success' => true,
					'message' => 'Address Fetched Successfully.',
					'response' => $address->result()
				]);
			} else {
				$this->response([
					'success' => False,
					'message' => 'No Address. Found'
				]);
			}
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}
	public function store_address()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		// $pin_codes = array(
		// 	'395001','394630','394120','394690','395004','394248','394120','394110','394630','395004','394635','394520','394715','395004','394320','394520','394520','395004','394440','394715','394715','394715','394715','394715','394715','394715','395620','394355','395620','394335',
		// 	'394601','394335','394350','394355','394350','394335','394335','394340','394340','394355','394355','395620','394340','394340','394335','395345','394355','394350','394350','394350','394340','394355','394355','394335','394350','394601','395620','394335','394601','394340',
		// 	'394350','394355','395345','394340','394335','394350','394355','395620','394340','394355','394340','394107','395008','394107','394516','394107','394510','394510','394220','394510','394120','395010','394510','394510','394515','395010','394210','394305','394510','394101',
		// 	'394518','394510','395010','394315','395010','394510','394305','394510','394716','394660','394670','394365','394150','394150','394320','394320','394330','394180','394150','394330','394180','394155','394310','394326','394185','394180','394155','394326','394150','394320',
		// 	'394180','394190','394326','394325','394325','394325','394180','394185','394150','394180','394330','394325','394320','394320','394330','394330','394325','394326','394150','394320','394235','394235','394235','394125','394125','394125','394125','394125','394250','396510',
		// 	'394240','394246','394248','394250','394248','394250','394250','394240','396510','394245','394240','394248','394246','394350','394248','394340','394240','394245','394250','396510','396510','396510','394250','394248','394250','394250','394240','395620','394248','394350',
		// 	'394248','394250','394246','394350','394248','394246','394248','394248','394240','394245','394245','394180','394163','394340','394140','394160','394160','394163','394140','394160','394163','394160','394163','394160','394160','394160','394360','394335','394163','394163',
		// 	'394335','394163','394163','394160','394335','394160','394160','394160','394651','394140','394163','394163','394163','394163','394360','394160','394170','394160','394160','394160','394160','394170','394160','394163','394163','394140','394160','394155','394410','394410',
		// 	'394410','394380','394380','394370','394370','394380','394380','394380','394370','394380','394380','394370','394380','394370','394380','394380','394370','394370','394380','394380','394370','394380','394370','394370','394380','394370','394370','394370','394370','394370',
		// 	'394110','394110','394110','394110','394540','394540','394530','394540','394421','394110','394540','394530','394110','394110','394540','394110','394421','394540','394540','394540','394530','394110','394111','394110','394540','394120','394120','394110','394540','394110',
		// 	'394120','394540','394110','394540','394540','394540','394530','394421','394110','394110','394110','394110','394540','394540','394540','394110','394540','394120','394421','394110','394540','394540','394540','394540','394110','394110','394421','394110','394540','394110',
		// 	'394350','394352','394325','394305','394317','394310','394305','394310','394310','394310','394315','394305','394327','394315','394305','394352','394315','394325','394315','394352','394310','394315','394305','394310','394317','394310','394230','394230','394230','394230',
		// 	'394230','394230','394230','394230','394230','394230','394230','394130','394130','394130','394130','394130','394130','394130','394130','394130','394130','394130','394130','394130','394651','394365','394680','394670','394650','394650','394670','394650','394365','394650',
		// 	'394360','394670','394365','394365','394365','394365','394365','394365','394650','394670','394680','394716','394650','394365','394670','394650','394360','394670','394365','394365','394670','394651','394365','394670','394680','394670','394651','394680','395008','395007',
		// 	'395009','395003','395017','395005','395005','395007','395005','395003','395003','395005','395007','395003','395005','395023','395010','395005','394220','395007','395001','395001','394270','395003','395003','395004','395007','395002','395008','394235','395008','395007',
		// 	'395003','395003','395001','395005','395009','395003','395009','394221','395008','395005','395005','395005','395002','394230','395002','395008','395003','395005','395005','395003','395003','395003','395002','395007','395007','395008','395006','395008','395003','395004',
		// 	'395007','394375','394375','394375','394375','394375','394375','394375','394375','394375','394375','394375','394670','394375','394375','394375','394375','394670','394375','394375','394210','394210','394210','394210','394210','394210','394210','394210','394210','394210',
		// 	'394445','394445','394445','394445','394445','394445','394445','394445','394445','394445','394105','394105','394105','394246','394641','394630','394635','394690','394340','394640','394630','394630','395620','394340','394641','394630','394640','394246','394690','394340',
		// 	'394640','394640','394640','395620','394340','394640','394641','394430','394430','394430','394430','394430','394430','394430','394430','394430','394520','394405','394405','394405','394405','394405','394405','394405','394405','394405','394633','394651','394630','394655',
		// 	'394635','394360','394650','394690','394690','394650','394655','394650','394650','394650','394635','394690','394633','394655','394655','394635','394633','394630','394651','394633','394630','394635','394655','394650','394655','394635','394655','394633','394650','394630',
		// 	'394641','394651','394655','394650','394655','394655','394651','394690','394633','394655','394655','394635','394633','394635','394650','394635','394635','394630','394635','394655','394690','394655','394630','394630','394635','394651','394651','394630','394651','394650',
		// 	'394650','394650','394655','394440','394440','394440','394440','394440','394440','394440','394440','394440','394440','394440','394440','394440','394440','394440','394440','394440','394440','394440'
		//  );
		if ($request->user_id == '') {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		// if (in_array($request->zip_code,$pin_codes)) {

		// } else {
		// 	$response['success'] = false;
		// 	$response['message'] = 'Outside surat delivery not available';
		// 	header('Content-Type: application/json; charset=utf-8');
		// 	echo json_encode($response);exit();
		// }


		if ($request->is_primary == true || $request->is_primary == 1) {
			$this->db->where('user_id', $request->user_id)
				->update('homes_user_address', ['is_primary' => 0]);
		}

		$q = $this->db->insert('homes_user_address', array('user_id' => $request->user_id, 'address_line1' => $request->address_line1, 'address_line2' => $request->address_line2, 'locality' => $request->locality, 'city' => $request->city, 'state' => $request->state, 'zip_code' => $request->zip_code, 'is_primary' => $request->is_primary, 'created_at' => date('Y-m-d H:i:s')));
		if ($q) {
			$response['success'] = true;
			$response['message'] = 'stored Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'No User Id Found.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function update_address()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		if ($request->address_id == '') {
			$response['success'] = false;
			$response['message'] = 'Address Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		if ($request->is_primary == true || $request->is_primary == 1) {
			$user_query = $this->db->select('user_id')->where('id', $request->address_id)->get('homes_user_address')->row();
			$this->db->where('user_id', $user_query->user_id)
				->update('homes_user_address', ['is_primary' => 0]);
		}

		$q = $this->db->where('id', $request->address_id)->update('homes_user_address', array('address_line1' => $request->address_line1, 'address_line2' => $request->address_line2, 'locality' => $request->locality, 'city' => $request->city, 'state' => $request->state, 'zip_code' => $request->zip_code, 'is_primary' => $request->is_primary, 'updated_at' => date('Y-m-d H:i:s')));
		if ($q) {
			$response['success'] = true;
			$response['message'] = 'Address Updated Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While updating Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function delete_address()
	{

		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		if (empty($request->address_id)) {
			$response['success'] = false;
			$response['message'] = 'Address Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->where(['id' => $request->address_id])->delete('homes_user_address');
		if ($q) {
			$response['success'] = true;
			$response['message'] = 'Address deleted Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While deleting Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function delete_user()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		if (empty($request->user_id)) {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->where(['id' => $request->user_id])->delete('users');
		if ($q) {
			$response['success'] = true;
			$response['message'] = 'user deleted Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While deleting user.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}
	public function add_wishlist()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		if ($request->user_id == '') {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->product_id == '') {
			$response['success'] = false;
			$response['message'] = 'Product Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->isForAdd == '') {
			$response['success'] = false;
			$response['message'] = 'isForAdd is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->isForAdd == "1") {
			$q = $this->db->insert('homes_wishlist', array('user_id' => $request->user_id, 'product_id' => $request->product_id, 'created_at' => date('Y-m-d H:i:s')));
			if ($q) {
				$qval = $this->db->select('id AS customer_id, first_name AS firstname, last_name AS lastname, email, phone AS telephone,REPLACE(country_code, "+", "") AS countrycode')->where(array('id' => $request->user_id))->get('users');
				if ($qval->num_rows() > 0) {
					$firstname = $qval->row()->firstname;
					$email = $qval->row()->email;
					$telephone = $qval->row()->telephone;
					$countrycode = '91'; //$qval->row()->countrycode;
					$this->sendWhatsappMessage($firstname, '' . $countrycode . '' . $telephone . '', 'product_added_to_wishlist_');
				}
				$response['success'] = true;
				$response['message'] = 'Wishlist added Successfully.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			} else {
				$response['success'] = false;
				$response['message'] = 'Unable to add wishlist.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} else {
			$q = $this->db->where('user_id', $request->user_id);
			$this->db->where('product_id', $request->product_id);
			$this->db->delete('homes_wishlist');
			if ($q) {
				$response['success'] = true;
				$response['message'] = 'Wishlist Deleted Successfully.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			} else {
				$response['success'] = false;
				$response['message'] = 'Unable to Delete wishlist.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		}
	}

	public function add_to_cart()
	{
		try {

			$post_data = file_get_contents("php://input");
			$request = json_decode($post_data);
			$product_id 		= $request->product_id;
			$qty 				= $request->qty;
			$user_id 			= $request->user_id;
			$filter 			= $request->filter;

			if (empty($product_id)) throw new Exception('Product id is required');
			if (empty($qty)) throw new Exception('Quantity is required');
			if (empty($user_id)) throw new Exception('User Id is required');
			// if(empty($filter)) throw new Exception('Filter is required');
			$inventory = $this->getInventoryCount($product_id);
			if ($inventory >= $qty) {
				$q = $this->db->select('quantity')->where(['user_id' => $user_id, 'product_id' => $product_id, 'filter' => $filter, 'order_placed' => 0])->get('homes_cart');
				if ($q->num_rows() > 0) {
					$this->db->where(['product_id' => $product_id, 'user_id' => $user_id, 'filter' => $filter])->update('homes_cart', array('quantity' => ($qty + $q->row()->quantity), 'updated_at' => date('Y-m-d H:i:s')));
					// $this->db->update('homes_cart',array('product_id' => $product_id, 'quantity' => ($qty + $q->row()->quantity), 'user_id' => $user_id, 'filter' => $filter, 'updated_at' => date('Y-m-d H:i:s')));
				} else {
					$this->db->insert('homes_cart', array('product_id' => $product_id, 'quantity' => $qty, 'user_id' => $user_id, 'filter' => $filter, 'created_at' => date('Y-m-d H:i:s')));
					$qval = $this->db->select('id AS customer_id, first_name AS firstname, last_name AS lastname, email, phone AS telephone,REPLACE(country_code, "+", "") AS countrycode')->where(array('id' => $request->user_id))->get('users');
					if ($qval->num_rows() > 0) {
						$firstname = $qval->row()->firstname;
						$email = $qval->row()->email;
						$telephone = $qval->row()->telephone;
						$countrycode = $qval->row()->countrycode;
						$finalNumber =  (string) $countrycode + $telephone;
						// $this->sendWhatsappMessage($firstname,''.$countrycode.''.$telephone.'','product_added_to_cart_but_not_purchased_');
					}
				}
			} else {
				$response['success'] = false;
				if ($inventory == 0) {
					$response['message'] = 'Product Sold Out';
				} else {
					$response['message'] = 'Product available qty is ' . $inventory;
				}
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
			$this->response([
				'success' => true,
				'message' => 'Product is added to the cart successfully.',
				'response' => null
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function remove_from_cart()
	{
		try {
			$cart_id	= $this->input->get('cart_id');
			if (empty($cart_id)) throw new Exception('Cart id is required');

			$this->db->where('id', $cart_id);
			$this->db->delete('homes_cart');
			$this->response([
				'success' => true,
				'message' => 'Product is removed from the cart successfully.',
				'response' => null
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function update_cart()
	{
		try {
			$data = json_decode(file_get_contents('php://input'));

			$cart_id 		= $data->cart_id;
			$qty 			= $data->qty;

			if (empty($cart_id)) throw new Exception('cart id is required');
			if (empty($qty)) throw new Exception('Quantity is required');

			$this->db->where('id', $cart_id)
				->update('homes_cart', array('quantity' => $qty, 'updated_at' => date('Y-m-d H:i:s')));
			$this->response([
				'success' => true,
				'message' => 'Cart updated successfully.',
				'response' => null
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function view_cart()
	{
		try {
			$user_id = $this->input->get('user_id');
			if (empty($user_id)) throw new Exception('User Id is required');

			$products = $this->db->select('homes_cart.id ,users.name as sold_by,homes_cart.product_id,homes_cart.quantity,homes_product.name,homes_product.original_price,homes_product.discount_price,homes_product.thumbnail as image, (homes_cart.quantity * homes_product.discount_price) as total_price,round(((homes_product.discount_price/homes_product.original_price)*100),0) as discount_percent,users.name as vendor_name')
				->from('homes_cart')
				->join('homes_product', 'homes_cart.product_id=homes_product.id')
				->join('users', 'users.id=homes_product.created_by', 'left')
				->where('homes_cart.user_id', $user_id)->where('homes_cart.order_placed !=', 1)
				->get()->result();
			$total_price = array_sum(array_column($products, 'total_price'));

			$tax = 18;
			$shipping_charges = 0;
			$additional_charges = 0;
			$total_tax_amount = (int) (($total_price) * $tax) / 100;
			$final_price = (int) $total_price  + $total_tax_amount + $shipping_charges + $additional_charges;

			$this->response([
				'success' => true,
				'message' => null,
				'response' => [
					'products' => $products,
					'total_price' => $total_price,
					'gst' => $total_tax_amount,
					'delivery_charge' => $shipping_charges
				]
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function place_order()
	{
		try {
			$data = json_decode(file_get_contents('php://input'));
			$user_id = $data->user_id;
			$address_id = $data->address_id;
			$pg_orderid = $data->pg_orderid;
			$pg_paymentid = $data->pg_paymentid;
			$cart_id = $data->cart_id;
			$payment_mode = $data->payment_mode;
			$order_notes = $data->order_notes;
			$products = $data->products;
			$product_ids = array_map(function ($element) {
				return $element->id;
			}, $products);
			$coupon_id = '';
			$total_amount = 0;
			$total_tax_amount = 0;
			$discount_amount = 0;
			$shipping_charges = 0;
			$additional_charges = 0;
			$final_price = 0;
			$tax = 18;
			$price_inclusive_discount = 0;
			$discount_price = 0;
			$product_id = $products[0]->id;
			$qty = $products[0]->qty;

			$product_details = $this->db->select('id,original_price,discount_price')
				->where('id', $data->products[0]->id)
				->get('homes_product')->result();


			$cartvalue = $this->db->select('id,quantity')
				->where('id', $cart_id)
				->get('homes_cart')->result();

			$discount_amount = (int) $product_details[0]->discount_price;
			$quantity = (int) $cartvalue[0]->quantity;
			// $discount_amount = $product_details[0]->discount_price * $cartvalue->[0]>quantity;
			$total_tax_amount = ((($discount_amount * $quantity)) * $tax) / 100;
			// $product->final_price = $product->discount_price;

			$total_amount = (int) ($discount_amount * $quantity);
			$final_price = (int) ($discount_amount * $quantity)  + $total_tax_amount + $shipping_charges + $additional_charges;

			// $this->db->trans_start();
			// $coupon = $this->db->select('id')
			// ->where('code', $data->coupon_code)
			// ->where('coupon_type', 1)
			// ->where('status', 1)
			// ->get('homes_coupon');
			// if($coupon->num_rows() > 0) 
			// {
			// 	$coupon_id = $coupon->result()->id;
			// }

			$inventory = $this->getInventoryCount($product_id);
			if ($inventory >= $qty) {

				$orderQuery = $this->db->insert('homes_order', [
					'user_id' => $user_id,
					'address_id' => $address_id,
					'cart_id' => $cart_id,
					'pg_orderid' => $pg_orderid,
					'pg_paymentid' => $pg_paymentid,
					'order_status' => 'Pending',
					'order_mode' => 'online',
					'payment_mode' => $payment_mode,
					'payment_status' => 'success',
					// 'coupon_id' => $coupon_id,
					'total_amount' => $total_amount,
					'total_tax_amount' => $total_tax_amount,
					'discount_amount' => $discount_amount,
					'shipping_charges' => $shipping_charges,
					'additional_charges' => $additional_charges,
					'final_price' => $final_price,
					'order_notes' => $order_notes,
					'reciept_path' => '',
					'created_at' => date('Y-m-d H:i:s')
				]);

				$order_id = $this->db->insert_id();

				// $orderProductQuery = $this->db->insert_batch('homes_order_products', array_map(function($element) use($order_id) {
				// 						return ['order_id' => $order_id,
				// 								'product_id' =>$element->id,		
				// 								'quantity' =>$element->qty,		
				// 								'final_price' =>$element->final_price,
				// 								'created_at' => date('Y-m-d H:i:s')		
				// 						];
				// 					}, $products));
				$orderQuery = $this->db->insert('homes_order_products', [
					'order_id' => $order_id,
					'product_id' => $data->products[0]->id,
					'quantity' => $quantity,
					'final_price' => $final_price,
					'created_at' => date('Y-m-d H:i:s')
				]);

				$this->db->where(['id' => $cart_id])->update('homes_cart', array('order_placed' => 1, 'updated_at' => date('Y-m-d H:i:s')));
				$qval = $this->db->select('id AS customer_id, first_name AS firstname, last_name AS lastname, email, phone AS telephone,REPLACE(country_code, "+", "") AS countrycode')->where(array('id' => $request->user_id))->get('users');
				if ($qval->num_rows() > 0) {
					$firstname = $qval->row()->firstname;
					$email = $qval->row()->email;
					$telephone = $qval->row()->telephone;
					$countrycode = '91'; //$qval->row()->countrycode;
					$finalNumber =  (string) $countrycode + $telephone;
					$this->sendWhatsappMessage($firstname, '' . $countrycode . '' . $telephone . '', 'product_purchased_');
				}
				$this->db->trans_complete();

				$this->response([
					'success' => true,
					'message' => 'Order placed successfully.',
					'response' => null
				]);
			} else {
				$response['success'] = false;
				// $response['message'] = 'Product available qty is '.$inventory;
				if ($inventory == 0) {
					$response['message'] = 'Product Sold Out';
				} else {
					$response['message'] = 'Product available qty is ' . $inventory;
				}
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} catch (Exception $e) {
			$this->db->trans_rollback();
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function order_details()
	{
		try {
			$order_id = $this->input->get('order_id');
			if (empty($order_id)) throw new Exception('order_id field is missing');
			$query = $this->db->select('homes_order.id,homes_order.order_status,homes_order.total_amount,homes_order.total_tax_amount,homes_order.discount_amount,homes_order.shipping_charges,homes_order.additional_charges,homes_order.final_price,homes_order.order_notes,homes_order.created_at,concat(homes_user_address.address_line1,", ",homes_user_address.address_line2,", ",homes_user_address.locality,", ",homes_user_address.city,", ",homes_user_address.state,", ",homes_user_address.zip_code) as address, json_arrayagg(json_object("product_id",homes_product.id,"product_name",homes_product.name,"category",homes_category.name,"qty",homes_order_products.quantity,"image",homes_product.thumbnail)) as products')
				->from('homes_order')
				->join('homes_order_products', 'homes_order.id=homes_order_products.order_id')
				->join('homes_user_address', 'homes_user_address.user_id=homes_order.user_id')
				->join('homes_product', 'homes_order_products.product_id=homes_product.id')
				->join('homes_category', 'homes_category.id=homes_product.category_id')
				->where('homes_order.id', $order_id)
				// ->group_by('homes_order.id,homes_order.order_status,homes_order.total_amount,homes_order.total_tax_amount,homes_order.discount_amount,homes_order.shipping_charges,homes_order.additional_charges,homes_order.final_price,homes_order.order_notes,homes_order.created_at,homes_user_address.address_line1,homes_user_address.address_line2,homes_user_address.locality,homes_user_address.city,homes_user_address.state,homes_user_address.zip_code')
				->get()->row();

			$query->products = json_decode($query->products);

			$this->response([
				'success' => true,
				'message' => 'Data Fetch succussfully',
				'response' => $query
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function order_history()
	{
		try {
			$user_id = $this->input->get('user_id');
			if (empty($user_id)) throw new Exception('user_id field is missing');
			$query = $this->db->select('homes_order.id,homes_order.order_status,homes_order.total_amount,homes_order.total_tax_amount,homes_order.discount_amount,homes_order.shipping_charges,homes_order.additional_charges,homes_order.final_price,homes_order.order_notes,homes_order.created_at,concat(homes_user_address.address_line1,", ",homes_user_address.address_line2,", ",homes_user_address.locality,", ",homes_user_address.city,", ",homes_user_address.state,", ",homes_user_address.zip_code) as address, json_arrayagg(json_object("product_name",homes_product.name,"vendor_name",users.name,"category",homes_category.name,"qty",homes_order_products.quantity,"image",homes_product.thumbnail)) as products')
				->from('homes_order')
				->join('homes_order_products', 'homes_order.id=homes_order_products.order_id')
				->join('homes_user_address', 'homes_user_address.user_id=homes_order.user_id')
				->join('homes_product', 'homes_order_products.product_id=homes_product.id')
				->join('homes_category', 'homes_category.id=homes_product.category_id')
				->join('users', 'users.id=homes_product.created_by')
				->where('homes_order.user_id', $user_id)
				->group_by('homes_order.id')
				->order_by('homes_order.id', 'desc')
				->get()->result();

			foreach ($query as &$q) {
				$q->products = json_decode($q->products);
			}

			$this->response([
				'success' => true,
				'response' => $query,
				'message' => 'order history fetch Successfully'
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function wishlist()
	{
		try {
			$user_id = $this->input->get('user_id');
			if (empty($user_id)) throw new Exception('user_id field is missing');
			$query = $this->db->select('homes_product.id,users.name as sold_by, homes_product.name, homes_product.original_price, homes_product.discount_price, homes_product.thumbnail as images,round(((homes_product.discount_price/homes_product.original_price)*100),0) as discount_percent,users.name as vendor_name,AVG(homes_product_reviews.rating) rating')
				->from('homes_wishlist')
				->join('homes_product', 'homes_wishlist.product_id=homes_product.id')
				->join('homes_product_images', 'homes_product.id = homes_product_images.product_id', 'left')
				->join('homes_product_reviews', 'homes_product.id = homes_product_reviews.product_id', 'left')
				->join('users', 'users.id=homes_product.created_by', 'left')
				->where('homes_wishlist.user_id', $user_id)
				->group_by('homes_wishlist.id')
				->get()->result();

			$this->response([
				'success' => true,
				'message' => 'Wishlist Successfully.',
				'response' => $query
			]);
		} catch (Exception $e) {
			$this->response([
				'success' => false,
				'message' => $e->getMessage(),
				'response' => null
			]);
		}
	}

	public function claim_Coupon()
	{

		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		if ($request->coupon_code == '') {
			$response['success'] = false;
			$response['message'] = 'coupon code is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->user_id == '') {
			$response['success'] = false;
			$response['message'] = 'user id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$coupon = $this->db->select('id,name')
			->where('code', $request->coupon_code)
			->where('coupon_type', 0)
			->where('status', 1)
			->get('homes_coupon');
		if ($coupon->num_rows() > 0) {
			$id = (int) $coupon->row()->id;
			$response = array();
			if ($id > 0) {
				$q = $this->db->insert('homes_coupons_claimed', array('user_id' => $request->user_id, 'coupon_id' => $id, 'created_at' => date('Y-m-d H:i:s')));
				if ($q) {
					$response['success'] = true;
					$response['message'] = 'Coupon added Successfully.';
					// $response['response'] = null;
					header('Content-Type: application/json; charset=utf-8');
					echo json_encode($response);
					exit();
				}
			} else {
				$response['success'] = false;
				$response['message'] = 'Invalid Coupon Code.';
				header('Content-Type: application/json; charset=utf-8');
				echo json_encode($response);
				exit();
			}
		} else {
			$response['success'] = false;
			$response['message'] = 'Invalid Coupon Code.';
			$response['response'] = $coupon->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function apply_coupon()
	{

		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		if ($request->coupon_code == '') {
			$response['success'] = false;
			$response['message'] = 'coupon code is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$coupon = $this->db->select('name, code as coupon_code, description, coupon_type, discount_type, discount_value, status as coupon_status')
			->where('code', $request->coupon_code)
			->where('coupon_type', 0)
			->where('status', 1)
			->get('homes_coupon');
		$response = array();
		if ($coupon->num_rows() > 0) {
			$response['success'] = true;
			$response['message'] = 'Coupon Applied Successfully.';
			$response['response'] = $coupon->result();
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Invalid Coupon Code.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function store_review()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		if ($request->product_id == '') {
			$response['success'] = false;
			$response['message'] = 'Product Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->user_id == '') {
			$response['success'] = false;
			$response['message'] = 'User Id is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$q = $this->db->insert('homes_product_reviews', array('user_id' => $request->user_id, 'product_id' => $request->product_id, 'rating' => $request->rating, 'review' => $request->review, 'created_at' => date('Y-m-d H:i:s')));
		if ($q) {
			$response['success'] = true;
			$response['message'] = 'Product review added Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'unable to add product review';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function fetch_Studio_Detail()
	{
		$details = $this->db->select('id, image_url, name, link')->get('studio_banner')->result();
		$basic = $this->db->select('json as basicDetail')->get('studio_basic')->result();
		$response = array();
		// if($q->num_rows() > 0) {

		// $response['success'] = true;
		// $response['message'] = 'Fetched Successfully.';
		// $response['response'] = $q->result();
		// header('Content-Type: application/json; charset=utf-8');
		// echo json_encode($response);exit();

		$this->response([
			'success' => true,
			'message' => 'Fetched Successfully.',
			'response' => [
				'details' => $details,
				'basic' => $basic,
			]
		]);
		// } else {
		// 	$response['success'] = false;
		// 	$response['message'] = 'No banner Found.';
		// 	header('Content-Type: application/json; charset=utf-8');
		// 	echo json_encode($response);exit();
		// }
	}

	public function store_French_Detail()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		if ($request->name == '') {
			$response['success'] = false;
			$response['message'] = 'name is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->mobile_number == '') {
			$response['success'] = false;
			$response['message'] = 'mobile number is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->email == '') {
			$response['success'] = false;
			$response['message'] = 'mobile number is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->occupation == '') {
			$response['success'] = false;
			$response['message'] = 'mobile number is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$q = $this->db->insert('studio_french_form', array('name' => $request->name, 'mobile_number' => $request->mobile_number, 'email' => $request->email, 'occupation' => $request->occupation));
		if ($q) {
			$countrycode = '91';

			// $this->sendWhatsappMessage($request->name, '' . $countrycode . '' . $request->phone . '', 'thankyou_response_flows');
			$this->createSmartTask("Enquire $request->name",  $request->email, $request->mobile_number);
			$this->sendWhatsappMessage($request->name, '' . $countrycode . '' . $request->mobile_number . '', 'thankyou_response_flows');
			$response['success'] = true;
			$response['message'] = 'French Detail added Successfully.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'unable to add French Detail';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	public function store_formDetails_Detail()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		if ($request->name == '') {
			$response['success'] = false;
			$response['message'] = 'name is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$q = $this->db->insert('formDetails', array('name' => $request->name, 'phone' => $request->phone, 'email' => $request->email, 'page' => ($request->screen == '' || $request->screen == null) ? 'Calculator' : $request->screen, 'creatAt' => date('Y-m-d H:i:s')));
		if ($q) {
			$countrycode = '91';
			$this->sendWhatsappMessage($request->name, '' . $countrycode . '' . $request->phone . '', 'thankyou_response_flows');
			$this->createSmartTask("Enquire $request->name", $request->email, $request->phone);
		} else {
			$response['success'] = false;
			$response['message'] = 'unable to add French Detail';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	function createSmartTask($name, $email, $phoneNumber)
	{
		$q = $this->db->select('code, accesstoken,refreshtoken')->get('authenticationToken');

		$refreshToken = $q->row()->refreshtoken;
		$clientId     = '0804bf05-9626-4f23-9fbf-aac4b35b9d97';
		$clientSecret = 'YSw8Q~PFq0Vdad-vLNI3QyFbJu2g9Ymh-KN__dqp';
		$redirectUri  = 'https://onespaceinterior.com/api/auth';
		$scope        = 'openid offline_access https://smarttaskauth.onmicrosoft.com/api/read https://smarttaskauth.onmicrosoft.com/api/write';

		$tokenUrl = 'https://identity.smarttask.io/99abc933-fcdd-4dba-893c-b2b9f81c0676/B2C_1A_SIGNUP_SIGNIN/oauth2/v2.0/token';

		$tokenData = [
			'grant_type'    => 'refresh_token',
			'client_id'     => $clientId,
			'client_secret' => $clientSecret,
			'redirect_uri'  => $redirectUri,
			'scope'         => $scope,
			'refresh_token' => $refreshToken
		];

		$ch = curl_init();
		curl_setopt_array($ch, [
			CURLOPT_URL => $tokenUrl,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_POST => true,
			CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
			CURLOPT_POSTFIELDS => http_build_query($tokenData)
		]);

		$tokenResponse = curl_exec($ch);
		if (curl_errno($ch)) {
			die('Token Request Error: ' . curl_error($ch));
		}
		curl_close($ch);

		$tokenJson = json_decode($tokenResponse, true);
		if (!isset($tokenJson['access_token'])) {
			die("Failed to get access token: " . $tokenResponse);
		}

		$accessToken = $tokenJson['access_token'];
		$refreshToken = $tokenJson['refresh_token'];

		// -------------------------
		// STEP 2: Call SmartTask API with New Access Token
		// -------------------------
		$apiUrl = 'https://ext-v2.smarttask.io/v1.0/task/create-task/635';
		$date = gmdate('Y-m-d\TH:i:s\Z');
		$description = "$name, $phoneNumber, $email,";

		$taskData = [
			"name" => "$phoneNumber",
			"description" => "$name, $phoneNumber,$email,",
			"assigned_user" => [
				"email_confirmed" => true,
				"role" => "core",
				"user_id" => str_contains(strtolower($description), 'Complaint') ? 7428 :  2189,
				"full_name" => str_contains(strtolower($description), 'Complaint') ? "Yash" : "BHUSHAN",
				"email" => str_contains(strtolower($description), 'Complaint') ? "yashkhatrii2000@gmail.com" : "sapkalebhushan66@gmail.com",
			],
			"date_info" => [
				"start_date" => $date,
				"due_date" => $date,
				"duration" => 1,
				"recurr_type" => "never_repeat",
				"recurr_on" => "on_completion",
				"recurr_interval" => 1,
				"recurr_weekdays" => [],
				"recurr_day_of_month" => 1,
				"recurr_on_start_date" => null,
				"recurring_record_created" => false
			],
		];
		$this->db->where('code', $q->row()->code)->update('authenticationToken', array('accesstoken' => $accessToken, 'refreshtoken' => $refreshToken));
		$ch = curl_init();
		curl_setopt_array($ch, [
			CURLOPT_URL => $apiUrl,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_POST => true,
			CURLOPT_HTTPHEADER => [
				'Authorization: Bearer ' . $accessToken,
				'Content-Type: application/json'
			],
			CURLOPT_POSTFIELDS => json_encode($taskData)
		]);

		$apiResponse = curl_exec($ch);
		if (curl_errno($ch)) {
			die('API Request Error: ' . curl_error($ch));
		}
		curl_close($ch);

		$response['success'] = true;
		$response['message'] = 'French Detail added Successfully.';
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
	}
	function onescreenSmartTask()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);


		if ($request->name == '') {
			$response['success'] = false;
			$response['message'] = 'name is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		if ($request->description == '') {
			$response['success'] = false;
			$response['message'] = 'name is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}

		$q = $this->db->select('code, accesstoken,refreshtoken')->get('authenticationToken');

		$refreshToken = $q->row()->refreshtoken;
		$clientId     = '0804bf05-9626-4f23-9fbf-aac4b35b9d97';
		$clientSecret = 'YSw8Q~PFq0Vdad-vLNI3QyFbJu2g9Ymh-KN__dqp';
		$redirectUri  = 'https://onespaceinterior.com/api/auth';
		$scope        = 'openid offline_access https://smarttaskauth.onmicrosoft.com/api/read https://smarttaskauth.onmicrosoft.com/api/write';

		$tokenUrl = 'https://identity.smarttask.io/99abc933-fcdd-4dba-893c-b2b9f81c0676/B2C_1A_SIGNUP_SIGNIN/oauth2/v2.0/token';

		$tokenData = [
			'grant_type'    => 'refresh_token',
			'client_id'     => $clientId,
			'client_secret' => $clientSecret,
			'redirect_uri'  => $redirectUri,
			'scope'         => $scope,
			'refresh_token' => $refreshToken
		];

		$ch = curl_init();
		curl_setopt_array($ch, [
			CURLOPT_URL => $tokenUrl,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_POST => true,
			CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
			CURLOPT_POSTFIELDS => http_build_query($tokenData)
		]);

		$tokenResponse = curl_exec($ch);
		if (curl_errno($ch)) {
			die('Token Request Error: ' . curl_error($ch));
		}
		curl_close($ch);

		$tokenJson = json_decode($tokenResponse, true);
		if (!isset($tokenJson['access_token'])) {
			die("Failed to get access token: " . $tokenResponse);
		}

		$accessToken = $tokenJson['access_token'];
		$refreshToken = $tokenJson['refresh_token'];

		// -------------------------
		// STEP 2: Call SmartTask API with New Access Token
		// -------------------------
		$apiUrl = 'https://ext-v2.smarttask.io/v1.0/task/create-task/635';
		$date = gmdate('Y-m-d\TH:i:s\Z');
		$name = $request->name;
		$description = $request->description;
		$namevalue = "$name";

		$taskData = [
			"name" => "$namevalue",
			"description" => "$description",
			"assigned_user" => [
				"email_confirmed" => true,
				"role" => "core",
				"user_id" => 9204,
				"first_name" => "Getos",
				"full_name" => "getos@onespaceinterior.com",
				"email" => "getos@onespaceinterior.com",
			],
			"date_info" => [
				"start_date" => $date,
				"due_date" => $date,
				"duration" => 1,
				"recurr_type" => "never_repeat",
				"recurr_on" => "on_completion",
				"recurr_interval" => 1,
				"recurr_weekdays" => [],
				"recurr_day_of_month" => 1,
				"recurr_on_start_date" => null,
				"recurring_record_created" => false
			],
		];
		$this->db->where('code', $q->row()->code)->update('authenticationToken', array('accesstoken' => $accessToken, 'refreshtoken' => $refreshToken));
		$ch = curl_init();
		curl_setopt_array($ch, [
			CURLOPT_URL => $apiUrl,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_POST => true,
			CURLOPT_HTTPHEADER => [
				'Authorization: Bearer ' . $accessToken,
				'Content-Type: application/json'
			],
			CURLOPT_POSTFIELDS => json_encode($taskData)
		]);

		$apiResponse = curl_exec($ch);
		if (curl_errno($ch)) {
			die('API Request Error: ' . curl_error($ch));
		}
		curl_close($ch);

		$response['success'] = true;
		$response['message'] = 'Smarttask Detail added Successfully.';
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
	}

	function createSmartTaskThroughGalabox()
	{
		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);


		if ($request->name == '') {
			$response['success'] = false;
			$response['message'] = 'name is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$this->createSmartTask("Enquire $request->name", $request->addName, $request->phoneNumber);
	}


	public function authviral()
	{
		if (!isset($_GET['code'])) {
			$q = $this->db->insert('formDetails', array('name' => $_GET['code'], 'phone' => "Authorization code not found", 'email' => "Authorization code not found", 'page' => "Authorization code not found", 'creatAt' => date('Y-m-d H:i:s')));
			if ($q) {
				echo "Authorization code not found";
			}
		} else {
			$q = $this->db->insert('formDetails', array('name' => $_GET['code'], 'phone' => "Authorization code not found", 'email' => "Authorization code not found", 'page' => "Authorization code not found", 'creatAt' => date('Y-m-d H:i:s')));
			echo $_GET['code'];
		}
	}

	private function response($response)
	{
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
		exit();
	}

	private function sendEmail($to, $subject, $message)
	{
		$from = 'no.reply@onespaceinterior.com';
		$fromName = 'OneSpace';
		$config = array();
		$config['protocol'] = 'smtp';
		$config['smtp_host'] = 'ssl://smtppro.zoho.in';
		$config['smtp_user'] = 'no.reply@onespaceinterior.com';
		$config['smtp_pass'] = 'NoReply@1234';
		$config['smtp_port'] = 465;
		$config['mailtype']  = 'html';
		$config['newline'] = "\r\n";
		$this->load->library('email');
		$this->email->initialize($config);
		$this->email->from($from, $fromName);
		$this->email->to($to);
		$this->email->subject($subject);
		$this->email->message($message);
		$this->email->set_newline("\r\n");
		if ($this->email->send()) {
			return;
		}
	}

	private function getInventoryCount($product_id)
	{

		$product = $this->db->select('id,inventory,sold_by')
			->where('id', $product_id)
			->get('homes_product')->result();

		$soldby = (int) $product[0]->sold_by;
		if ($soldby != 0 || $soldby != null) {
			$franchise = $this->db->select('inventory')->where(['product_id' => $product_id, 'franchise_id' => $soldby])->get('homes_franchise_has_product')->result();
			return $franchise[0]->inventory;
		} else {
			return $product[0]->inventory;
		}
	}

	private function calculateCarpetArea($price, $multiplier_value, $carpet_area)
	{
		return ($price * $multiplier_value * $carpet_area) . "";
	}

	public function sendWhatsappMessageMobileApp()
	{
		$user_id = $this->input->post('user_id');
		$templateName = $this->input->post('templateName');
		$parameter1 = $this->input->post('parameter1');
		$parameter2 = $this->input->post('parameter2');
		$parameter3 = $this->input->post('parameter3');
		$parameter3 = $this->input->post('parameter4');
		$qval = $this->db->select('id AS customer_id, first_name AS firstname, last_name AS lastname, email, phone AS telephone,REPLACE(country_code, "+", "") AS countrycode')->where(array('id' => $user_id))->get('users');

		if ($qval->num_rows() > 0) {

			$firstname = $qval->row()->firstname;
			$email = $qval->row()->email;
			$telephone = $qval->row()->telephone;
			$countrycode = $qval->row()->countrycode;
			$finalNumber =  (string) $countrycode + $telephone;
			$this->sendWhatsappMessage($firstname, '' . $countrycode . '' . $telephone . '', $templateName);

			$response['success'] = true;
			$response['message'] = 'Message Send Successfully';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Message Send Unsuccessfully';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	private function sendWhatsappMessage($name, $mobile, $template_array, $urlValue = null, $projectName = null, $parameter1 = null, $parameter2 = null, $parameter3 = null, $parameter4 = null)
	{
		$channelId = '6415993ee2b5c6f148324c5d';
		$apiSecret = 'b108678ac3d143c4a837d4206dea3f8e';
		$apiKey = '645387bdd13214c03efe4c5d';

		$post_fields = array(
			'channelId' => $channelId,
			'channelType' => 'whatsapp',
			'recipient' => array(
				'name' => $name,
				'phone' => $mobile
			),
			'whatsapp' => array(
				'type' => 'template',
			)
		);

		$post_fields['whatsapp']['template'] = $this->getWhastsappTemplate($template_array, $name, $urlValue, $projectName, $parameter1, $parameter2, $parameter3, $parameter4);

		$curl = curl_init();

		curl_setopt_array($curl, array(
			CURLOPT_URL => 'https://server.gallabox.com/devapi/messages/whatsapp',
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_SSL_VERIFYHOST => false,
			CURLOPT_ENCODING => '',
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 0,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => 'POST',
			CURLOPT_POSTFIELDS => json_encode($post_fields),
			CURLOPT_HTTPHEADER => array(
				'apiSecret: ' . $apiSecret . '',
				'apiKey: ' . $apiKey . '',
				'Content-Type: application/json'
			),
		));

		$response = curl_exec($curl);

		if (curl_errno($curl)) {
			$error_msg = curl_error($curl);
		}
	}

	function getWhastsappTemplate($trigger_point, $name = null, $url = null, $projectName = null, $parameter1 = null, $parameter2 = null, $parameter3 = null, $parameter4 = null)
	{
		$template = array();
		switch ($trigger_point) {
			case 'sales_franchise_broadcast__clone':
				$template['templateName'] = 'sales_franchise_broadcast__clone';
				$template['bodyValues'] = array();
				$template['buttonValues'] = array(
					// 'index' => 0,
					// 'sub_type' => 'quick_reply',
					// 'parameters' => array(
					// 	'type' => 'payload',
					// 	'text' => 'Know More'
					// )
				);
				break;



			case 'thankyou_response_flows':
				$template['templateName'] = 'thankyou_response_flows';
				$template['bodyValues'] = array();
				$template['buttonValues'] = array(
					// 'index' => 2,
					// 'sub_type' => 'quick_reply',
					// 'parameters' => array(
					// 	'type' => 'payload',
					// 	'text' => 'Any query'
					// )
				);
				break;

			case 'sales_panelist_stage1':
				$template['templateName'] = 'sales_panelist_stage1';
				$template['bodyValues'] = array();
				$template['buttonValues'] = array(
					// 'index' => 2,
					// 'sub_type' => 'quick_reply',
					// 'parameters' => array(
					// 	'type' => 'payload',
					// 	'text' => 'Any query'
					// )
				);
				break;


			case 'builder___broker_template_1__clone':
				$template['templateName'] = 'builder___broker_template_1__clone';
				$template['bodyValues'] = array();
				$template['buttonValues'] = array(
					// 'index' => 2,
					// 'sub_type' => 'quick_reply',
					// 'parameters' => array(
					// 	'type' => 'payload',
					// 	'text' => 'Any query'
					// )
				);
				break;


			case 'welcome_message_onespace_interior__clone':
				$template['templateName'] = 'welcome_message_onespace_interior__clone';
				$template['bodyValues'] = array();
				$template['buttonValues'] = array(
					// 'index' => 2,
					// 'sub_type' => 'quick_reply',
					// 'parameters' => array(
					// 	'type' => 'payload',
					// 	'text' => 'Any query'
					// )
				);
				break;


			case 'standalone_panelist_final_clone':
				$template['templateName'] = 'standalone_panelist_final_clone';
				$template['bodyValues'] = array(
					'location' => $parameter1,
					'date' => $parameter2,
					'time' => $parameter3,
				);
				$template['buttonValues'] = array(
					// 'index' => 0,
					// 'sub_type' => 'quick_reply',
					// 'parameters' => array(
					// 	'type' => 'payload',
					// 	'text' => 'Any query'
					// )
				);
				break;

			case 'project_created':
				$template['templateName'] = 'new_requirement_is_created';
				$template['bodyValues'] = array();
				$template['buttonValues'] = array(
					// array(
					// 	'index' => 1,
					// 	'sub_type' => 'url',
					// 	'parameters' => array(
					// 		'type' => 'text',
					// 		'text' => 'Visit Us'
					// 	)
					// )
				);
				break;

			case 'requirement_created':
				$template['templateName'] = 'new_requirement_is_created_clone';
				$template['bodyValues'] = array();
				$template['buttonValues'] = array();
				$template["headerValues"] =  array(
					'mediaUrl' => $url,
					'mediaName' => $projectName
				);

				break;

			case 'requirement_freezed':
				$template['templateName'] = 'requirement_is_freezed_by_a_customer';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				$template['buttonValues'] = array(
					// array(
					// 	'index' => 1,
					// 	'sub_type' => 'url',
					// 	'parameters' => array(
					// 		'type' => 'text',
					// 		'text' => 'Visit Us'
					// 	)
					// )
				);
				break;

			case 'requirement_freezed':
				$template['templateName'] = 'requirement_is_freezed_by_a_customer';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				$template['buttonValues'] = array(
					// array(
					// 	'index' => 1,
					// 	'sub_type' => 'url',
					// 	'parameters' => array(
					// 		'type' => 'text',
					// 		'text' => 'Visit Us'
					// 	)
					// )
				);
				break;

			case 'client_contract_generated':
				$template['templateName'] = '10__reminder_message__';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				$template['buttonValues'] = array(
					// array(
					// 	'index' => 1,
					// 	'sub_type' => 'url',
					// 	'parameters' => array(
					// 		'type' => 'text',
					// 		'text' => 'Visit Us'
					// 	)
					// )
				);
				break;

			case '10_percent_in_progress':
				$template['templateName'] = '10__reminder_message__';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				$template['buttonValues'] = array(
					// array(
					// 	'index' => 1,
					// 	'sub_type' => 'url',
					// 	'parameters' => array(
					// 		'type' => 'text',
					// 		'text' => 'Visit Us'
					// 	)
					// )
				);


				break;

			case 'otp_verify_':
				$template['templateName'] = 'otp_verify_';
				$template['bodyValues'] = array(
					'otp' => $name,
				);
				break;

			case '10_percent_in_completed':
				$template['templateName'] = 'booking_confirmed_';
				$template['bodyValues'] = array(
					'name' => $name,
				);


				break;

			case 'timeline_generated':
				$template['templateName'] = 'timeline_generated_';
				$template['bodyValues'] = array(
					'name' => $name,
				);


				break;

			case 'product_selection':
				$template['templateName'] = 'product_selection_';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				$template['buttonValues'] = array(
					// array(
					// 	'index' => 1,
					// 	'sub_type' => 'url',
					// 	'parameters' => array(
					// 		'type' => 'text',
					// 		'text' => 'Visit Us'
					// 	)
					// )
				);
				break;

			case 'layout_plan':
				$template['templateName'] = 'layout_plan_';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case 'sales_technical_report':
				$template['templateName'] = '17_sales_technical_report_';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case '3d_designs_and_3d_ticker':
				$template['templateName'] = '3d_designs_and_3d_ticker__';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case 'completion_of_design_process':
				$template['templateName'] = 'completion_of_design_process';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case '50__payment':
				$template['templateName'] = '50__payment';
				$template['bodyValues'] = array(
					'name' => $name,
				);

				break;

			case 'payment_confirmation_for_50':
				$template['templateName'] = 'payment_confirmation_for_50_';


				break;

			case 'panelist_selection':
				$template['templateName'] = 'panelist_selection_';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case 'panelist_confirmation':
				$template['templateName'] = 'panelist_confirmation_';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case 'stage_7_completion':
				$template['templateName'] = 'stage_2_completion___clone';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case 'factory_visit':
				$template['templateName'] = 'factory_visit';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case 'stage_9_completion':
				$template['templateName'] = 'stage_3_completion';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case 'stage_10_inprogress':
				$template['templateName'] = 'photoshoot_and_handover';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case 'stage_10_completion':
				$template['templateName'] = 'completion_of_project_';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				break;

			case 'product_purchased_':
				$template['templateName'] = 'product_purchased_';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				$template['buttonValues'] = array(
					// array(
					// 	'index' => 1,
					// 	'sub_type' => 'url',
					// 	'parameters' => array(
					// 		'type' => 'text',
					// 		'text' => 'TRACK ORDER'
					// 	)
					// )
				);
				break;

			case 'product_added_to_wishlist_':
				$template['templateName'] = 'product_added_to_wishlist_';
				$template['bodyValues'] = array(
					'name' => $name,
				);
				$template['buttonValues'] = array(
					// array(
					// 	'index' => 1,
					// 	'sub_type' => 'url',
					// 	'parameters' => array(
					// 		'type' => 'text',
					// 		'text' => 'CLICK TO EXPLORE'
					// 	)
					// )
				);
				break;

			case 'sales_franchise_clone_web_':
				$template['templateName'] = 'sales_franchise_clone_web_';
				break;

			default:
				# code...
				$template['templateName'] = 'new_requirement_is_created';
				break;
		}
		return $template;
	}

	public function panellist_work_details()
	{
		$panellist_id = $this->input->get('panellist_id');
		$project_id = $this->input->get('project_id');

		$query = $this->db->select('panelist_daily_updates.date,json_arrayagg(json_object("workerName",panelist_workers.name,"workerDesc",panelist_daily_updates.description,"photos",panelist_daily_updates.photos)) as "values"')
			->from('panelist_daily_updates')
			->join('panelist_workers', 'panelist_daily_updates.worker_id = panelist_workers.worker_profile_id')
			->where('panelist_daily_updates.project_id', $project_id)
			->where('panelist_daily_updates.panelist_id', $panellist_id)
			->group_by('panelist_daily_updates.date')
			->get()->result();

		$result = [];
		foreach ($query as $row) {
			if (!empty($row->values)) {
				$values = json_decode($row->values, true);
				foreach ($values as &$v) {
					if (!empty($v['photos'])) {
						$v['photos'] = unserialize($v['photos']);
					} else {
						$v['photos'] = [];
					}
				}
			}
			$result[] = [
				'date'  => $row->date,
				'value' => $values
			];
		}
		$this->response([
			'success' => true,
			'message' => null,
			'response' => $result
		]);
	}

	// public function store_SalesOrder()
	// {
	// 	// die();
	// 	// Include the main TCPDF library (search for installation path).
	// 	require_once(APPPATH.'TCPDF/tcpdf.php');

	// 	// create new PDF document
	// 	$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

	// 	// set default monospaced font
	// 	$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

	// 	// set image scale factor
	// 	$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

	// 	// set some language-dependent strings (optional)
	// 	if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
	// 		require_once(dirname(__FILE__).'/lang/eng.php');
	// 		$pdf->setLanguageArray($l);
	// 	}

	// 	// set default font subsetting mode
	// 	$pdf->setFontSubsetting(true);
	// 	// Add a page
	// 	// This method has several options, check the source code documentation for more information.
	// 	$pdf->AddPage();

	// 	$html = '<table style="width:100%;font-size:13px;"  border="1" cellspacing="0" cellpadding="5">
	// 								<tr class="top" style="height: 100px;">
	// 									<td style="height: 100px;" colspan="5">
	// 										<table>
	// 											<tbody>
	// 												<tr>
	// 												<td style="width: 100%;text-align: center; font-weight: bold;"><h2><strong>NAKODA INFOTECH</strong></h2>
	// 												</td>
	// 												<hr>
	// 												</tr>
	// 												<tr>
	// 												<td style="width: 100%;text-align: center;font-weight: normal;font-size: 9px;"><br><br><br>38/40, CHAMPA GALI CROSS LANE, 3RD FLOOR, OFFICE NO 23A,
	// 												<br>KALBADEVI ROAD, MUMBAI - 400002, MAHARASHTRA
	// 												</td>
	// 												</tr>
	// 												<tr>
	// 												<td style="width: 100%;text-align: center;font-weight: normal;"><h4>GSTIN : 27AJEPJ9011B1ZO</h4>
	// 												</td>
	// 												</tr>
	// 												<tr>
	// 												<td style="width: 100%;text-align: center;font-weight: normal;font-size: 5px;">  
	// 												</td>
	// 												<hr>
	// 												</tr>
	// 												<tr>
	// 												<td style="width: 100%;text-align: center;font-weight: normal;"><h4>ORDER CONFIRMATION</h4>
	// 												</td>
	// 												</tr>
	// 											</tbody>
	// 										</table>
	// 									</td>
	// 								</tr>
	// 								<tr>
	// 								<td style=" width: 50%;"><h4>M/s.
	// 								NVAHAN TEXTILE PVT.LTD</h4><br>20/24, Murarji Buildng, Room No.23-24 2nd Floor, Kolbhat
	// 								Lane, Kalbadevi Road, Mumbai - 400002,
	// 								9324258806<br><h4>GSTIN : 27AADCN6248H1ZA</h4><br>Agent : ADINATH AGENCY</td>
	// 								<td style=" width: 50%;"><h4>Order No 3<br><br>Party PO No. 0<br><br>Cr Days 15<br><br>Ship To ALISHA COLLECTION<br><br>Transport MOONGIPA ROADWAYS PVT.LTD.<br><br>To City
	// 								Bhiwandi</h4></td></tr>
	// 								<tr class="heading" style="height: 18px;">
	// 							<td style="height: 18px; width: 20%; ">ITEM NAME </td>
	// 							<td style="height: 18px; width: 12%;">
	// 								<span style="display: block; width:100%; font-weight: bold;">DESIGN NO</span>
	// 							</td>
	// 							<td style="height: 18px; width: 10%;text-align: center;">
	// 								<span style="display: block; width:100%; font-weight: bold;">SHADE</span>
	// 							</td>
	// 							<td style="height: 18px; width: 8%;text-align: center;">
	// 							<span style="display: block; width:100%; font-weight: bold;">QTY</span>
	// 							</td>
	// 							<td style="height: 18px; width: 9%;text-align: center;">
	// 								<span style="display: block; width:100%; font-weight: bold;">UNIT</span>
	// 							</td>
	// 							<td style="height: 18px; width: 9%;text-align: center;">
	// 								<span style="display: block; width:100%; font-weight: bold;">CUT</span>
	// 							</td>
	// 							<td style="height: 18px; width: 9%;text-align: center;">
	// 								<span style="display: block; width:100%; font-weight: bold;">MTRS</span>
	// 							</td>
	// 							<td style="height: 18px; width: 9%;text-align: center;">
	// 								<span style="display: block; width:100%; font-weight: bold;">RATE</span>
	// 							</td>
	// 							<td style="height: 18px; width: 14%;text-align: center;">
	// 								<span style="display: block; width:100%; font-weight: bold;">REMARKS</span>
	// 							</td>
	// 							</tr>';

	// 			for($j=0; $j < 5; $j++) {
	// 				$html .= '<tr class="heading" style="height: 18px;">
	// 				<td style="height: 18px; width: 20%; ">SATIN</td>
	// 				<td style="height: 18px; width: 12%;">
	// 					<span style="display: block; width:100%; font-weight: 600;">013762</span>
	// 				</td>
	// 				<td style="height: 18px; width: 10%;text-align: center;">
	// 					<span style="display: block; width:100%; font-weight: 600;">GREEN</span>
	// 				</td>
	// 				<td style="height: 18px; width: 8%;text-align: center;">
	// 				<span style="display: block; width:100%; font-weight: 600;">1</span>
	// 				</td>
	// 				<td style="height: 18px; width: 9%;text-align: center;">
	// 					<span style="display: block; width:100%; font-weight: 600;">PKTS</span>
	// 				</td>
	// 				<td style="height: 18px; width: 9%;text-align: center;">
	// 					<span style="display: block; width:100%; font-weight: 600;">0.00</span>
	// 				</td>
	// 				<td style="height: 18px; width: 9%;text-align: center;">
	// 					<span style="display: block; width:100%; font-weight: 600;">200.00</span>
	// 				</td>
	// 				<td style="height: 18px; width: 9%;text-align: center;">
	// 					<span style="display: block; width:100%; font-weight: 600;">105.00</span>
	// 				</td>
	// 				<td style="height: 18px; width: 14%;text-align: center;">
	// 					<span style="display: block; width:100%; font-weight: 600;"></span>
	// 				</td>
	// 				</tr>';
	// 						}

	// 			$html .= '<tr class="heading" style="height: 18px;">
	// 			<td style="height: 18px; width: 20%; "></td>
	// 			<td style="height: 18px; width: 12%;">
	// 				<span style="display: block; width:100%; font-weight: 600;"></span>
	// 			</td>
	// 			<td style="height: 18px; width: 10%;text-align: center;">
	// 				<span style="display: block; width:100%; font-weight: bold;">TOTAL:</span>
	// 			</td>
	// 			<td style="height: 18px; width: 8%;text-align: center;">
	// 			<span style="display: block; width:100%; font-weight: 600;">5</span>
	// 			</td>
	// 			<td style="height: 18px; width: 9%;text-align: center;">
	// 				<span style="display: block; width:100%; font-weight: 600;"></span>
	// 			</td>
	// 			<td style="height: 18px; width: 9%;text-align: center;">
	// 				<span style="display: block; width:100%; font-weight: 600;"></span>
	// 			</td>
	// 			<td style="height: 18px; width: 9%;text-align: center;">
	// 				<span style="display: block; width:100%; font-weight: 600;">1000.00</span>
	// 			</td>
	// 			<td style="height: 18px; width: 9%;text-align: center;">
	// 				<span style="display: block; width:100%; font-weight: 600;"></span>
	// 			</td>
	// 			<td style="height: 18px; width: 14%;text-align: center;">
	// 				<span style="display: block; width:100%; font-weight: 600;"></span>
	// 			</td>
	// 			</tr>

	// 			<tr>
	// 			<td style=" width: 50%;"><h4>Special Instructions :</h4><br>MOBILEAPP<br><br><br><br></td>
	// 			<td style=" width: 50%;"><h4>FOR NAKODA INFOTECH<br><br><br><br>Authorised Signatory</h4></td></tr>
	// 			</table>';




	// 	// Print text using writeHTMLCell()
	// 	$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, '', true);
	// 	// $requirement_id = 1;
	// 	// Close and output PDF document
	// 	// This method has several options, check the source code documentation for more information.

	// 	if(!file_exists($_SERVER['DOCUMENT_ROOT'].'public/customer/projects/viral')) {
	// 		mkdir($_SERVER['DOCUMENT_ROOT'].'public/customer/projects/viral');
	// 	}
	// 	$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'].'/public/customer/projects/viral/requirement-1.pdf';
	// 	$requirement_quotation = '/public/customer/projects/viral/requirement-1.pdf';
	// 	$pdf->Output($requirement_quotation_path, 'F');
	// 	// if($) {

	// 		$response['success'] = true;
	// 		$response['message'] = 'Data Inserted Successfully.';
	// 		$response['requirement_quotation'] = "https://onespaceinterior.com/".$requirement_quotation;
	// 		header('Content-Type: application/json; charset=utf-8');
	// 		echo json_encode($response);exit();
	// 	// } else {
	// 	// 	$response['success'] = false;
	// 	// 	$response['message'] = 'Error Occurred While Inserting Data.';
	// 	// 	header('Content-Type: application/json; charset=utf-8');
	// 	// 	echo json_encode($response);exit();
	// 	// }
	// }

	public function generate_Pdf()
	{

		$data = json_decode(file_get_contents('php://input'));

		$companyName 		= $data->companyName;
		$companyAddress 		= $data->companyAddress;
		$tableArray 		= $data->table;
		$titleArray 		= $data->titles;
		$bank 		= $data->bank;
		$account 		= $data->account;
		$ifsc 		= $data->ifsc;
		$upi 		= $data->upi;
		$totalTable 		= $data->table1;
		$partyName 			= $data->partyName;
		$Date 				= $data->Date;
		// echo count($totalTable);die();

		// die();
		// Include the main TCPDF library (search for installation path).
		require_once(APPPATH . 'TCPDF/tcpdf.php');

		// create new PDF document
		$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

		// set default monospaced font
		$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

		// set some language-dependent strings (optional)
		if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
			require_once(dirname(__FILE__) . '/lang/eng.php');
			$pdf->setLanguageArray($l);
		}

		// set default font subsetting mode
		$pdf->setFontSubsetting(true);
		// Add a page
		// This method has several options, check the source code documentation for more information.
		$pdf->SetPrintHeader(false);
		$pdf->SetPrintFooter(false);
		$pdf->AddPage();
		$datevalue = date('Y-m-d H:i:s');               // 03.10.01
		$today = date('d-m-Y', strtotime($datevalue));
		if ($partyName == 'STOCK') {
			$html = '
				<p style="text-align: center;font-family: Verdana;"><h1> ' . $companyName . ' </h1>
				<br>' . $companyAddress . '
				<br>' . $partyName . '
				<br>' . $Date . '
				</p>
				<div style="text-align: left;font-size:8px;">Date: ' . $today . ' </div>
				<br>
				<table style="width:100%;font-size:8px;font-family: Verdana;"  border="1" cellspacing="0" cellpadding="5">
				<tr class="heading" style="height: 18px;">
					
					<td style="height: 18px; width: 14%;text-align: left;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[1] . '</b></span>
					</td>
					<td style="height: 18px; width: 17%;text-align: left;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[2] . '</b></span>
					</td>
					<td style="height: 18px; width: 19%;text-align: left;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[3] . '</b></span>
					</td>
					<td style="height: 18px; width: 19%;text-align: right;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[4] . '</b></span>
					</td>
					<td style="height: 18px; width: 14%;text-align: right;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[5] . '</b></span>
					</td>
					<td style="height: 18px; width: 14%;text-align: right;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[6] . '</b></span>
					</td>
				</tr>';
			$totalPCS = 0;
			$totalMTRS = 0;
			foreach ($tableArray as $item) {
				$tempArray = array();
				foreach ($item as $val) {
					array_push($tempArray, $val);
				}
				$html .=
					'<tr class="heading" style="height: 18px;">
							<td style="height: 18px; width: 14%;text-align: left;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[1] . '</span>
							</td>
							<td style="height: 18px; width: 17%;text-align: left;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[2] . '</span>
							</td>
							<td style="height: 18px; width: 19%;text-align: left;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[3] . '</span>
							</td>
							<td style="height: 18px; width: 19%;text-align: right;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[0] . '</span>
							</td>
							<td style="height: 18px; width: 14%;text-align: right;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[5] . '</span>
							</td>
							<td style="height: 18px; width: 14%;text-align: right;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[6] . '</span>
							</td>
						</tr>';
				$totalPCS = $totalPCS + $tempArray[5];
				$totalMTRS = $totalMTRS + $tempArray[6];
			}
			// $tempArrayVal = array();
			// foreach ($totalTable as $item) {
			// 	foreach ($item as $val) {
			// 		// if ($val) { echo 'VALUE IS: '.$val; };
			// 		array_push($tempArrayVal, $val);
			// 	}
			// }


			$html .= '<tr class="heading" style="height: 18px;">
				   		<td style="height: 18px; width: 69%;text-align: right;"><b>TOTAL</b></td>
				   		<td style="height: 18px; width: 14%;text-align: right;">' . $totalPCS . '</td>
				   		<td style="height: 18px; width: 14%;text-align: right;">' . $totalMTRS . '</td>
				   	</tr></table><br>
				<div style="text-align: center;font-family: Verdana;"><h5> Powered by Nakoda Infotech </h5></div>';
		} else {
			$html = '
				<p style="text-align: center;font-family: Verdana;"><h1> ' . $companyName . ' </h1>
				<br>' . $companyAddress . '
				<br>' . $partyName . '
				<br>' . $Date . '
				</p>
				<div style="text-align: left;font-size:8px;">Date: ' . $today . ' </div>
				<br>
				<table style="width:100%;font-size:8px;font-family: Verdana;"  border="1" cellspacing="0" cellpadding="5">
				<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 12%;text-align: left;"><b>' . $titleArray[0] . '</b></td>
					<td style="height: 18px; width: 12%;text-align: left;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[1] . '</b></span>
					</td>
					<td style="height: 18px; width: 15%;text-align: left;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[2] . '</b></span>
					</td>
					<td style="height: 18px; width: 17%;text-align: left;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[3] . '</b></span>
					</td>
					<td style="height: 18px; width: 12%;text-align: right;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[4] . '</b></span>
					</td>
					<td style="height: 18px; width: 12%;text-align: right;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[5] . '</b></span>
					</td>
					<td style="height: 18px; width: 12%;text-align: right;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[6] . '</b></span>
					</td>
					<td style="height: 18px; width: 8%;text-align: right;">
						<span style="display: block; width:100%; font-weight: 400;"><b>' . $titleArray[7] . '</b></span>
					</td>
				</tr>';
			foreach ($tableArray as $item) {
				$tempArray = array();
				foreach ($item as $val) {
					array_push($tempArray, $val);
				}
				$html .=
					'<tr class="heading" style="height: 18px;">
							<td style="height: 18px; width: 12%;text-align: left;">' . str_replace('', 'T00:00:00', $tempArray[0]) . '</td>
							<td style="height: 18px; width: 12%;text-align: left;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[1] . '</span>
							</td>
							<td style="height: 18px; width: 15%;text-align: left;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[2] . '</span>
							</td>
							<td style="height: 18px; width: 17%;text-align: left;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[3] . '</span>
							</td>
							<td style="height: 18px; width: 12%;text-align: right;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[4] . '</span>
							</td>
							<td style="height: 18px; width: 12%;text-align: right;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[5] . '</span>
							</td>
							<td style="height: 18px; width: 12%;text-align: right;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[6] . '</span>
							</td>
							<td style="height: 18px; width: 8%;text-align: right;">
								<span style="display: block; width:100%; font-weight: 400;">' . $tempArray[7] . '</span>
							</td>
						</tr>';
			}
			$tempArrayVal = array();
			foreach ($totalTable as $item) {
				foreach ($item as $val) {
					// if ($val) { echo 'VALUE IS: '.$val; };
					array_push($tempArrayVal, $val);
				}
			}


			$html .= '<tr class="heading" style="height: 18px;">
				   		<td style="height: 18px; width: 56%;text-align: right;"><b>TOTAL</b></td>
				   		<td style="height: 18px; width: 12%;text-align: right;">' . $tempArrayVal[0] . '</td>
				   		<td style="height: 18px; width: 12%;text-align: right;">' . $tempArrayVal[1] . '</td>
				   		<td style="height: 18px; width: 12%;text-align: right;">' . $tempArrayVal[2] . '</td>
				   		<td style="height: 18px; width: 8%;text-align: right;">' . $tempArrayVal[3] . '</td>
				   	</tr></table><br>
		<div style="text-align: left;font-size:8px;font-family: Verdana;">BANK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;<b>' . $bank . '</b><br>A/C NO&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;<b>' . $account . '</b><br>IFSC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;<b>' . $ifsc . '</b><br>UPI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;<b>' . $upi . '</b><br>
		<div style="text-align: center;font-family: Verdana;"><h5> Powered by Nakoda Infotech </h5></div>';
		}
		// Print text using writeHTMLCell()
		$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 0, 0, true, '', true);
		// $requirement_id = 1;
		// Close and output PDF document
		// This method has several options, check the source code documentation for more information.

		if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral')) {
			mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral');
		}
		$path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/';
		// 86400 = 1day

		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if ((int)(time() - filemtime($path . $file)) > 86400 && $file !== '.' && $file !== '..') {
					unlink($path . $file);
				}
			}
		}

		$number = rand(100000, 999999);
		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$pdf->Output($requirement_quotation_path, 'F');
		// if($) {
		$response['success'] = true;
		$response['message'] = 'Data Inserted Successfully.';
		$response['requirement_quotation'] = "https://onespaceinterior.com/" . $requirement_quotation;
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
		exit();
		// } else {
		// 	$response['success'] = false;
		// 	$response['message'] = 'Error Occurred While Inserting Data.';
		// 	header('Content-Type: application/json; charset=utf-8');
		// 	echo json_encode($response);exit();
		// }
	}

	public function generate_Challan_Pdf()
	{

		$data = json_decode(file_get_contents('php://input'));
		$MainCompany	= $data->MainCompany;
		$dataList 		= $data->dataList;
		// die();
		// Include the main TCPDF library (search for installation path).
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		$pdfurls = array();

		foreach ($dataList as $item) {
			// create new PDF document
			$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

			// set default monospaced font
			$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

			// set some language-dependent strings (optional)
			if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
				require_once(dirname(__FILE__) . '/lang/eng.php');
				$pdf->setLanguageArray($l);
			}

			// set default font subsetting mode
			$pdf->setFontSubsetting(true);
			// Add a page
			// This method has several options, check the source code documentation for more information.
			$pdf->SetPrintHeader(false);
			$pdf->SetPrintFooter(false);
			$pdf->AddPage();
			$datevalue = str_replace('', 'T00:00:00', $item->DATE);
			$today = date('d-m-Y', strtotime($datevalue));
			$html = '
				<p style="text-align: center;"><h5>DELIVERY CHALLAN</h5><h1>' . $MainCompany->companyName . '</h1>
				<h6>' . $MainCompany->companyAddress . '</h6>
				</p>
				<table style="width:100%;font-size:8px;font-family: Verdana;" cellspacing="0" cellpadding="3">
				<tr class="heading">
					<td style="width: 25%;text-align: left;" border="1"><b>Challan No&nbsp;&nbsp;:&nbsp;&nbsp;' . $item->GDNNO . '</b><br>
						<span style="display: block; width:100%;"><b>Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;</b>' . $today . '</span><br>
						<span style="display: block; width:100%;"><b>Delivery At&nbsp;&nbsp;:&nbsp;&nbsp;</b>' . $item->CITYNAME . '</span>
					</td>
					<td style="width: 50%;text-align: left;" border="1">
						<span style="display: block; width:100%;"><b>Transport&nbsp;&nbsp;:&nbsp;&nbsp;</b>' . $item->TRANSNAME . '</span><br>
						<span style="display: block; width:100%;"><b>Bales&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;</b>' . $item->BALENO . '</span><br>
						<span style="display: block; width:100%;"><b>Broker&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;</b>' . $item->AGENT . '</span>
					</td>
					<td style="width: 25%;text-align: left;" border="1">
						<span style="display: block; width:100%;"><b>GSTIN&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;' . $MainCompany->GSTNO . '</b></span><br>
						<span style="display: block; width:100%;"><b>STATE&nbsp;&nbsp;:&nbsp;&nbsp;' . $MainCompany->State . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . $MainCompany->StateBenchMark . '</b></span>
					</td>
				</tr>

				<tr class="heading" style="background-color: #f0f0f0; text-align: center;">
					<td style="width: 50%;text-align: center;" border="1">
						<span style="display: block; width:100%;"><b>Details of Receiver</b></span>
					</td>
					<td style="width: 50%;text-align: center;" border="1">
						<span style="display: block; width:100%;"><b>Details of Consignee (Shipped To)</b></span>
					</td>
				</tr>
				<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 50%; border-left: 1px solid #000; border-right: 1px solid #000;">
						<span style="display: block; "><b>Name&nbsp;&nbsp;:&nbsp;&nbsp;' . $item->NAME . '</b></span>
						</td>
					<td style="height: 18px; width: 50%; border-left: 1px solid #000; border-right: 1px solid #000;">
						<span style="display: block; "><b>Name&nbsp;&nbsp;:&nbsp;&nbsp;' . $item->DISPATCHTO . '</b></span>
					</td>
				</tr>

				<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 6%; border-left: 1px solid #000; ">
					</td>
					<td style="height: 18px; width: 44%; border-right: 1px solid #000;">
						<span style="display: block;">' . $item->PARTYADD . '</span><br>
					</td>
					<td style="height: 18px; width: 6%; border-left: 1px solid #000; ">
					</td>
					<td style="height: 18px; width: 44%; border-right: 1px solid #000;">
						<span style="display: block;">' . $item->DISPATCHADD . '</span><br>
					</td>
				</tr>

				<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 50%; border-left: 1px solid #000; border-right: 1px solid #000;">
						<span style="display: block; "><b>GSTIN&nbsp;&nbsp;:&nbsp;&nbsp;' . $item->PARTYGSTIN . '
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATE&nbsp;&nbsp;:&nbsp;&nbsp;' . $item->PARTYSTATE . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . $item->PARTYSTATEREMARK . '</b></span>
					</td>
					<td style="height: 18px; width: 50%; border-left: 1px solid #000; border-right: 1px solid #000;">
						<span style="display: block; "><b>GSTIN&nbsp;&nbsp;:&nbsp;&nbsp;' . $item->DISPATCHGSTIN . '
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATE&nbsp;&nbsp;:&nbsp;&nbsp;' . $item->DISPATCHSTATE . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . $item->DISPATCHSTATEREMARK . '</b></span>
					</td>
				</tr>
				<tr class="heading" style="height: 18px;" border="1">
					<td style="height: 18px; width: 60%; text-align: center;border-left: 1px solid #000; border-top: 1px solid #000;border-bottom: 1px solid #000;"><b>DESCRIPTION</b></td>
					<td style="height: 18px; width: 10%; border-top: 1px solid #000;border-bottom: 1px solid #000;"><b>WIDTH</b></td>
					<td style="height: 18px; width: 10%; border-top: 1px solid #000;border-bottom: 1px solid #000;"><b>HSN</b></td>
					<td style="height: 18px; width: 10%; text-align: center;" border="1"><b>PCS</b></td>
					<td style="height: 18px; width: 10%; text-align: center;" border="1"><b>MTRS</b></td>
				</tr>';
			foreach ($item->GDNDETAILS as $itemval) {
				$html .=
					'<tr class="heading" style="height: 18px;" border="1">
							<td style="height: 18px; width: 60%; border-left: 1px solid #000; border-top: 1px solid #000;"><b>' . $itemval->ITEMNAME . '</b></td>
							<td style="height: 18px; width: 10%; border-top: 1px solid #000;"><b>' . $itemval->WIDTH . '</b></td>
							<td style="height: 18px; width: 10%; border-top: 1px solid #000; border-right: 1px solid #000;"><b>' . $itemval->HSN . '</b></td>
							<td style="height: 18px; width: 10%; border-top: 1px solid #000; border-right: 1px solid #000;"></td>
							<td style="height: 18px; width: 10%; border-top: 1px solid #000; border-right: 1px solid #000;"></td>
						</tr>';
				$totalPCS = 0;
				$totalMTRS = 0;
				foreach ($itemval->ITEMDETAILS as $itemvalDetails) {
					$totalPCS += $itemvalDetails->PCS;
					$totalMTRS += $itemvalDetails->MTRS;
					$html .=
						'<tr class="heading" style="height: 18px;" border="1">
								<td style="height: 18px; width: 10%; border-left: 1px solid #000;">' . $itemvalDetails->DESIGN . '</td>
								<td style="height: 18px; width: 15%; ">' . $itemvalDetails->SHADE . '</td>
								<td style="height: 18px; width: 55%;  border-right: 1px solid #000;">' . $itemvalDetails->cUTSTEMP . '</td>
								<td style="height: 18px; width: 10%; text-align: center; border-right: 1px solid #000;">' . $itemvalDetails->PCS . '</td>
								<td style="height: 18px; width: 10%; text-align: center; border-right: 1px solid #000;">' . $itemvalDetails->MTRS . '</td>
							</tr>';
				}
				$html .=
					'<tr class="heading" style="height: 18px;" border="1">
								<td style="height: 18px; width: 80%;" border="1"><b></b></td>
								<td style="height: 18px; width: 10%;text-align: center;" border="1"><b>' . $totalPCS . '</b></td>
								<td style="height: 18px; width: 10%;text-align: center;" border="1"><b>' . $totalMTRS . '</b></td>
							</tr>';
			}
			$html .= '<tr class="heading" style="height: 18px;">
							<td style="height: 18px; width: 80%;"border="1"><br><br><br><br></td>
								<td style="height: 18px; width: 10%;" border="1"><b></b></td>
								<td style="height: 18px; width: 10%;" border="1"><b></b></td>
						</tr>
						<tr class="heading" style="height: 18px;" border="1">
							<td style="height: 18px; width: 60%; border-left: 1px solid #000;  border-bottom: 1px solid #000; border-top: 1px solid #000;"><b>* MEANS TP</b></td>
							<td style="height: 18px; width: 10%; text-align: left; border-bottom: 1px solid #000; border-top: 1px solid #000;"><b>TOTAL</b></td>
							<td style="height: 18px; width: 10%; text-align: right; border-bottom: 1px solid #000; border-top: 1px solid #000;"><b>' . $item->TOTALPCS . '</b></td>
							<td style="height: 18px; width: 10%; text-align: center;" border="1"><b>' . $item->TOTALPCS . '</b></td>
							<td style="height: 18px; width: 10%; text-align: center;" border="1"><b>' . $item->TOTALMTRS . '</b></td>
						</tr>
						<tr class="heading" style="height: 18px;" border="1">
							<td style="height: 18px; width: 75%; text-align: left;" border="1"><b>Prepared By&nbsp;&nbsp;:&nbsp;</b>' . $item->USERNAME . '<br>' . $item->TERMSANDCONDITIONS . '
							</td>
							<td style="height: 18px; width: 25%; text-align: right;" border="1"><b>FOR&nbsp;&nbsp;' . $MainCompany->companyName . '</b></td>
						</tr>
						<tr class="heading" style="height: 18px;">
							<td style="height: 18px; width: 50%; text-align: left;">Receiver\'s Sign :</td>
						</tr>
						</table>
				<div style="text-align: center;"><h5> Powered by Nakoda Infotech </h5></div>';
			// Print text using writeHTMLCell()
			$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 0, 0, true, '', true);
			if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral')) {
				mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral');
			}
			$path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/';


			$number = rand(100000, 999999);
			$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
			$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
			$pdf->Output($requirement_quotation_path, 'F');

			array_push($pdfurls, "https://onespaceinterior.com/" . $requirement_quotation);
		}
		// Include the main TCPDF library and TCPDI.
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		require_once(APPPATH . 'TCPDF/FPDI/src/autoload.php');
		// require_once(APPPATH.'TCPDF/FPDI/src/PdfParser/StreamReader.php');
		require_once(APPPATH . 'TCPDF/signpdf.php');
		$pdf = new Pdf();
		$pdf->SetAutoPageBreak(false);
		foreach ($pdfurls as $x) {
			$sign_file_path = file_get_contents($x);
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
				$tplIdx = $pdf->importPage($pageNo);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
			}
		}
		// 86400 = 1day

		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if ((int)(time() - filemtime($path . $file)) > 86400 && $file !== '.' && $file !== '..') {
					unlink($path . $file);
				}
			}
		}

		$number = rand(100000, 999999);
		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$pdf->Output($requirement_quotation_path, 'F');

		$response['success'] = true;
		$response['message'] = 'Data Inserted Successfully.';
		$response['requirement_quotation'] = "https://onespaceinterior.com/" . $requirement_quotation;
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
		exit();
	}

	public function generate_Sales_Pdf()
	{

		$data = json_decode(file_get_contents('php://input'));
		$MainCompany	= $data->MainCompany;
		$dataList 		= $data->dataList;
		// die();
		// Include the main TCPDF library (search for installation path).
		require_once(APPPATH . 'TCPDF/tcpdf.php');



		$pdfurls = array();
		foreach ($dataList as $item) {
			// create new PDF document
			$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

			// set default monospaced font
			$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

			// set some language-dependent strings (optional)
			if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
				require_once(dirname(__FILE__) . '/lang/eng.php');
				$pdf->setLanguageArray($l);
			}

			// set default font subsetting mode
			$pdf->setFontSubsetting(true);
			// Add a page
			// This method has several options, check the source code documentation for more information.
			$pdf->SetPrintHeader(false);
			$pdf->SetPrintFooter(false);
			$pdf->AddPage();
			$pdf->setCellPaddings(0, 0, 0, 0);
			$datevalue = str_replace('', 'T00:00:00', $item->INVDATE);
			$today = date('d-m-Y', strtotime($datevalue));

			$challan = str_replace('', 'T00:00:00', $item->CHALLANDATE);
			$challanDate = date('d-m-Y', strtotime($challan));

			$lr = str_replace('', 'T00:00:00', $item->LRDATE);
			$lrDate = date('d-m-Y', strtotime($lr));

			$ackNo = str_replace('', 'T00:00:00', $item->ACKDATE);
			$ackNoDate = date('d-m-Y', strtotime($ackNo));

			$due = str_replace('', 'T00:00:00', $item->DUEDATE);
			$dueDate = date('d-m-Y', strtotime($due));
			$html = '<h1 style="text-align: center;">' . $MainCompany->companyName . '</h1>
				<h6 style="text-align: center;">' . $MainCompany->companyAddress . '</h6>
				<table style="width:100%;font-size:8px;font-family: Verdana;" cellspacing="0" cellpadding="3">
				<tr class="heading">
					<td style="width: 30%;text-align: right; border-left: 1px solid #000;border-top: 1px solid #000;border-bottom: 1px solid #000;"><b>MSME NO : ' . $MainCompany->msme . '</b></td>
					<td style="width: 40%;text-align: center; border-top: 1px solid #000;border-bottom: 1px solid #000;"><b>GSTIN : ' . $MainCompany->GSTNO . '</b></td>
					<td style="width: 30%;text-align: left; border-right: 1px solid #000;border-top: 1px solid #000;border-bottom: 1px solid #000;"><b>PAN NO : ' . $MainCompany->panno . '</b></td>
				</tr>
				<tr class="heading">
					<td style="width: 25%;text-align: right; border-left: 1px solid #000;border-top: 1px solid #000;border-bottom: 1px solid #000;"><b></b></td>
					<td style="width: 50%;text-align: center; border-top: 1px solid #000;border-bottom: 1px solid #000;"><b>GST TAX INVOICE</b></td>
					<td style="width: 25%;text-align: right; background-color: #f0f0f0; border-right: 1px solid #000;border-top: 1px solid #000;border-bottom: 1px solid #000;border-left: 1px solid #000;"><b>CUSTOMER COPY</b></td>
				</tr>
				<tr class="heading" style="text-align: center;">
					<td style="width: 50%;text-align: center;background-color: #f0f0f0;" border="1"><b>Bill To</b></td>
					<td style="width: 10%;text-align: left;"><b>Inv No</b></td>
					<td style="width: 25%;text-align: left;"><b>: ' . $item->PRINTINITIALS . '</b></td>
					<td style="width: 15%;text-align: right;border-right: 1px solid #000;"><b>Dt : ' . $today . '</b></td>
				</tr>
				<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 50%; border-left: 1px solid #000; border-right: 1px solid #000;">
						<span style="display: block; "><b>Name&nbsp;&nbsp;:&nbsp;&nbsp;' . $item->NAME . '</b></span>
						</td>
					<td style="width: 10%;text-align: left;"><b>Order No</b></td>
					<td style="width: 25%;text-align: left;">: 0</td>
					<td style="width: 15%;text-align: right;border-right: 1px solid #000;"><b>Dt : ' . $today . '</b></td>
				</tr>
				<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 6%; border-left: 1px solid #000;">
						<span style="display: block; "></span>
					</td>
					<td style="height: 18px; width: 44%;border-right: 1px solid #000;">
						<span style="display: block; "><b>' . $item->PARTYADD . '</b></span>
						</td>
					<td style="width: 10%;text-align: left;"><b>Challan No</b></td>
					<td style="width: 25%;text-align: left;"><b>: ' . $item->CHALLANNO . '</b></td>
					<td style="width: 15%;text-align: right;border-right: 1px solid #000;"><b>Dt : ' . $challanDate . '</b></td>
				</tr>
				<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 25%; border-left: 1px solid #000;"><b>GSTIN : ' . $item->PARTYGSTIN . '<br>PAN NO : </b></td>
					<td style="height: 18px; width: 25%; border-right: 1px solid #000;"><b>State :</b> ' . $item->PARTYSTATE . ' ' . $item->PARTYSTATEREMARK . '</td>
					<td style="width: 10%;text-align: left;"><b>Broker<br>Cr. Days</b></td>
					<td style="width: 25%;text-align: left;"><b>: ' . $item->AGENTNAME . '<br>: ' . $item->CRDAYS . '</b></td>
					<td style="width: 15%;text-align: right;border-right: 1px solid #000;"><b>Due Dt : ' . $dueDate . '</b></td>
				</tr>


				<tr class="heading" style="text-align: center;">
					<td style="width: 50%;text-align: center;background-color: #f0f0f0;" border="1"><b>Shipped To</b></td>
					<td style="width: 10%;text-align: left;border-top: 1px solid #000;"><b>EWB No</b></td>
					<td style="width: 25%;text-align: left;border-top: 1px solid #000;"><b>: ' . $item->EWAYBILLNO . '</b></td>
					<td style="width: 15%;text-align: right;border-right: 1px solid #000;border-top: 1px solid #000;"></td>
				</tr>
				<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 50%; border-left: 1px solid #000; border-right: 1px solid #000;">
						<span style="display: block; "><b>Name&nbsp;&nbsp;:&nbsp;&nbsp;' . $item->DISPATCHTO . '</b></span>
						</td>
					<td style="width: 10%;text-align: left;"><b>Transport</b></td>
					<td style="width: 40%;text-align: left;"><b>: ' . $item->TRANSNAME . '</b></td>
					<td style="width: 0%;text-align: right;border-right: 1px solid #000;"></td>
				</tr>
				<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 6%; border-left: 1px solid #000;;">
						<span style="display: block; "></span>
					</td>
					<td style="height: 18px; width: 44%;border-right: 1px solid #000;">
						<span style="display: block; "><b>' . $item->DISPATCHADD . '</b></span>
						</td>
					<td style="width: 10%;text-align: left;"><span><b>LR No.<br>Dt<br>Destination</b></span></td>
					<td style="width: 25%;text-align: left;"><span><b>: ' . $item->LRNO . '<br>: ' . $lrDate . '<br>: ' . $item->CITYNAME . '</b></span></td>
					<td style="width: 15%;text-align: right;border-right: 1px solid #000;">';

			if ($item->QRCODE == "") {
			} else {
				$html .= '<img src="data:image/png;base64,' . $item->QRCODE . ' " alt="Red dot" width="30" height="30"/>';
			}


			$html .= '</td>
				</tr><tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 25%; border-left: 1px solid #000;"><b>GSTIN : ' . $item->DISPATCHGSTIN . '</b></td>
					<td style="height: 18px; width: 25%; border-right: 1px solid #000;"><b>State :</b> ' . $item->DISPATCHSTATE . ' ' . $item->DISPATCHSTATEREMARK . '</td>
					<td style="width: 10%;text-align: left;"><b>No Of Bales</b></td>
					<td style="width: 25%;text-align: left;"><b>: ' . $item->BALENO . '</b></td>
					<td style="width: 15%;text-align: right;border-right: 1px solid #000;"></td>
				</tr>
				<tr class="heading" style="height: 18px;">
					<td style="height: 18px; width: 100%;" border="1"><b>ACK NO </b>: ' . $item->ACKNO . '  <b>Dt </b>: ' . $ackNoDate . ' <b>IRN NO</b>: ' . $item->IRNNO . ' </td>
				</tr>

				<tr class="heading" style="height: 18px;background-color: #f0f0f0" border="1">
					<td style="height: 18px; width: 8%; text-align: center;" border="1"><b>Sr No</b></td>
					<td style="height: 18px; width: 42%; text-align: center;" border="1"><b>Description Of Goods</b></td>
					<td style="height: 18px; width: 9%; text-align: center;" border="1"><b>HSN</b></td>
					<td style="height: 18px; width: 5%; text-align: center;" border="1"><b>PCS</b></td>		
					<td style="height: 18px; width: 8%; text-align: center;" border="1"><b>Mtrs</b></td>
					<td style="height: 18px; width: 9%; text-align: center;" border="1"><b>U.O.M.</b></td>
					<td style="height: 18px; width: 9%; text-align: center;" border="1"><b>Rate</b></td>
					<td style="height: 18px; width: 10%; text-align: center;" border="1"><b>Amount</b></td>
				</tr>';
			$ival = 1;
			foreach ($item->INVDETAILS as $itemval) {
				$html .= '<tr class="heading" style="height: 18px;" border="1">
					 	<td style="height: 18px; width: 8%; text-align: center;" border="1">' . $ival . '</td>
					 	<td style="height: 18px; width: 42%; text-align: left;" border="1"><b>' . $itemval->ITEMNAME . ' - ' . $itemval->DESIGN . '</b></td>
					 	<td style="height: 18px; width: 9%; text-align: center;" border="1">' . $itemval->HSN . '</td>
					 	<td style="height: 18px; width: 5%; text-align: right;" border="1">' . $itemval->PCS . '</td>		
					 	<td style="height: 18px; width: 8%; text-align: right;" border="1">' . $itemval->MTRS . '</td>
					 	<td style="height: 18px; width: 9%; text-align: center;" border="1">' . $itemval->UOM . '</td>
					 	<td style="height: 18px; width: 9%; text-align: right;" border="1">' . $itemval->RATE . '</td>
					 	<td style="height: 18px; width: 10%; text-align: right;" border="1">' . $itemval->AMOUNT . '</td>
						</tr>';
				$ival = $ival + 1;
			}
			foreach ($item->INVCHARGES as $itemvalCharges) {
				$html .= '<tr class="heading" style="height: 18px;" border="1">
					 		<td style="height: 18px; width: 8%; text-align: center;" border="1"><b></b></td>
					 		<td style="height: 18px; width: 42%; text-align: left;" border="1"><b>' . $itemvalCharges->CHARGES . '</b></td>
					 		<td style="height: 18px; width: 9%; text-align: center;" border="1"><b></b></td>
					 		<td style="height: 18px; width: 5%; text-align: right;" border="1"><b></b></td>		
					 		<td style="height: 18px; width: 26%; text-align: center;" border="1"><b>' . $itemvalCharges->CHARGESPER . '</b></td>
					 		<td style="height: 18px; width: 10%; text-align: right;" border="1"><b>' . $itemvalCharges->CHARGESAMT . '</b></td>
						</tr>';
			}
			$html .= '
						<tr class="heading" style="height: 18px;" border="1">
					 		<td style="height: 18px; width: 8%; text-align: center;" border="1"><b></b></td>
					 		<td style="height: 18px; width: 42%; text-align: left;" border="1"><b><br><br></b></td>
					 		<td style="height: 18px; width: 9%; text-align: center;" border="1"><b></b></td>
					 		<td style="height: 18px; width: 5%; text-align: right;" border="1"><b></b></td>		
					 		<td style="height: 18px; width: 26%; text-align: center;" border="1"><b></b></td>
					 		<td style="height: 18px; width: 10%; text-align: right;" border="1"><b></b></td>
						</tr>
						<tr class="heading" style="height: 18px;" border="1">
					 		<td style="height: 18px; width: 50%; text-align: right;" border="1"><b>Total : </b></td>
					 		<td style="height: 18px; width: 14%; text-align: right;" border="1"><b>' . $item->TOTALPCS . '</b></td>
								
					 	<td style="height: 18px; width: 8%; text-align: right;border-top: 1px solid #000;border-bottom: 1px solid #000;"><b>' . $item->TOTALMTRS . '</b></td>
					 	<td style="height: 18px; width: 9%; text-align: center;border-top: 1px solid #000;border-bottom: 1px solid #000;"><b></b></td>
					 	<td style="height: 18px; width: 9%; text-align: right;border-top: 1px solid #000;border-bottom: 1px solid #000;"><b></b></td>
						
					 		<td style="height: 18px; width: 10%; text-align: right;" border="1"><b></b></td>
						</tr>
						<tr class="heading" style="height: 18px;" border="1">
                            <td style="height: 18px; width: 64%; text-align: left;" border="1"><span><b>Remark<br><br>In Words </b>: ' . $item->INWORDS . '</span></td>
                            <td style="height: 18px; width: 20%; text-align: left;"><span><b>Total Amt Before Tax<br>Add : CGST ' . $item->TOTALCGSTPER . '<br>Add : SGST ' . $item->TOTALSGSTPER . '<br>Add : IGST ' . $item->TOTALIGSTPER . '</b></span></td>
                            <td style="height: 18px; width: 6%; text-align: center;"><span><b>: <br>: <br>: <br>: </b></span></td>
                            <td style="height: 18px; width: 10%; text-align: right;" border="1"><span><b>' . $item->TOTALWITHMATVALUE . '<br>' . $item->TOTALCGSTAMT . '<br>' . $item->TOTALSGSTAMT . '<br>' . $item->TOTALIGSTAMT . '</b></span></td>
                        </tr>
						<tr class="heading" style="height: 18px;" border="1">
                            <td style="height: 18px; width: 64%; text-align: left; border-right: 1px solid #000; border-left: 1px solid #000; " ><b>BANK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;' . $MainCompany->bank . '</b></td>
                            <td style="height: 18px; width: 20%; text-align: left;background-color: #f0f0f0; border-bottom: 1px solid #000; border-top: 1px solid #000;">Tax Amount : GST</td>
                            <td style="height: 18px; width: 6%; text-align: center;background-color: #f0f0f0; border-bottom: 1px solid #000; border-top: 1px solid #000; border-right: 1px solid #000;">: </td>
                            <td style="height: 18px; width: 10%; text-align: right;background-color: #f0f0f0" border="1">' . $item->TOTALTAXAMT . '</td>
                        </tr>
                        <tr class="heading" style="height: 18px;" border="1">
                            <td style="height: 18px; width: 64%; text-align: left; border-right: 1px solid #000; border-left: 1px solid #000;"><b>A/C NO&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;' . $MainCompany->account . '</b></td>
                            <td style="height: 18px; width: 20%; text-align: left; border-top: 1px solid #000;">TCS @ ' . $item->TCSPER . '</td>
                            <td style="height: 18px; width: 6%; text-align: center; border-top: 1px solid #000; border-right: 1px solid #000;">: </td>
                            <td style="height: 18px; width: 10%; text-align: right; border-top: 1px solid #000; border-right: 1px solid #000;">' . $item->TCSAMT . '</td>
                        </tr>
                        <tr class="heading" style="height: 18px;" border="1">
                            <td style="height: 18px; width: 64%; text-align: left; border-right: 1px solid #000; border-left: 1px solid #000;"><b>IFSC&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;' . $MainCompany->ifsc . '</b></td>
                            <td style="height: 18px; width: 20%; text-align: left; border-bottom: 1px solid #000;"><b>Round Off</b></td>
                            <td style="height: 18px; width: 6%; text-align: center; border-bottom: 1px solid #000; border-right: 1px solid #000;">: </td>
                            <td style="height: 18px; width: 10%; text-align: right; border-bottom: 1px solid #000; border-right: 1px solid #000;">' . $item->ROUNDOFF . '</td>
                        </tr>


                        <tr class="heading" style="height: 18px;" border="1">
                            <td style="height: 18px; width: 64%; text-align: left; border-right: 1px solid #000; border-left: 1px solid #000; " ><b>UPI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;' . $MainCompany->upi . '</b></td>
                            <td style="height: 18px; width: 20%; text-align: left;background-color: #f0f0f0; border-bottom: 1px solid #000; border-top: 1px solid #000;">Grand Total</td>
                            <td style="height: 18px; width: 6%; text-align: center;background-color: #f0f0f0; border-bottom: 1px solid #000; border-top: 1px solid #000; border-right: 1px solid #000;">: </td>
                            <td style="height: 18px; width: 10%; text-align: right;background-color: #f0f0f0" border="1">' . $item->GRANDTOTAL . '</td>
                        </tr>

                        <tr class="heading" style="height: 18px;" border="1">
                            <td style="height: 18px; width: 75%; text-align: left;" border="1">' . $item->TERMSANDCONDITIONS . '
                            </td>
                            <td style="height: 18px; width: 25%; text-align: right;" border="1"><b>FOR&nbsp;&nbsp;' . $MainCompany->companyName . '<br><br><br><br>Authorised Signature</b></td>
                        </tr>
                        <tr class="heading" style="height: 18px;">
                            <td style="height: 18px; width: 35%; text-align: left;"><b>Prepared By&nbsp;&nbsp;:&nbsp;</b>' . $item->USERNAME . '</td>
                            <td style="height: 18px; width: 30%; text-align: center;"><b>Checked By&nbsp;&nbsp;:&nbsp;</b></td>
                            <td style="height: 18px; width: 35%; text-align: right;"><b>E. & O. E.&nbsp;&nbsp;:&nbsp;</b></td>
                        </tr>
						</table>
				<div style="text-align: center;"><h5> Powered by Nakoda Infotech </h5></div>';
			// Print text using writeHTMLCell()
			$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 0, 0, true, '', true);

			if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral')) {
				mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral');
			}
			$path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/';


			$number = rand(100000, 999999);
			$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
			$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
			$pdf->Output($requirement_quotation_path, 'F');

			array_push($pdfurls, "https://onespaceinterior.com/" . $requirement_quotation);
		}
		// Include the main TCPDF library and TCPDI.
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		require_once(APPPATH . 'TCPDF/FPDI/src/autoload.php');
		// require_once(APPPATH.'TCPDF/FPDI/src/PdfParser/StreamReader.php');
		require_once(APPPATH . 'TCPDF/signpdf.php');
		$pdf = new Pdf();
		$pdf->SetAutoPageBreak(false);
		foreach ($pdfurls as $x) {
			$sign_file_path = file_get_contents($x);
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
				$tplIdx = $pdf->importPage($pageNo);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
			}
		}

		// 86400 = 1day

		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if ((int)(time() - filemtime($path . $file)) > 86400 && $file !== '.' && $file !== '..') {
					unlink($path . $file);
				}
			}
		}
		$number = rand(100000, 999999);
		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$pdf->Output($requirement_quotation_path, 'F');
		$response['success'] = true;
		$response['message'] = 'Data Inserted Successfully.';
		$response['requirement_quotation'] = "https://onespaceinterior.com/" . $requirement_quotation;
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
		exit();
	}

	public function generate_SaleOrder_Pdf()
	{

		$data = json_decode(file_get_contents('php://input'));
		$MainCompany	= $data->MainCompany;
		$dataList 		= $data->dataList;
		// die();
		// Include the main TCPDF library (search for installation path).
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		$pdfurls = array();

		foreach ($dataList as $item) {
			// create new PDF document
			$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

			// set default monospaced font
			$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

			// set some language-dependent strings (optional)
			if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
				require_once(dirname(__FILE__) . '/lang/eng.php');
				$pdf->setLanguageArray($l);
			}

			// set default font subsetting mode
			$pdf->setFontSubsetting(true);
			// Add a page
			// This method has several options, check the source code documentation for more information.
			$pdf->SetPrintHeader(false);
			$pdf->SetPrintFooter(false);
			$pdf->AddPage();
			$datevalue = str_replace('', 'T00:00:00', $item->SODATE);
			$soDate = date('d-m-Y', strtotime($datevalue));


			$datevalueDel = str_replace('', 'T00:00:00', $item->DELDATE);
			$soDateDel = date('d-m-Y', strtotime($datevalueDel));

			$html = '<h1 style="text-align: center;">' . $MainCompany->companyName . '</h1>
				<h6 style="text-align: center;">' . $MainCompany->companyAddress . '<br><b>GSTIN : ' . $MainCompany->GSTNO . '<br>ORDER CONFIRMATION</b></h6>
				<table style="width:100%;font-size:8px;font-family: Verdana;" cellspacing="0" cellpadding="2">
				<tr class="heading" style="">
					<td style="width: 6%;  border-top: 1px solid #000;border-left: 1px solid #000; "><b>Name</b></td>
					<td style=" width: 44%; border-top: 1px solid #000; border-right: 1px solid #000;"><b>: ' . $item->PARTYNAME . '</b></td>
					<td style=" width: 10%; border-top: 1px solid #000;border-left: 1px solid #000;"><b>Order no</b></td>
					<td style=" width: 20%; border-top: 1px solid #000;"><b>' . $item->SONO . '</b></td>
					<td style="text-align: right; width: 10%; border-top: 1px solid #000;"><b>Date : </b></td>
					<td style="text-align: left; width: 10%; border-top: 1px solid #000;border-right: 1px solid #000;"><b>' . $soDate . '</b></td>
				</tr>

				<tr class="heading" >
					<td style="width: 6%; border-left: 1px solid #000; "></td>
					<td style="width: 44%; border-right: 1px solid #000;">
						<span style="display: block;">' . $item->ADDRESS . '</span>
					</td>
					<td style=" width: 10%; border-left: 1px solid #000;"><b>Party PO No.<br>Cr Days</b></td>
					<td style=" width: 20%; "><b>' . $item->PARTYPONO . '<br>' . $item->CRDAYS . '</b></td>
					<td style="text-align: right;"><b>Del Date : </b></td>
					<td style="text-align: left; width: 10%; border-right: 1px solid #000;"><b>' . $soDateDel . '</b></td>
				</tr>
				<tr class="heading" style="" >
					<td style=" width: 50%;border-left: 1px solid #000; border-right: 1px solid #000;"></td>
					<td style=" width: 10%; border-left: 1px solid #000; "><b>Ship To</b></td>
					<td style=" width: 40%; border-right: 1px solid #000;"><b>' . $item->SHIPTO . '</b></td>
				</tr>
				<tr class="heading" style="" >
					<td style=" width: 6%; border-left: 1px solid #000; "><b>GSTIN</b></td>
					<td style=" width: 44%;border-right: 1px solid #000;"><b>: ' . $item->GSTIN . '</b></td>
					<td style=" width: 10%;border-left: 1px solid #000; "><b>Transport</b></td>
					<td style=" width: 40%;border-right: 1px solid #000;"><b>' . $item->TRANSNAME . '</b></td>
				</tr>
				<tr class="heading" style="" >
					<td style=" width: 6%; border-left: 1px solid #000; "><b>Agent</b></td>	
					<td style=" width: 44%; border-right: 1px solid #000;"><b>: ' . $item->AGENTNAME . '</b></td>
					<td style=" width: 10%;border-left: 1px solid #000;"><b>Destination</b></td>
					<td style=" width: 40%;border-right: 1px solid #000;"><b>' . $item->CITY . '</b></td>
				</tr>

				<tr class="heading" style="height: 18px;" border="1">
					<td style="width: 20%; text-align: center;" border="1"><b>ITEM NAME</b></td>
					<td style="width: 12%; text-align: center;" border="1"><b>DESIGN NO</b></td>
					<td style="width: 12%; text-align: center;" border="1"><b>SHADE</b></td>
					<td style="width: 6%; text-align: center;" border="1"><b>QTY</b></td>
					<td style="width: 13%; text-align: center;" border="1"><b>UNIT</b></td>
					<td style="width: 8%; text-align: center;" border="1"><b>CUT</b></td>
					<td style="width: 8%; text-align: center;" border="1"><b>MTRS</b></td>
					<td style="width: 8%; text-align: center;" border="1"><b>RATE</b></td>
					<td style="width: 13%; text-align: center;" border="1"><b>REMARK</b></td>
				</tr>';
			foreach ($item->SODETAILS as $itemSODetails) {
				$val = true;
				foreach ($itemSODetails->ITEMDETAILS as $itemvalDetails) {
					if ($val == true) {
						$html .=
							'<tr class="heading" style="height: 18px;">
								<td style="width: 20%; text-align: left;border-left: 1px solid #000; border-right: 1px solid #000;border-top: 1px solid #000; text-align: center;">' . $itemSODetails->ITEMNAME . '</td>
								<td style="width: 12%; text-align: left; border-right: 1px solid #000; border-top: 1px solid #000; text-align: center;">' . $itemvalDetails->DESIGN . '</td>
								<td style="width: 12%; text-align: left; border-right: 1px solid #000; border-top: 1px solid #000; text-align: center;">' . $itemvalDetails->COLOR . '</td>
								<td style="width: 6%; text-align: left; border-right: 1px solid #000; border-top: 1px solid #000; text-align: center;" >' . $itemvalDetails->QTY . '</td>
								<td style="width: 13%; text-align: left; border-right: 1px solid #000; border-top: 1px solid #000; text-align: center;">' . $itemvalDetails->UNIT . '</td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; border-top: 1px solid #000; text-align: center;" >' . $itemvalDetails->CUT . '</td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; border-top: 1px solid #000; text-align: center;" >' . $itemvalDetails->MTRS . '</td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; border-top: 1px solid #000; text-align: center;" >' . $itemvalDetails->RATE . '</td>
								<td style="width: 13%; text-align: left; border-right: 1px solid #000; border-top: 1px solid #000; text-align: center;">' . $itemvalDetails->REMARK . '</td>
						</tr>';
					} else {

						$html .=
							'<tr class="heading" style="height: 18px;">
								<td style="width: 20%; text-align: left;border-left: 1px solid #000; border-right: 1px solid #000; text-align: center;">' . $itemSODetails->ITEMNAME . '</td>
								<td style="width: 12%; text-align: left; border-right: 1px solid #000; text-align: center;">' . $itemvalDetails->DESIGN . '</td>
								<td style="width: 12%; text-align: left; border-right: 1px solid #000; text-align: center;">' . $itemvalDetails->COLOR . '</td>
								<td style="width: 6%; text-align: left; border-right: 1px solid #000; text-align: center;" >' . $itemvalDetails->QTY . '</td>
								<td style="width: 13%; text-align: left; border-right: 1px solid #000; text-align: center;">' . $itemvalDetails->UNIT . '</td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; text-align: center;" >' . $itemvalDetails->CUT . '</td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; text-align: center;" >' . $itemvalDetails->MTRS . '</td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; text-align: center;" >' . $itemvalDetails->RATE . '</td>
								<td style="width: 13%; text-align: left; border-right: 1px solid #000; text-align: center;">' . $itemvalDetails->REMARK . '</td>
						</tr>';
					}
					$val = false;
				}
			}
			$html .= '<tr class="heading" style="height: 18px;" border="1">
								<td style="width: 20%; text-align: left;border-left: 1px solid #000; border-right: 1px solid #000;border-top: 1px solid #000; text-align: center;"><br><br><br></td>
								<td style="width: 12%; text-align: left; border-right: 1px solid #000;border-top: 1px solid #000; text-align: center;"></td>
								<td style="width: 12%; text-align: left; border-right: 1px solid #000;border-top: 1px solid #000; text-align: center;"></td>
								<td style="width: 6%; text-align: left; border-right: 1px solid #000;border-top: 1px solid #000; text-align: center;" ></td>
								<td style="width: 13%; text-align: left; border-right: 1px solid #000;border-top: 1px solid #000; text-align: center;"></td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000;border-top: 1px solid #000; text-align: center;" ></td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000;border-top: 1px solid #000; text-align: center;" ></td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000;border-top: 1px solid #000; text-align: center;" ></td>
								<td style="width: 13%; text-align: left; border-right: 1px solid #000;border-top: 1px solid #000; text-align: center;"></td>
						</tr>
						<tr class="heading" style="">
								<td style="width: 20%; text-align: left;border-left: 1px solid #000; border-right: 1px solid #000; text-align: center;"></td>
								<td style="width: 12%; text-align: left; border-right: 1px solid #000; text-align: center;"></td>
								<td style="width: 12%; text-align: left; border-right: 1px solid #000; text-align: center;"><b>TOTAL :</b></td>
								<td style="width: 6%; text-align: left; border-right: 1px solid #000; text-align: center;" >' . $item->TOTALQTY . '</td>
								<td style="width: 13%; text-align: left; border-right: 1px solid #000; text-align: center;"></td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; text-align: center;" ></td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; text-align: center;" >' . $item->TOTALMTRS . '</td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; text-align: center;" >' . $item->TOTALAMT . '</td>
								<td style="width: 13%; text-align: left; border-right: 1px solid #000; text-align: center;"></td>
						</tr>
						<tr class="heading" style="height: 18px;">
								<td style="width: 75%; text-align: left;border-left: 1px solid #000; border-right: 1px solid #000; border-top: 1px solid #000; border-bottom: 1px solid #000; text-align: left;"><b>Special Instructions :</b><br>' . $item->SPECIALREMARKS . '</td>
								<td style="width: 25%; text-align: left;border-left: 1px solid #000; border-right: 1px solid #000; border-top: 1px solid #000; border-bottom: 1px solid #000; text-align: right;"><b>FOR&nbsp;&nbsp;' . $MainCompany->companyName . '</b><br><br><br></td>
						</tr>
                        <tr class="heading" style="height: 18px;">
                            <td style="height: 18px; width: 35%; text-align: left;"><b>Prepared By&nbsp;&nbsp;:&nbsp;</b>' . $item->USERNAME . '</td>
                            <td style="height: 18px; width: 30%; text-align: center;"><b>Checked By&nbsp;&nbsp;:&nbsp;</b></td>
                            <td style="height: 18px; width: 35%; text-align: right;"><b>E. & O. E.&nbsp;&nbsp;:&nbsp;</b></td>
                        </tr>
						</table>
				<div style="text-align: center;"><h5> Powered by Nakoda Infotech </h5></div>';
			// Print text using writeHTMLCell()
			$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 0, 0, true, '', true);
			if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral')) {
				mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral');
			}
			$path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/';


			$number = rand(100000, 999999);
			$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
			$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
			$pdf->Output($requirement_quotation_path, 'F');

			array_push($pdfurls, "https://onespaceinterior.com/" . $requirement_quotation);
		}
		// Include the main TCPDF library and TCPDI.
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		require_once(APPPATH . 'TCPDF/FPDI/src/autoload.php');
		// require_once(APPPATH.'TCPDF/FPDI/src/PdfParser/StreamReader.php');
		require_once(APPPATH . 'TCPDF/signpdf.php');
		$pdf = new Pdf();
		$pdf->SetAutoPageBreak(false);
		foreach ($pdfurls as $x) {
			$sign_file_path = file_get_contents($x);
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
				$tplIdx = $pdf->importPage($pageNo);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
			}
		}
		// 86400 = 1day

		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if ((int)(time() - filemtime($path . $file)) > 86400 && $file !== '.' && $file !== '..') {
					unlink($path . $file);
				}
			}
		}

		$number = rand(100000, 999999);
		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$pdf->Output($requirement_quotation_path, 'F');

		$response['success'] = true;
		$response['message'] = 'Data Inserted Successfully.';
		$response['requirement_quotation'] = "https://onespaceinterior.com/" . $requirement_quotation;
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
		exit();
	}

	public function generate_PurchaseOrder_Pdf()
	{

		$data = json_decode(file_get_contents('php://input'));
		$MainCompany	= $data->MainCompany;
		$dataList 		= $data->dataList;
		// die();
		// Include the main TCPDF library (search for installation path).
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		$pdfurls = array();

		foreach ($dataList as $item) {
			// create new PDF document
			$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

			// set default monospaced font
			$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

			// set some language-dependent strings (optional)
			if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
				require_once(dirname(__FILE__) . '/lang/eng.php');
				$pdf->setLanguageArray($l);
			}

			// set default font subsetting mode
			$pdf->setFontSubsetting(true);
			// Add a page
			// This method has several options, check the source code documentation for more information.
			$pdf->SetPrintHeader(false);
			$pdf->SetPrintFooter(false);
			$pdf->AddPage();

			$datevalue = str_replace('', 'T00:00:00', $item->PODATE);
			$soDate = date('d-m-Y', strtotime($datevalue));
			$datevalueDel = str_replace('', 'T00:00:00', $item->DELDATE);
			$soDateDel = date('d-m-Y', strtotime($datevalueDel));

			$html = '<h1 style="text-align: center;">' . $MainCompany->companyName . '</h1>
				<h6 style="text-align: center;">' . $MainCompany->companyAddress . '<br><b>GSTIN : ' . $MainCompany->GSTNO . '<br>PURCHASE ORDER</b></h6>
				<table style="width:100%;font-size:8px;font-family: Verdana;" cellspacing="0" cellpadding="2">
				<tr class="heading" style="">
					<td style="width: 6%;  border-top: 1px solid #000;border-left: 1px solid #000; "><b>Name</b></td>
					<td style=" width: 44%; border-top: 1px solid #000; border-right: 1px solid #000;"><b>: ' . $item->PARTYNAME . '</b></td>
					<td style=" width: 10%; border-top: 1px solid #000;border-left: 1px solid #000;"><b>PO no</b></td>
					<td style=" width: 20%; border-top: 1px solid #000;"><b>' . $item->PONO . '</b></td>
					<td style="text-align: right; width: 10%; border-top: 1px solid #000;"><b>Date : </b></td>
					<td style="text-align: left; width: 10%; border-top: 1px solid #000;border-right: 1px solid #000;"><b>' . $soDate . '</b></td>
				</tr>

				<tr class="heading" >
					<td style="width: 6%; border-left: 1px solid #000; "></td>
					<td style="width: 44%; border-right: 1px solid #000;">
						<span style="display: block;">' . $item->ADDRESS . '</span>
					</td>
					<td style=" width: 10%; border-left: 1px solid #000;"><b>Broker<br>Dyeing</b></td>
					<td style=" width: 20%; "><b>' . $item->AGENTNAME . '<br>' . $item->PODETAILS[0]->ITEMDETAILS[0]->DYEING . '</b></td>
					<td style="text-align: right;"><b>Disc : </b></td>
					<td style="text-align: left; width: 10%; border-right: 1px solid #000;"><b>' . $item->DISC . '</b></td>
				</tr>
				<tr class="heading" style="" >
					<td style=" width: 50%;border-left: 1px solid #000; border-right: 1px solid #000;"></td>
					<td style=" width: 10%; border-left: 1px solid #000; "><b>Transport</b></td>
					<td style=" width: 40%; border-right: 1px solid #000;"><b>' . $item->TRANSNAME . '</b></td>
				</tr>
				<tr class="heading" style="" >
					<td style=" width: 6%; border-left: 1px solid #000; "><b>GSTIN</b></td>
					<td style=" width: 44%;border-right: 1px solid #000;"><b>: ' . $item->GSTIN . '</b></td>
					<td style=" width: 10%;border-left: 1px solid #000;"><b>Del Period</b></td>
					<td style=" width: 20%;"><b>' . $item->DELPERIOD . '</b></td>
					<td style="text-align: right; width: 10%; "><b>Del Date : </b></td>
					<td style="text-align: left; width: 10%; border-right: 1px solid #000;"><b>' . $soDateDel . '</b></td>
				</tr>
				<tr class="heading" style="" >
					<td style=" width: 6%; border-left: 1px solid #000; "></td>	
					<td style=" width: 44%; border-right: 1px solid #000;"></td>
					<td style=" width: 10%;border-left: 1px solid #000;"><b>Cr Days</b></td>
					<td style=" width: 40%;border-right: 1px solid #000;"><b>' . $item->CRDAYS . '</b></td>
				</tr>

				<tr class="heading" style="height: 18px;" border="1">
					<td style="width: 6%; text-align: center;" border="1"><b>SR</b></td>
					<td style="width: 65%; text-align: center;" border="1"><b>DESCRIPTION</b></td>
					<td style="width: 8%; text-align: center;" border="1"><b>MTRS</b></td>
					<td style="width: 8%; text-align: center;" border="1"><b>RATE</b></td>
					<td style="width: 13%; text-align: center;" border="1"><b>TOTAL AMT</b></td>
				</tr>';
			$srNo = 1;

			foreach ($item->PODETAILS as $itemPODetails) {
				// $val = true;
				foreach ($itemPODetails->ITEMDETAILS as $itemvalDetails) {
					$html .=
						'<tr class="heading" style="height: 18px;" border="1">
							<td style="width: 6%; text-align: center;" border="1">' . $srNo . '</td>
							<td style="width: 25%; text-align: left;border-left: 1px solid #000;border-top: 1px solid #000;border-bottom: 1px solid #000;" >' . $itemPODetails->ITEMNAME . '</td>
							<td style="width: 20%; text-align: left;border-top: 1px solid #000;border-bottom: 1px solid #000;" >' . $itemvalDetails->DESIGN . '</td>
							<td style="width: 20%; text-align: left;border-right: 1px solid #000;border-top: 1px solid #000;border-bottom: 1px solid #000;" >' . $itemvalDetails->COLOR . '</td>
							<td style="width: 8%; text-align: center;" border="1">' . $itemvalDetails->MTRS . '</td>
							<td style="width: 8%; text-align: center;" border="1">' . $itemvalDetails->RATE . '</td>
							<td style="width: 13%; text-align: center;" border="1">' . $itemvalDetails->AMOUNT . ' AMT</td>
						</tr>';
					$srNo = $srNo + 1;
				}
			}
			$html .= '<tr class="heading" style="height: 18px;" border="1">
							<td style="width: 71%; text-align: left;border-right: 1px solid #000;border-left: 1px solid #000;" ><b>REMARKS</b>' . $item->SPECIALREMARKS . '<br><br><br><br><br></td>
							<td style="width: 8%; text-align: left;border-right: 1px solid #000;border-left: 1px solid #000;" ></td>
							<td style="width: 8%; text-align: left;border-right: 1px solid #000;border-left: 1px solid #000;" ></td>
							<td style="width: 13%; text-align: left;border-right: 1px solid #000;border-left: 1px solid #000;" ></td>
						</tr>
						<tr class="heading" style="">
								<td style="width: 71%; text-align: left;border-left: 1px solid #000; border-right: 1px solid #000; text-align: left;"><b>Prepared By :</b> ' . $item->USERNAME . '</td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; text-align: center;">' . $itemvalDetails->TOTALMTRS . '</td>
								<td style="width: 8%; text-align: left; border-right: 1px solid #000; text-align: center;" ></td>
								<td style="width: 13%; text-align: left; border-right: 1px solid #000; text-align: center;"></td>
						</tr>
						<tr class="heading" style="height: 18px;">
								<td style="width: 100%; text-align: right;border-left: 1px solid #000; border-right: 1px solid #000; border-top: 1px solid #000; border-bottom: 1px solid #000; text-align: right;"><b>FOR&nbsp;&nbsp;' . $MainCompany->companyName . '</b><br><br><br>Authorised Signatory</td>
						</tr>
						</table>
				<div style="text-align: center;"><h5> Powered by Nakoda Infotech </h5></div>';
			// Print text using writeHTMLCell()
			$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 0, 0, true, '', true);
			if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral')) {
				mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral');
			}
			$path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/';


			$number = rand(100000, 999999);
			$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
			$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
			$pdf->Output($requirement_quotation_path, 'F');

			array_push($pdfurls, "https://onespaceinterior.com/" . $requirement_quotation);
		}
		// Include the main TCPDF library and TCPDI.
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		require_once(APPPATH . 'TCPDF/FPDI/src/autoload.php');
		// require_once(APPPATH.'TCPDF/FPDI/src/PdfParser/StreamReader.php');
		require_once(APPPATH . 'TCPDF/signpdf.php');
		$pdf = new Pdf();
		$pdf->SetAutoPageBreak(false);
		foreach ($pdfurls as $x) {
			$sign_file_path = file_get_contents($x);
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
				$tplIdx = $pdf->importPage($pageNo);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
			}
		}
		// 86400 = 1day

		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if ((int)(time() - filemtime($path . $file)) > 86400 && $file !== '.' && $file !== '..') {
					unlink($path . $file);
				}
			}
		}

		$number = rand(100000, 999999);
		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$pdf->Output($requirement_quotation_path, 'F');

		$response['success'] = true;
		$response['message'] = 'Data Inserted Successfully.';
		$response['requirement_quotation'] = "https://onespaceinterior.com/" . $requirement_quotation;
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
		exit();
	}


	public function generate_TopReports_Pdf()
	{
		$data = json_decode(file_get_contents('php://input'));
		$MainCompany	= $data->MainCompany;
		$dataList 		= $data->dataList;
		// die();
		// Include the main TCPDF library (search for installation path).
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		$pdfurls = array();

		// foreach($dataList as $item) {
		// create new PDF document
		$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

		// set default monospaced font
		$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

		// set some language-dependent strings (optional)
		if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
			require_once(dirname(__FILE__) . '/lang/eng.php');
			$pdf->setLanguageArray($l);
		}

		// set default font subsetting mode
		$pdf->setFontSubsetting(true);
		// Add a page
		// This method has several options, check the source code documentation for more information.
		$pdf->SetPrintHeader(false);
		$pdf->SetPrintFooter(false);
		$pdf->AddPage();
		$datevalue = date('Y-m-d H:i:s');               // 03.10.01
		$today = date('d-m-Y', strtotime($datevalue));

		$html = '<table style="width:100%;font-family: Verdana;" cellspacing="0" cellpadding="2">
					<tr class="heading" style="height: 18px;" >
							<td style="width: 100%; text-align: center;font-size:21px;" ><b>' . $MainCompany->companyName . '</b></td>
						</tr>
						<tr class="heading" style="height: 18px;">
							<td style="width: 100%; text-align: center;border-bottom: 1px solid #000;font-size:10px;">' . $MainCompany->companyAddress . '</td>
						</tr>
						<tr class="heading" style="height: 18px;">
							<td style="width: 100%; text-align: center;font-size:12px;"><b>' . $MainCompany->reportName . '</b></td>
						</tr>
						<tr class="heading" style="height: 18px;">
							<td style="width: 20%; text-align: left;font-size:10px;border-bottom: 1px solid #000;">' . $today . '</td>
							<td style="width: 60%; text-align: center;font-size:10px;border-bottom: 1px solid #000;">' . $MainCompany->date . '</td>
							<td style="width: 20%; text-align: center;font-size:10px;border-bottom: 1px solid #000;"></td>
						</tr>
						<tr class="heading" style="height: 18px;">
							<td style="width: 6%; text-align: left;font-size:10px;border-bottom: 1px solid #000;"><b>Sr.</b></td>
							<td style="width: 29%; text-align: left;font-size:10px;border-bottom: 1px solid #000;"><b>' . $dataList[0][0] . '</b></td>
							<td style="width: 15%; text-align: left;font-size:10px;border-bottom: 1px solid #000;"><b>' . $dataList[0][1] . '</b></td>
							<td style="width: 14%; text-align: right;font-size:10px;border-bottom: 1px solid #000;"><b>' . $dataList[0][2] . '</b></td>
							<td style="width: 14%; text-align: right;font-size:10px;border-bottom: 1px solid #000;"><b>' . $dataList[0][3] . '</b></td>
							<td style="width: 14%; text-align: right;font-size:10px;border-bottom: 1px solid #000;"><b>' . $dataList[0][4] . '</b></td>
							<td style="width: 8%; text-align: right;font-size:10px;border-bottom: 1px solid #000;"><b>' . $dataList[0][5] . '</b></td>
						</tr>';
		$srNo = 1;
		$count = count($dataList);
		for ($i = 1; $i < $count - 1; $i++) {
			$html .=
				'<tr class="heading" style="height: 18px;" border="1">
							<td style="width: 6%; text-align: left;font-size:10px;">' . $srNo . '</td>
							<td style="width: 29%; text-align: left;font-size:10px;">' . $dataList[$i][0] . '</td>
							<td style="width: 15%; text-align: left;font-size:10px;">' . $dataList[$i][1] . '</td>
							<td style="width: 14%; text-align: right;font-size:10px;">' . $dataList[$i][2] . '</td>
							<td style="width: 14%; text-align: right;font-size:10px;">' . $dataList[$i][3] . '</td>
							<td style="width: 14%; text-align: right;font-size:10px;">' . $dataList[$i][4] . '</td>
							<td style="width: 8%; text-align: right;font-size:10px;">' . $dataList[$i][5] . '</td>
						</tr>';
			$srNo = $srNo + 1;
		}
		$html .= '<tr class="heading" style="height: 18px;" border="1">
							<td style="width: 6%; text-align: left;font-size:10px;border-bottom: 1px solid #000;border-top: 1px solid #000;"></td>
							<td style="width: 29%; text-align: left;font-size:10px;border-bottom: 1px solid #000;border-top: 1px solid #000;"><b>' . $dataList[$count - 1][0] . '</b></td>
							<td style="width: 15%; text-align: left;font-size:10px;border-bottom: 1px solid #000;border-top: 1px solid #000;"><b>' . $dataList[$count - 1][1] . '</b></td>
							<td style="width: 14%; text-align: right;font-size:10px;border-bottom: 1px solid #000;border-top: 1px solid #000;"><b>' . $dataList[$count - 1][2] . '</b></td>
							<td style="width: 14%; text-align: right;font-size:10px;border-bottom: 1px solid #000;border-top: 1px solid #000;"><b>' . $dataList[$count - 1][3] . '</b></td>
							<td style="width: 14%; text-align: right;font-size:10px;border-bottom: 1px solid #000;border-top: 1px solid #000;"><b>' . $dataList[$count - 1][4] . '</b></td>
							<td style="width: 8%; text-align: right;font-size:10px;border-bottom: 1px solid #000;border-top: 1px solid #000;"><b>' . $dataList[$count - 1][5] . '</b></td>
						</tr></table><div style="text-align: center;font-family: Verdana;"><h5> Powered by Nakoda Infotech </h5></div>';
		// Print text using writeHTMLCell()
		$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 0, 0, true, '', true);
		if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral')) {
			mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/viral');
		}
		$path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/';
		$number = rand(100000, 999999);
		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$pdf->Output($requirement_quotation_path, 'F');
		array_push($pdfurls, "https://onespaceinterior.com/" . $requirement_quotation);

		// Include the main TCPDF library and TCPDI.
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		require_once(APPPATH . 'TCPDF/FPDI/src/autoload.php');
		// require_once(APPPATH.'TCPDF/FPDI/src/PdfParser/StreamReader.php');
		require_once(APPPATH . 'TCPDF/signpdf.php');
		$pdf = new Pdf();
		$pdf->SetAutoPageBreak(false);
		foreach ($pdfurls as $x) {
			$sign_file_path = file_get_contents($x);
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
				$tplIdx = $pdf->importPage($pageNo);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
			}
		}
		// 86400 = 1day

		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if ((int)(time() - filemtime($path . $file)) > 86400 && $file !== '.' && $file !== '..') {
					unlink($path . $file);
				}
			}
		}

		$number = rand(100000, 999999);
		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$requirement_quotation = '/public/customer/projects/viral/requirement-' . $number . '.pdf';
		$pdf->Output($requirement_quotation_path, 'F');

		$response['success'] = true;
		$response['message'] = 'Data Inserted Successfully.';
		$response['requirement_quotation'] = "https://onespaceinterior.com/" . $requirement_quotation;
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($response);
		exit();
	}

	public function replaceMainDetails_NI()
	{
		if (empty($_FILES['jsonFile']['name']) || $_FILES['jsonFile']['name'] == '') {
			$response['success'] = false;
			$response['message'] = 'Signature Image is Missing.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
		$fileName = basename($_FILES['jsonFile']['name']);
		$filePath = $_SERVER['DOCUMENT_ROOT'] . '/api/' . $fileName;
		// echo $filePath; die;
		// Move the uploaded file and replace if it exists
		if (move_uploaded_file($_FILES['jsonFile']['tmp_name'], $filePath)) {
			$response['success'] = true;
			$response['message'] = 'Data Inserted Successfully.';
			$response['updatedFile'] = 'https://onespaceinterior.com/api/details.json';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		} else {
			$response['success'] = false;
			$response['message'] = 'Error Occurred While Inserting Data.';
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode($response);
			exit();
		}
	}

	function downloadReportViaAPi()
	{
		header('Content-Type: application/json');

		$post_data = file_get_contents("php://input");
		$request = json_decode($post_data);
		$projectMain = $request->project;
		// Include the main TCPDF library and TCPDI.
		require_once(APPPATH . 'TCPDF/tcpdf.php');
		require_once(APPPATH . 'TCPDF/FPDI/src/autoload.php');
		// require_once(APPPATH.'TCPDF/FPDI/src/PdfParser/StreamReader.php');
		require_once(APPPATH . 'TCPDF/signpdf.php');


		$pdf = new Pdf();
		$pdf->SetAutoPageBreak(false);

		//Drawing Index
		if ($request->timeline_type_name == 4) {
			$pdf->SetAutoPageBreak(false);
			$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page5.pdf');
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			$tplIdx = $pdf->importPage(1);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

			$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">
			   <tr><td style="height:50px;"></td></tr>
			<tr>
				<td style="height: 18px; width: 2%; text-align: center;">Sr</td>
			<td style="height: 18px; width: 25%;">
				<span style="display: block; width:100%; font-weight: 600;">Drawing Name</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Drawing No</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
			<span style="display: block; width:100%; font-weight: 600;">Made By</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Checked By</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Received By</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Recieved Date</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Sign</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Comments</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">File</span>
			</td>
			</tr>

			<tr><td style="height:5px;"></td></tr>';
			$timelinetypeName = 'DrawingIndex';
			$i = 0;
			$pdf->setLineWidth(0.5);
			foreach ($request->drawings as $key => $value) {
				if ($value->file_type == 'pdf') {
					$i = $i + 1;
					if ($i % 20 == 0) {
						$pdf->writeHTML($html, true, false, true, false, '');
						$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">';
						$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page4.pdf');
						$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
						$tplIdx = $pdf->importPage(1);
						$size = $pdf->getTemplateSize($tplIdx);
						$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
						$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
					}
					$q = $this->db->where('id', $value->updated_by)->get('users');
					$html .= '<tr class="heading" style="height: 18px;border: 10px;">
				<td border="10" style="border: 1px; height: 18px; width: 2%; text-align: center;">' . $i . '</td>
				<td style="border: 1px; height: 18px; width: 25%;">
					<span style="display: block; width:100%; font-weight: 600;">' . $value->timeline_detail_name . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->drawing_no . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">' . $value->created_by_name . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $q->row()->name . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' . '' . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .    substr($value->updated_at, 0, 10)  . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' . $value->status . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->remarks . '</span>
				</td>
				<td style="height: 18px; width: 9%; text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">
						<a href="https://onespaceinterior.com/public/' . $value->file_path . '" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: #007bff;">View</a>
					</span>
				</td>
				</tr>';
					// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
				}
			}
			$html .= '</table>';

			$pdf->writeHTML($html, true, false, true, false, '');
			if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/' . $projectMain->id)) {
				mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/' . $projectMain->id);
			}
			$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/' . $projectMain->id . '/' . $timelinetypeName . '.pdf';
			$requirement_quotation = 'public/customer/projects/' . $projectMain->id . '/' . $timelinetypeName . '.pdf';
			$pdf->SetCompression(true);
			$pdf->Output($requirement_quotation_path, 'F');

			// API response
			$response = [
				'reuestData' => $projectMain->id,  // fixed typo
				'file_url'   =>  "https://onespaceinterior.com/" . $requirement_quotation,
				'file_path'  => 'customer/projects/' . $projectMain->id . '/' . $timelinetypeName . '.pdf'
			];
			echo json_encode($response);
			return $response;
		}

		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page1.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

		$html = '<table style="width:100%;font-size:13px;" border="1" cellspacing="0" cellpadding="5">
   					<tr><td style="height:200px;"></td></tr>
    				<tr>
				        <td style="width:100%; text-align:center; font-weight:bold; color:#fff; font-size:28px;">
				            Project ID: ' . $projectMain->id . '
				        </td>
				    </tr>
				</table>';

		$pdf->writeHTML($html, true, false, true, false, '');

		// $pdf = new Pdf();
		$pdf->SetAutoPageBreak(false);
		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page2.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

		$PropertyType = $projectMain->room_type_id == 4 ? "2 BHK" : "3 BHK";
		$html = '<table style="width:100%;font-size:13px;" border="1" cellspacing="0" cellpadding="5">
   					<tr><td style="height:70px;"></td></tr>
    				<tr>
				        <td style="width:100%; text-align:left; font-weight:bold; color:#000; font-size:20px;">
						Project ID: ' . $projectMain->id . ' <br>
							Project Name: ' . $projectMain->name . ' <br>
							Carpet Area: ' . $projectMain->carpet_area . ' <br>
							Property Type: ' . $PropertyType . ' <br>
							City: Surat
				        </td>
				    </tr>
				</table>';

		$pdf->writeHTML($html, true, false, true, false, '');


		//Execution Timeline
		if ($request->timeline_type_name != 2) {
			$pdf->SetAutoPageBreak(false);
			$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page3.pdf');
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			$tplIdx = $pdf->importPage(1);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

			$PropertyType = $projectMain->room_type_id == 4 ? "2 BHK" : "3 BHK";
			$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">
   					<tr><td style="height:50px;"></td></tr>
    				<tr>
				        <td style="height: 18px; width: 2%; text-align: center;">Sr</td>
				<td style="height: 18px; width: 20%;">
					<span style="display: block; width:100%; font-weight: 600;">Timeline Name / Documents</span>
				</td>
				<td style="height: 18px; width: 6%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">Work</span>
				</td>
				<td style="height: 18px; width: 7%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Required Days</span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">Required Date</span>
				</td>
				<td style="height: 18px; width: 6%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">Actual Days</span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">Actual Date</span>
				</td>
				<td style="height: 18px; width: 6%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">Deviated Days</span>
				</td>
				<td style="height: 18px; width: 8%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">Remarks</span>
				</td>
				<td style="height: 18px; width: 7%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">Status</span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">Updated At</span>
				</td>
				<td style="height: 18px; width: 8%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">Comments</span>
				</td>
				    </tr>

					<tr><td style="height:5px;"></td></tr>';
			$i = 0;
			$pdf->setLineWidth(0.5);
			foreach ($request->getProjectTimelines as $key => $value) {
				$i = $i + 1;
				if ($i % 25 == 0) {
					$pdf->writeHTML($html, true, false, true, false, '');
					$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">';
					$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page4.pdf');
					$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
					$tplIdx = $pdf->importPage(1);
					$size = $pdf->getTemplateSize($tplIdx);
					$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
					$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
				}
				$html .= '<tr class="heading" style="height: 18px;border: 10px;">
				<td border="10" style="border: 1px; height: 18px; width: 2%; text-align: center;">' . $i . '</td>
				<td style="border: 1px; height: 18px; width: 20%;">
					<span style="display: block; width:100%; font-weight: 600;">' . $value->timeline_name . '</span>
				</td>
				<td style="height: 18px; width: 6%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->work_percentage . '</span>
				</td>
				<td style="height: 18px; width: 7%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">' . $value->required_days . '</span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->required_date . '</span>
				</td>
				<td style="height: 18px; width: 6%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' . ($value->actual_days) . '</span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->actual_date . '</span>
				</td>
				<td style="height: 18px; width: 6%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->deviated_days . '</span>
				</td>
				<td style="height: 18px; width: 8%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->remarks . '</span>
				</td>
				<td style="height: 18px; width: 7%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->status . '</span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  substr($value->updated_at, 0, 10) . '</span>
				</td>
				<td style="height: 18px; width: 8%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->comments[0] . '</span>
				</td>
				
				</tr>';
				// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
			}
			$html .= '</table>';
			$pdf->writeHTML($html, true, false, true, false, '');
		}

		//Designer Timeline
		if ($request->timeline_type_name == 2) {
			$pdf->SetAutoPageBreak(false);
			$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page10.pdf');
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			$tplIdx = $pdf->importPage(1);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

			$PropertyType = $projectMain->room_type_id == 4 ? "2 BHK" : "3 BHK";
			$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">
			   <tr><td style="height:50px;"></td></tr>
			<tr>
				<td style="height: 18px; width: 2%; text-align: center;">Sr</td>
			<td style="height: 18px; width: 20%;">
				<span style="display: block; width:100%; font-weight: 600;">Timeline Name / Documents</span>
			</td>
			<td style="height: 18px; width: 6%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Work</span>
			</td>
			<td style="height: 18px; width: 7%;text-align: center;">
			<span style="display: block; width:100%; font-weight: 600;">Required Days</span>
			</td>
			<td style="height: 18px; width: 10%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Required Date</span>
			</td>
			<td style="height: 18px; width: 6%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Actual Days</span>
			</td>
			<td style="height: 18px; width: 10%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Actual Date</span>
			</td>
			<td style="height: 18px; width: 6%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Deviated Days</span>
			</td>
			<td style="height: 18px; width: 8%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Remarks</span>
			</td>
			<td style="height: 18px; width: 7%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Status</span>
			</td>
			<td style="height: 18px; width: 10%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Updated At</span>
			</td>
			<td style="height: 18px; width: 8%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Comments</span>
			</td>
			</tr>

			<tr><td style="height:5px;"></td></tr>';
			$i = 0;
			$pdf->setLineWidth(0.5);
			foreach ($request->getProjectTimelines as $key => $value) {
				$i = $i + 1;
				if ($i % 30 == 0) {
					$pdf->writeHTML($html, true, false, true, false, '');
					$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">';
					$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page4.pdf');
					$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
					$tplIdx = $pdf->importPage(1);
					$size = $pdf->getTemplateSize($tplIdx);
					$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
					$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
				}
				$html .= '<tr class="heading" style="height: 18px;border: 10px;">
				<td border="10" style="border: 1px; height: 18px; width: 2%; text-align: center;">' . $i . '</td>
				<td style="border: 1px; height: 18px; width: 20%;">
					<span style="display: block; width:100%; font-weight: 600;">' . $value->timeline_name . '</span>
				</td>
				<td style="height: 18px; width: 6%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->work_percentage . '</span>
				</td>
				<td style="height: 18px; width: 7%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">' . $value->required_days . '</span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->required_date . '</span>
				</td>
				<td style="height: 18px; width: 6%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' . ($value->actual_days) . '</span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->actual_date . '</span>
				</td>
				<td style="height: 18px; width: 6%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->deviated_days . '</span>
				</td>
				<td style="height: 18px; width: 8%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->remarks . '</span>
				</td>
				<td style="height: 18px; width: 7%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->status . '</span>
				</td>
				<td style="height: 18px; width: 10%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  substr($value->updated_at, 0, 10) . '</span>
				</td>
				<td style="height: 18px; width: 8%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->comments[0] . '</span>
				</td>

				</tr>';
				// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
			}
			$html .= '</table>';
			$pdf->writeHTML($html, true, false, true, false, '');
		}

		//Drawing Index
		if ($request->timeline_type_name != 2) {
			$pdf->SetAutoPageBreak(false);
			$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page5.pdf');
			$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
			$tplIdx = $pdf->importPage(1);
			$size = $pdf->getTemplateSize($tplIdx);
			$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
			$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

			$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">
			   <tr><td style="height:50px;"></td></tr>
			<tr>
				<td style="height: 18px; width: 2%; text-align: center;">Sr</td>
			<td style="height: 18px; width: 25%;">
				<span style="display: block; width:100%; font-weight: 600;">Drawing Name</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Drawing No</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
			<span style="display: block; width:100%; font-weight: 600;">Made By</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Checked By</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Received By</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Recieved Date</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Sign</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Comments</span>
			</td>
			<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">File</span>
			</td>
			</tr>

			<tr><td style="height:5px;"></td></tr>';
			$i = 0;
			$pdf->setLineWidth(0.5);
			foreach ($request->drawings as $key => $value) {
				if ($value->file_type == 'pdf') {
					$i = $i + 1;
					if ($i % 20 == 0) {
						$pdf->writeHTML($html, true, false, true, false, '');
						$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">';
						$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page4.pdf');
						$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
						$tplIdx = $pdf->importPage(1);
						$size = $pdf->getTemplateSize($tplIdx);
						$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
						$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
					}
					$q = $this->db->where('id', $value->updated_by)->get('users');
					$html .= '<tr class="heading" style="height: 18px;border: 10px;">
				<td border="10" style="border: 1px; height: 18px; width: 2%; text-align: center;">' . $i . '</td>
				<td style="border: 1px; height: 18px; width: 25%;">
					<span style="display: block; width:100%; font-weight: 600;">' . $value->timeline_detail_name . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->drawing_no . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">' . $value->created_by_name . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $q->row()->name . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' . '' . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .    substr($value->updated_at, 0, 10)  . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' . $value->status . '</span>
				</td>
				<td style="height: 18px; width: 9%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->remarks . '</span>
				</td>
				<td style="height: 18px; width: 9%; text-align: center;">
    				<span style="display: block; width:100%; font-weight: 600;">
        				<a href="https://onespaceinterior.com/public/' . $value->file_path . '" target="_blank" style="text-decoration: underline; color: #007bff;">View</a>
   					</span>
				</td>
				</tr>';
					// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
				}
			}
			$html .= '</table>';

			$pdf->writeHTML($html, true, false, true, false, '');
		}


		//Site Visits
		$pdf->SetAutoPageBreak(false);
		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page7.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

		$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">
			   <tr><td style="height:50px;"></td></tr>
			<tr>
				<td style="height: 18px; width: 5%; text-align: center;">Sr</td>
			<td style="height: 18px; width: 20%;">
				<span style="display: block; width:100%; font-weight: 600;">Date</span>
			</td>
			<td style="height: 18px; width: 50%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Name</span>
			</td>
			<td style="height: 18px; width: 25%;text-align: center;">
				<span style="display: block; width:100%; font-weight: 600;">Notes</span>
			</td>
			</tr>

			<tr><td style="height:5px;"></td></tr>';
		$i = 0;
		$pdf->setLineWidth(0.5);
		foreach ($request->siteVisits as $key => $value) {
			$i = $i + 1;
			if ($i % 36 == 0) {
				$pdf->writeHTML($html, true, false, true, false, '');
				$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">';
				$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page4.pdf');
				$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
				$tplIdx = $pdf->importPage(1);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
			}
			$q = $this->db->where('id', $value->user_id)->get('users');
			$html .= '<tr class="heading" style="height: 18px;border: 10px;">
				<td border="10" style="border: 1px; height: 18px; width: 5%; text-align: center;">' . $i . '</td>
				<td style="height: 18px; width: 20%;text-align: left;">
					<span style="display: block; width:100%; font-weight: 600;">' .    substr($value->created_at, 0, 10)  . '</span>
				</td>
				<td style="height: 18px; width: 50%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $q->row()->name . '</span>
				</td>
				<td style="height: 18px; width: 25%;text-align: center;">
					<span style="display: block; width:100%; font-weight: 600;">' .  $value->location . '</span>
				</td>
			</tr>';
			// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>
		}
		$html .= '</table>';

		$pdf->writeHTML($html, true, false, true, false, '');




		//Todays Images
		$pdf->SetAutoPageBreak(false);
		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page6.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);

		$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">
			   <tr><td style="height:50px;"></td></tr>';
		$i = 0;
		$pdf->setLineWidth(0.5);
		$todayImages = (array) $request->todayImages;
		$firstKey = array_key_first($todayImages);
		$col = 0;
		foreach ($todayImages[$firstKey] as $img) {

			$i = $i + 1;
			if ($i % 8 == 0) {
				$pdf->writeHTML($html, true, false, true, false, '');
				$html = '<table style="width:100%;font-size:8px;" border="10" cellspacing="2" cellpadding="0">';
				$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page4.pdf');
				$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
				$tplIdx = $pdf->importPage(1);
				$size = $pdf->getTemplateSize($tplIdx);
				$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
				$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
			}

			if ($col % 2 == 0) {
				$html .= "<tr>";
			}

			// Build image URL
			$path = 'https://onespaceinterior.com/public/' . trim($img->file_path);

			$html .= '
				<td style="width:50%; text-align:center; border:1px solid #000; padding:10px;">
					<img src="' . $path . '" style="width:250px; height:150px; object-fit:cover; display:block; margin:5 auto;">
					<br>
				</td>
			';

			$col++;

			// Close the row after 2 images
			if ($col % 2 == 0) {
				$html .= "</tr>";
			}
			// <span style="display: block; width:100%; font-weight: 600;">'.($value->multiplier_enabled == 1 ? $project_query->carpet_area : $value->sq_ft).'<br/>SQFT</span>

		} // If odd number → close last row
		if ($col % 2 != 0) {
			$html .= "</tr>";
		}

		$html .= "</table>";

		$pdf->writeHTML($html, true, false, true, false, '');

		$pdf->SetAutoPageBreak(false);
		$sign_file_path = file_get_contents('https://onespaceinterior.com/public/uploads/StoreRequirment/page8.pdf');
		$pageCount = $pdf->setSourceFile(StreamReader::createByString($sign_file_path));
		$tplIdx = $pdf->importPage(1);
		$size = $pdf->getTemplateSize($tplIdx);
		$pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
		$pdf->useTemplate($tplIdx, 0, 0, $size['width'], $size['height']);
		$timelineSummary = (array) $request->timelineSummary;

		$firstKey = array_key_first($timelineSummary);

		$summary = $timelineSummary[$firstKey];

		$workDone = $summary->work_done;
		$actualDays = $summary->actual_days;
		$remainingDays = $summary->remaining_days;
		$html = '<table style="width:100%;font-size:13px;" border="1" cellspacing="0" cellpadding="5">
   					<tr><td style="height:80px;"></td></tr>
    				<tr><td style="border: 1px; height: 18px; width: 72%;"></td>
				        <td style="width:100%; text-align:left; font-weight:bold; color:#fff; font-size:28px;">' . $request->totalVisits . '<br><br>' . $workDone . '%<br><br>' . $actualDays . '<br><br>' . $remainingDays . '
				        </td>
				    </tr>
				</table>';

		$pdf->writeHTML($html, true, false, true, false, '');
		$timelinetypeName = $request->timeline_type_name == 2 ? 'Designer' : 'Execution';
		if (!file_exists($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/' . $projectMain->id)) {
			mkdir($_SERVER['DOCUMENT_ROOT'] . 'public/customer/projects/' . $projectMain->id);
		}
		$requirement_quotation_path = $_SERVER['DOCUMENT_ROOT'] . '/public/customer/projects/' . $projectMain->id . '/' . $timelinetypeName . '-' . $request->totalVisits . '.pdf';
		$requirement_quotation = 'public/customer/projects/' . $projectMain->id . '/' . $timelinetypeName . '-' . $request->totalVisits . '.pdf';
		$pdf->SetCompression(true);
		$pdf->Output($requirement_quotation_path, 'F');

		// API response
		$response = [
			'reuestData' => $projectMain->id,  // fixed typo
			'file_url'   =>  "https://onespaceinterior.com/" . $requirement_quotation,
			'file_path'  => 'customer/projects/' . $projectMain->id . '/' . $timelinetypeName . '-' . $request->totalVisits . '.pdf'
		];


		// $response = [
		// 	'reuestData' => $project->id,  // fixed typo
		// 	'file_url'   => 'https://onespaceinterior.com/public/uploads/StoreRequirment/startingPages.pdf',
		// 	'file_path'  => 'uploads/StoreRequirment/startingPages.pdf'
		// ];
		echo json_encode($response);
	}
}
