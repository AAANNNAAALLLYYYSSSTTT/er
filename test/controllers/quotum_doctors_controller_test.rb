require 'test_helper'

class QuotumDoctorsControllerTest < ActionController::TestCase
  setup do
    @quotum_doctor = quotum_doctors(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:quotum_doctors)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create quotum_doctor" do
    assert_difference('QuotumDoctor.count') do
      post :create, quotum_doctor: { currently: @quotum_doctor.currently, day: @quotum_doctor.day, description: @quotum_doctor.description, doctor_id: @quotum_doctor.doctor_id, full: @quotum_doctor.full, month: @quotum_doctor.month, post_id: @quotum_doctor.post_id, status_id: @quotum_doctor.status_id, year: @quotum_doctor.year }
    end

    assert_redirected_to quotum_doctor_path(assigns(:quotum_doctor))
  end

  test "should show quotum_doctor" do
    get :show, id: @quotum_doctor
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @quotum_doctor
    assert_response :success
  end

  test "should update quotum_doctor" do
    patch :update, id: @quotum_doctor, quotum_doctor: { currently: @quotum_doctor.currently, day: @quotum_doctor.day, description: @quotum_doctor.description, doctor_id: @quotum_doctor.doctor_id, full: @quotum_doctor.full, month: @quotum_doctor.month, post_id: @quotum_doctor.post_id, status_id: @quotum_doctor.status_id, year: @quotum_doctor.year }
    assert_redirected_to quotum_doctor_path(assigns(:quotum_doctor))
  end

  test "should destroy quotum_doctor" do
    assert_difference('QuotumDoctor.count', -1) do
      delete :destroy, id: @quotum_doctor
    end

    assert_redirected_to quotum_doctors_path
  end
end
